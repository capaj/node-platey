#!/usr/bin/env node

const { spawnSync } = require('node:child_process')

const path = require('path')

spawnSync(
  'ts-node-esm',
  [
    '--experimental-specifier-resolution=node',
    path.join(__dirname, 'nodePlatey.ts'),
    process.argv[2]
  ],
  {
    stdio: 'inherit'
  }
)
