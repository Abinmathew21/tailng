import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const targets = (
  process.env.TARGETS?.replace(/^,|,$/g, "") ??
  (process.argv[2] ?? "")
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .join(",");

const npmTag = (process.argv[3] ?? "latest").trim();

if (!targets) {
  console.error("publish-selected: targets is empty");
  process.exit(1);
}

if (/(\s)/.test(targets)) {
  console.error(
    `publish-selected: targets must be comma-separated without spaces. Received: "${targets}"`,
  );
  process.exit(1);
}

// NOTE: targets are expected to be comma-separated with no spaces.
const has = (t) => ("," + targets + ",").includes("," + t + ",");

const run = (cmd, cwd) =>
  execSync(cmd, {
    stdio: "inherit",
    cwd,
    env: { ...process.env },
  });

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeJson(p, value) {
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function fail(msg) {
  console.error(`publish-selected: ${msg}`);
  process.exit(1);
}

function collectPackageVersions() {
  const versions = new Map();

  // Prefer versions from dist outputs when available.
  for (const dir of Object.values(DIST_DIR)) {
    const pkgPath = path.join(dir, "package.json");
    if (!fs.existsSync(pkgPath)) continue;
    const pkg = readJson(pkgPath);
    if (typeof pkg.name === "string" && typeof pkg.version === "string") {
      versions.set(pkg.name, pkg.version);
    }
  }

  // Fallback to source package versions.
  const sourcePackages = [
    "libs/tailng-ui/cdk/package.json",
    "libs/tailng-ui/primitives/package.json",
    "libs/tailng-ui/components/package.json",
    "libs/tailng-ui/icons/package.json",
    "libs/tailng-ui/theme/package.json",
    "libs/tailng-ui/registry/package.json",
    "libs/tailng-ui/charts/package.json",
    "libs/tailng/cli/package.json",
  ];

  for (const pkgPath of sourcePackages) {
    if (!fs.existsSync(pkgPath)) continue;
    const pkg = readJson(pkgPath);
    if (typeof pkg.name === "string" && typeof pkg.version === "string" && !versions.has(pkg.name)) {
      versions.set(pkg.name, pkg.version);
    }
  }

  return versions;
}

function resolveWorkspaceRange(rawRange, depName, versions) {
  if (!rawRange.startsWith("workspace:")) return rawRange;

  const protocol = rawRange.slice("workspace:".length).trim();
  const depVersion = versions.get(depName);
  if (!depVersion) {
    fail(
      `cannot resolve workspace protocol for '${depName}' ('${rawRange}'): dependency version not found in dist/source package manifests`,
    );
  }

  if (protocol === "" || protocol === "*") {
    return depVersion;
  }

  if (protocol === "^" || protocol === "~") {
    return `${protocol}${depVersion}`;
  }

  // Allow explicit semver/range after workspace: and pass through unchanged.
  if (/^[~^<>=]?\d/.test(protocol)) {
    return protocol;
  }

  fail(`unsupported workspace protocol range '${rawRange}' for '${depName}'`);
}

function rewriteWorkspaceProtocols(pkg, pkgPath, versions) {
  let changed = false;
  const fields = [
    "dependencies",
    "peerDependencies",
    "optionalDependencies",
    "devDependencies",
  ];

  for (const field of fields) {
    const deps = pkg[field];
    if (!deps) continue;
    for (const [name, range] of Object.entries(deps)) {
      if (typeof range !== "string" || !range.startsWith("workspace:")) continue;
      const nextRange = resolveWorkspaceRange(range, name, versions);
      if (nextRange !== range) {
        deps[name] = nextRange;
        changed = true;
      }
    }
  }

  if (changed) {
    writeJson(pkgPath, pkg);
  }
}

function assertNoWorkspaceProtocols(pkg, dir) {
  const fields = ["dependencies", "peerDependencies", "optionalDependencies"];
  for (const field of fields) {
    const deps = pkg[field];
    if (!deps) continue;
    for (const [name, range] of Object.entries(deps)) {
      if (typeof range !== "string") continue;
      if (range.startsWith("workspace:")) {
        fail(
          `${pkg.name ?? "<unknown>"} in ${dir} contains workspace protocol for '${name}': '${range}'. ` +
            "Dist package.json must use real semver ranges before publishing.",
        );
      }
    }
  }
}

const publish = (dir) => {
  if (!fs.existsSync(dir)) {
    fail(`Publish directory not found: ${dir}`);
  }

  const pkgPath = path.join(dir, "package.json");
  if (!fs.existsSync(pkgPath)) {
    fail(`Missing package.json in publish directory: ${dir}`);
  }

  const pkg = readJson(pkgPath);
  rewriteWorkspaceProtocols(pkg, pkgPath, packageVersions);
  const publishPkg = readJson(pkgPath);
  const name = publishPkg.name ?? dir;
  const version = publishPkg.version ?? "";

  assertNoWorkspaceProtocols(publishPkg, dir);

  console.log(`Publishing ${name}@${version} with tag ${npmTag}`);

  const cmdParts = ["npm publish", "--access public", `--tag ${npmTag}`];

  // If CI=true, request npm provenance (Trusted Publishing / OIDC compatible).
  if (process.env.CI === "true") {
    cmdParts.push("--provenance");
  }

  const cmd = cmdParts.join(" ");

  if (process.env.DRY_RUN === "true") {
    console.log(`DRY_RUN=true, skipping: ${cmd} (cwd: ${dir})`);
    return;
  }

  run(cmd, dir);
};

// Target -> dist directory mapping (publish from dist output)
// Nx outputs in this repo are under dist/libs/tailng-ui/* (and dist/libs/tailng/* for cli).
const DIST_DIR = {
  cdk: "dist/libs/tailng-ui/cdk",
  primitives: "dist/libs/tailng-ui/primitives",
  components: "dist/libs/tailng-ui/components",
  icons: "dist/libs/tailng-ui/icons",
  theme: "dist/libs/tailng-ui/theme",
  registry: "dist/libs/tailng-ui/registry",
  charts: "dist/libs/tailng-ui/charts",
  cli: "dist/libs/tailng/cli",
};

// Publish in dependency order:
// - primitives depends on cdk
// - components depends on primitives
// - others are effectively independent (icons/theme are often peer deps)
const ORDER = [
  // dependency order
  "cdk",
  "primitives",
  "components",

  // mostly independent
  "icons",
  "theme",
  "registry",
  "charts",
  "cli",
];

const packageVersions = collectPackageVersions();

for (const t of ORDER) {
  if (!has(t)) continue;

  const dir = DIST_DIR[t];
  if (!dir) {
    fail(`No dist mapping for target '${t}'. Update DIST_DIR.`);
  }

  publish(dir);
}

console.log("publish-selected: done");
