import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const targets =
  process.env.TARGETS?.replace(/^,|,$/g, "") ??
  (process.argv[2] ?? "");

const npmTag = (process.argv[3] ?? "latest").trim();

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

function fail(msg) {
  console.error(`publish-selected: ${msg}`);
  process.exit(1);
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
  const name = pkg.name ?? dir;
  const version = pkg.version ?? "";

  assertNoWorkspaceProtocols(pkg, dir);

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
const DIST_DIR = {
  cdk: "dist/libs/cdk",
  primitives: "dist/libs/primitives",
  components: "dist/libs/components",
  icons: "dist/libs/icons",
  theme: "dist/libs/theme",
  registry: "dist/libs/registry",
  charts: "dist/libs/charts",
  // cli dist output path can vary by workspace; enable only when confirmed.
  // cli: "dist/libs/cli",
};

// Publish in dependency order:
// - primitives depends on cdk
// - components depends on primitives
// - others are effectively independent (icons/theme are often peer deps)
const ORDER = [
  "cdk",
  "icons",
  "primitives",
  "components",
  "theme",
  "registry",
  "charts",
  // "cli",
];

for (const t of ORDER) {
  if (!has(t)) continue;
  const dir = DIST_DIR[t];
  if (!dir) continue;
  publish(dir);
}

console.log("publish-selected: done");