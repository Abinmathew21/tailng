import fs from "node:fs";

const targets = (process.argv[2] ?? "").trim();
const releaseType = (process.argv[3] ?? "").trim().toLowerCase();

const has = (t) => ("," + targets + ",").includes("," + t + ",");

// Validate releaseType
if (!["minor", "major"].includes(releaseType)) {
  console.error(`ERROR: Invalid release_type '${releaseType}'. Use minor|major`);
  process.exit(1);
}

console.log(`Bumping versions with release_type: ${releaseType}`);

const bumpSemver = (v) => {
  const [majS, minS, patS] = v.split(".");
  let major = Number(majS);
  let minor = Number(minS);
  let patch = Number((patS ?? "0").replace(/[^0-9].*$/, ""));

  if (releaseType === "minor") {
    minor += 1;
    patch = 0;
  } else if (releaseType === "major") {
    major += 1;
    minor = 0;
    patch = 0;
  } else {
    throw new Error(`Invalid releaseType: ${releaseType}`);
  }
  return `${major}.${minor}.${patch}`;
};

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const writeJson = (p, j) => fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");

// 1) bump root package.json version
{
  const p = "package.json";
  const j = readJson(p);
  const next = bumpSemver(j.version);
  j.version = next;
  writeJson(p, j);
  console.log(`[root] ${next}`);
}

// 2) bump selected libs versions
const libs = [
  ["cdk", "libs/tailng-ui/cdk/package.json", "@tailng-ui/cdk"],
  ["primitives", "libs/tailng-ui/primitives/package.json", "@tailng-ui/primitives"],
  ["components", "libs/tailng-ui/components/package.json", "@tailng-ui/components"],
  ["theme", "libs/tailng-ui/theme/package.json", "@tailng-ui/theme"],
  ["icons", "libs/tailng-ui/icons/package.json", "@tailng-ui/icons"],
  ["registry", "libs/tailng-ui/registry/package.json", "@tailng-ui/registry"],
  ["charts", "libs/tailng-ui/charts/package.json", "@tailng-ui/charts"],
  ["cli", "libs/tailng/cli/package.json", "@tailng/cli"],
];

for (const [key, path, label] of libs) {
  if (!has(key)) continue;
  const j = readJson(path);
  const next = bumpSemver(j.version);
  j.version = next;
  writeJson(path, j);
  console.log(`[pkg] ${label} -> ${next}`);
}

// 3) align primitives peerDeps (only if primitives selected)
// primitives depends on cdk
if (has("primitives")) {
  const primitivesPath = "libs/tailng-ui/primitives/package.json";
  const primitives = readJson(primitivesPath);

  const cdkV = readJson("libs/tailng-ui/cdk/package.json").version;

  primitives.peerDependencies ||= {};

  // Only rewrite keys that already exist (avoid introducing new constraints silently)
  if (primitives.peerDependencies["@tailng-ui/cdk"]) {
    primitives.peerDependencies["@tailng-ui/cdk"] = `^${cdkV}`;
  }

  writeJson(primitivesPath, primitives);
  console.log(`[peerDeps] primitives: cdk=^${cdkV}`);
}

// 4) align components peerDeps (only if components selected)
// components depends on cdk + primitives
if (has("components")) {
  const componentsPath = "libs/tailng-ui/components/package.json";
  const components = readJson(componentsPath);

  const cdkV = readJson("libs/tailng-ui/cdk/package.json").version;
  const primitivesV = readJson("libs/tailng-ui/primitives/package.json").version;

  components.peerDependencies ||= {};

  if (components.peerDependencies["@tailng-ui/cdk"]) {
    components.peerDependencies["@tailng-ui/cdk"] = `^${cdkV}`;
  }
  if (components.peerDependencies["@tailng-ui/primitives"]) {
    components.peerDependencies["@tailng-ui/primitives"] = `^${primitivesV}`;
  }

  writeJson(componentsPath, components);
  console.log(`[peerDeps] components: cdk=^${cdkV} primitives=^${primitivesV}`);
}