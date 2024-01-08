#!/usr/bin/env node

const { spawnSync } = require("node:child_process");

const path = require("path");

const tsxPath = path.join(__dirname, "node_modules", "tsx");
console.log("tsxPath:", tsxPath);
// run in tsx
spawnSync(
  "node",
  ["--import", tsxPath, path.join(__dirname, "nodePlatey.ts"), process.argv[2]],
  {
    stdio: "inherit",
  },
);
