import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  assertNoWorkspaceProtocols,
  collectPackageVersions,
  readJson,
  rewriteWorkspaceProtocols,
} from "./package-manifest-utils.mjs";

const DIST_DIR = {
  registry: "dist/libs/tailng-ui/registry",
  cli: "dist/libs/tailng/cli",
};

const SOURCE_PACKAGES = [
  "libs/tailng-ui/cdk/package.json",
  "libs/tailng-ui/primitives/package.json",
  "libs/tailng-ui/components/package.json",
  "libs/tailng-ui/icons/package.json",
  "libs/tailng-ui/theme/package.json",
  "libs/tailng-ui/registry/package.json",
  "libs/tailng-ui/charts/package.json",
  "libs/tailng/cli/package.json",
];

function ensureDistDir(dir) {
  if (!fs.existsSync(dir)) {
    throw new Error(`cli-smoke-test: missing dist folder ${dir}`);
  }
}

function packTarball(dir) {
  const before = new Set(
    fs.readdirSync(dir).filter((entry) => entry.endsWith(".tgz")),
  );
  const output = execFileSync("npm", ["pack", "--json"], {
    cwd: dir,
    env: smokeEnv,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
  const parsed = JSON.parse(output);
  const after = fs
    .readdirSync(dir)
    .filter((entry) => entry.endsWith(".tgz") && !before.has(entry));

  if (after.length === 1) {
    return path.join(dir, after[0]);
  }

  const reportedFilename = parsed[0]?.filename;
  if (typeof reportedFilename === "string" && reportedFilename.length > 0) {
    const reportedPath = path.join(dir, reportedFilename);
    if (fs.existsSync(reportedPath)) {
      return reportedPath;
    }
  }

  const packedFilePath = parsed[0]?.files
    ?.map((entry) => entry?.path)
    ?.find((entry) => typeof entry === "string" && entry.endsWith(".tgz"));
  if (typeof packedFilePath === "string" && packedFilePath.length > 0) {
    const resolvedPackedPath = path.join(dir, packedFilePath);
    if (fs.existsSync(resolvedPackedPath)) {
      return resolvedPackedPath;
    }
  }

  throw new Error(`cli-smoke-test: unable to resolve tarball name from npm pack in ${dir}`);
}

function runTailng(binPath, args, cwd) {
  return execFileSync(binPath, args, {
    cwd,
    env: smokeEnv,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

let smokeEnv = process.env;

function main() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "tailng-cli-smoke-"));
  const npmCacheRoot = path.join(tempRoot, ".npm-cache");
  smokeEnv = {
    ...process.env,
    npm_config_cache: npmCacheRoot,
  };

  const distCliDir = path.resolve(DIST_DIR.cli);
  const distRegistryDir = path.resolve(DIST_DIR.registry);
  ensureDistDir(distCliDir);
  ensureDistDir(distRegistryDir);

  const packageVersions = collectPackageVersions(DIST_DIR, SOURCE_PACKAGES);
  const cliPkgPath = path.join(distCliDir, "package.json");
  const cliPkg = readJson(cliPkgPath);
  rewriteWorkspaceProtocols(cliPkg, cliPkgPath, packageVersions);
  const normalizedCliPkg = readJson(cliPkgPath);
  assertNoWorkspaceProtocols(normalizedCliPkg, distCliDir);

  const registryPkgPath = path.join(distRegistryDir, "package.json");
  const registryPkg = readJson(registryPkgPath);
  rewriteWorkspaceProtocols(registryPkg, registryPkgPath, packageVersions);
  assertNoWorkspaceProtocols(readJson(registryPkgPath), distRegistryDir);

  const installRoot = path.join(tempRoot, "workspace");
  const tslibPath = path.resolve("node_modules/tslib");
  fs.mkdirSync(installRoot, { recursive: true });
  fs.writeFileSync(
    path.join(installRoot, "package.json"),
    JSON.stringify({ name: "tailng-cli-smoke", private: true }, null, 2),
  );

  let cliTarball = "";
  let registryTarball = "";

  try {
    registryTarball = packTarball(distRegistryDir);
    cliTarball = packTarball(distCliDir);

    execFileSync("npm", ["install", "--no-package-lock", tslibPath, registryTarball, cliTarball], {
      cwd: installRoot,
      env: smokeEnv,
      stdio: "inherit",
    });

    const binPath = path.join(installRoot, "node_modules", ".bin", "tailng");
    if (!fs.existsSync(binPath)) {
      throw new Error("cli-smoke-test: local tailng binary was not installed");
    }

    const listOutput = runTailng(binPath, ["list"], installRoot);
    if (!listOutput.includes("button") || !listOutput.includes("switch")) {
      throw new Error("cli-smoke-test: `tailng list` output is missing expected registry items");
    }

    const targetRoot = path.join(installRoot, "generated");
    fs.mkdirSync(targetRoot, { recursive: true });
    runTailng(binPath, ["add", "button", "--cwd", targetRoot], installRoot);

    const buttonPath = path.join(targetRoot, "src/app/tailng-ui/button/tng-button.ts");
    const primitivePath = path.join(targetRoot, "src/app/tailng-ui/button/tng-press-primitive.ts");
    const indexPath = path.join(targetRoot, "src/app/tailng-ui/button/index.ts");

    for (const filePath of [buttonPath, primitivePath, indexPath]) {
      if (!fs.existsSync(filePath)) {
        throw new Error(`cli-smoke-test: expected generated file missing: ${filePath}`);
      }
    }

    const indexContent = fs.readFileSync(indexPath, "utf8");
    if (!indexContent.includes("export * from './tng-button';")) {
      throw new Error("cli-smoke-test: generated button index.ts is missing wrapper export");
    }

    console.log("cli-smoke-test: packed CLI install succeeded");
  } finally {
    for (const tarball of [cliTarball, registryTarball]) {
      if (tarball && fs.existsSync(tarball)) {
        fs.rmSync(tarball, { force: true });
      }
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

main();
