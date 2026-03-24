import fs from "node:fs";
import path from "node:path";

export function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function writeJson(p, value) {
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function fail(msg) {
  console.error(msg);
  process.exit(1);
}

export function collectPackageVersions(distDirs, sourcePackages) {
  const versions = new Map();

  for (const dir of Object.values(distDirs)) {
    const pkgPath = path.join(dir, "package.json");
    if (!fs.existsSync(pkgPath)) continue;
    const pkg = readJson(pkgPath);
    if (typeof pkg.name === "string" && typeof pkg.version === "string") {
      versions.set(pkg.name, pkg.version);
    }
  }

  for (const pkgPath of sourcePackages) {
    if (!fs.existsSync(pkgPath)) continue;
    const pkg = readJson(pkgPath);
    if (typeof pkg.name === "string" && typeof pkg.version === "string" && !versions.has(pkg.name)) {
      versions.set(pkg.name, pkg.version);
    }
  }

  return versions;
}

export function resolveWorkspaceRange(rawRange, depName, versions) {
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

  if (/^[~^<>=]?\d/.test(protocol)) {
    return protocol;
  }

  fail(`unsupported workspace protocol range '${rawRange}' for '${depName}'`);
}

export function rewriteWorkspaceProtocols(pkg, pkgPath, versions) {
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

export function assertNoWorkspaceProtocols(pkg, dir) {
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
