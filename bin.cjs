#!/usr/bin/env node

const { spawnSync } = require('node:child_process')

const path = require('path')

// run in tsx
spawnSync(
  'npx',
  ['-y', 'tsx', path.join(__dirname, 'nodePlatey.ts'), process.argv[2]],
  {
    stdio: 'inherit'
  }
)
