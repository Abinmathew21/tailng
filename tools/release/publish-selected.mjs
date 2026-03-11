import { execSync } from "node:child_process";
import fs from "node:fs";

const targets =
  process.env.TARGETS?.replace(/^,|,$/g, "") ??
  process.argv[2] ??
  "";
const npmTag = process.argv[3] ?? "latest";

const has = (t) => ("," + targets + ",").includes("," + t + ",");
const run = (cmd, cwd) =>
  execSync(cmd, { stdio: "inherit", cwd, env: { ...process.env } });

const publish = (dir) => {
  if (!fs.existsSync(dir)) {
    throw new Error(`Publish directory not found: ${dir}`);
  }

  const pkg = JSON.parse(fs.readFileSync(`${dir}/package.json`, "utf8"));
  const name = pkg.name ?? dir;
  const version = pkg.version ?? "";

  console.log(`Publishing ${name}@${version} with tag ${npmTag}`);

  const cmdParts = [
    "npm publish",
    "--access public",
    `--tag ${npmTag.trim()}`,
  ];
  
  if (process.env.CI === "true") {
    cmdParts.push("--provenance");
  }
  
  const cmd = cmdParts.join(" ");

  if (process.env.DRY_RUN === "true") {
    console.log(`DRY_RUN=true, skipping: ${cmd}`);
    return;
  }

  run(cmd, dir);
};

// Publish in dependency order
if (has("cdk")) publish("dist/libs/tailng-ui/cdk");
if (has("theme")) publish("dist/libs/tailng-ui/theme");
if (has("icons")) publish("dist/libs/tailng-ui/icons");
if (has("primitives")) publish("dist/libs/tailng-ui/primitives");
if (has("components")) publish("dist/libs/tailng-ui/components");
if (has("registry")) publish("dist/libs/tailng-ui/registry");
if (has("charts")) publish("dist/libs/tailng-ui/charts");