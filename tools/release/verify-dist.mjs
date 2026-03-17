import fs from "node:fs";

const targets = process.argv[2] ?? "";
const has = (t) => ("," + targets + ",").includes("," + t + ",");

const required = [
  ["cdk", "dist/libs/cdk"],
  ["primitives", "dist/libs/primitives"],
  ["components", "dist/libs/components"],
  ["theme", "dist/libs/theme"],
  ["icons", "dist/libs/icons"],
  ["registry", "dist/libs/registry"],
  ["charts", "dist/libs/charts"],
];

for (const [k, dir] of required) {
  if (!has(k)) continue;
  if (!fs.existsSync(dir)) {
    console.error(`ERROR: ${dir} does not exist`);
    process.exit(1);
  }
}
console.log("OK: dist directories exist");