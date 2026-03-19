import fs from "node:fs";
import path from "node:path";

const targets = process.argv[2] ?? "";
const selected = new Set(
  targets
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);

const DIST = path.resolve("dist");

// Nx outputs libraries under dist/libs/<scope>/<project>
// e.g. dist/libs/tailng-ui/cdk, dist/libs/tailng/cli
const TAILNG_UI_LIBS = new Set([
  "cdk",
  "primitives",
  "components",
  "theme",
  "icons",
  "registry",
  "charts",
]);

const libDist = (name) => {
  if (TAILNG_UI_LIBS.has(name)) {
    return path.join(DIST, "libs", "tailng-ui", name);
  }

  // fallback for other scopes (e.g. dist/libs/tailng/cli)
  return path.join(DIST, "libs", "tailng", name);
};

const exists = (p) => fs.existsSync(p);
const stat = (p) => fs.statSync(p);

const fail = (msg) => {
  console.error(`assert-bundles: ${msg}`);
  process.exit(1);
};

const warn = (msg) => console.warn(`⚠️  assert-bundles: ${msg}`);

function listFiles(dir, predicate) {
  if (!exists(dir)) return [];
  const out = [];
  const walk = (d) => {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (!predicate || predicate(full)) out.push(full);
    }
  };
  walk(dir);
  return out;
}

function resolveTypesFiles(root) {
  const candidates = [
    path.join(root, "types"),
    path.join(root, "src"),
    root,
  ];

  for (const dir of candidates) {
    if (!exists(dir)) continue;

    const dts = listFiles(dir, (f) => f.endsWith(".d.ts"));
    if (dts.length > 0) {
      return { baseDir: dir, files: dts };
    }
  }

  return { baseDir: root, files: [] };
}

function resolveFesmFiles(root) {
  const candidates = [
    path.join(root, "fesm2022"),
    path.join(root, "esm2022"),
    path.join(root, "fesm2015"),
    path.join(root, "esm2015"),
    path.join(root, "bundles"),
    path.join(root, "src"),
    root,
  ];

  for (const dir of candidates) {
    if (!exists(dir)) continue;

    const mjs = listFiles(dir, (f) => f.endsWith(".mjs") || f.endsWith(".js"));
    if (mjs.length > 0) {
      return { baseDir: dir, files: mjs };
    }
  }

  return { baseDir: root, files: [] };
}

/**
 * Per-package sanity thresholds
 * - cdk entrypoints can be tiny but valid (e.g., 1–2 directives/utilities)
 * - components bundles should never be tiny if they contain real implementations
 */
const THRESHOLDS = {
  cdk: { minMjs: 700, minDts: 150 },
  icons: { minMjs: 900, minDts: 150 },
  primitives: { minMjs: 1200, minDts: 150 },
  components: { minMjs: 1800, minDts: 200, componentsFormControlsMin: 20_000 },
  // theme is asset-only checks
};

function assertAngularPackage(name, opts) {
  const root = libDist(name);
  if (!exists(root)) fail(`Missing dist folder: ${root}`);

  const pkgJson = path.join(root, "package.json");
  if (!exists(pkgJson)) fail(`Missing ${name} package.json in dist: ${pkgJson}`);

  // Types (ng-packagr may emit `types/`, or put d.ts under `src/`, or at root)
  const types = resolveTypesFiles(root);
  if (types.files.length === 0) {
    fail(`${name}: no .d.ts files found (expected under types/, src/, or package root)`);
  }

  for (const f of types.files) {
    const size = stat(f).size;
    if (size < opts.minDts) {
      warn(`${name}: small d.ts: ${path.relative(root, f)} (${size} bytes)`);
    }
  }

  // JS bundles (ng-packagr usually emits fesm2022/, but some builds may place JS under esm*/bundles/src)
  const fesm = resolveFesmFiles(root);
  if (fesm.files.length === 0) {
    fail(`${name}: no .mjs/.js files found (expected under fesm2022/, esm2022/, bundles/, src/, or package root)`);
  }

  for (const f of fesm.files) {
    const size = stat(f).size;
    if (size < opts.minMjs) {
      fail(`${name}: suspiciously small bundle: ${path.relative(root, f)} (${size} bytes)`);
    }
  }
}

function assertThemePackage() {
  const root = libDist("theme");
  if (!exists(root)) fail(`Missing dist folder: ${root}`);

  const pkgJson = path.join(root, "package.json");
  if (!exists(pkgJson)) fail(`theme: missing package.json in dist: ${pkgJson}`);

  const tokensIndex = path.join(root, "tokens", "index.css");
  if (!exists(tokensIndex)) fail(`theme: missing tokens/index.css in dist: ${tokensIndex}`);

  const tokensCss = listFiles(path.join(root, "tokens"), (f) => f.endsWith(".css"));
  if (tokensCss.length === 0) fail(`theme: tokens folder has no css files`);

  const tailwindPreset = path.join(root, "tailwind", "tailng.preset.cjs");
  if (!exists(tailwindPreset)) fail(`theme: missing tailwind/tailng.preset.cjs in dist: ${tailwindPreset}`);
}

function assertComponentsSpecific() {
  const root = libDist("components");

  // strongest check for the historically problematic bundle
  const candidates = [
    path.join(root, "fesm2022", "tailng-ui-components-form-controls.mjs"),
  ].filter(exists);

  // If naming differs in future, fall back to pattern search
  const fallback =
    candidates.length === 0
      ? listFiles(path.join(root, "fesm2022"), (f) => f.endsWith("components-form-controls.mjs"))
      : [];

  const files = candidates.length ? candidates : fallback;

  if (files.length === 0) {
    warn(`components: could not find form-controls bundle by name; skipping strict componentsFormControlsMin check`);
    return;
  }

  const min = THRESHOLDS.components.componentsFormControlsMin;
  for (const f of files) {
    const size = stat(f).size;
    if (size < min) {
      fail(`components: form-controls bundle too small (${size} bytes). Likely stub output: ${path.relative(root, f)}`);
    }
  }
}

function assertCdkPackage() {
  const root = libDist("cdk");
  if (!exists(root)) fail(`Missing dist folder: ${root}`);

  const pkgJson = path.join(root, "package.json");
  if (!exists(pkgJson)) fail(`cdk: missing package.json in dist`);

  const types = resolveTypesFiles(root);
  if (types.files.length === 0) fail(`cdk: no .d.ts files found (expected under types/, src/, or package root)`);

  const fesm = resolveFesmFiles(root);
  if (fesm.files.length === 0) fail(`cdk: no .mjs/.js files found (expected under fesm2022/, esm2022/, bundles/, src/, or package root)`);

  const mjsFiles = fesm.files;

  // Require at least ONE non-trivial bundle (guards against total stub publish)
  const hasRealBundle = mjsFiles.some((f) => stat(f).size > 700);

  if (!hasRealBundle) {
    fail(
      `cdk: all bundles are tiny — this looks like a broken build (sizes: ${mjsFiles
        .map((f) => stat(f).size)
        .join(", ")})`
    );
  }
}

const wants = (t) => selected.has(t);

if (wants("cdk")) assertCdkPackage();
if (wants("icons")) assertAngularPackage("icons", THRESHOLDS.icons);
if (wants("primitives")) assertAngularPackage("primitives", THRESHOLDS.primitives);
if (wants("components")) {
  assertAngularPackage("components", THRESHOLDS.components);
  assertComponentsSpecific();
}
if (wants("theme")) assertThemePackage();

// docs is not an npm package check here

console.log("assert-bundles: all selected dist outputs look sane.");