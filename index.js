#!/usr/bin/env node
const detective = require('detective')
const parseArgs = require('minimist')
const fs = require('fs')
const path = require('path')
const m = require('module')
const { spawnSync } = require('child_process')

const args = parseArgs(process.argv)
const filename = args._[args._.length - 1]
const registry = args.r
const tool = args.t || 'npm'

const { resolve } = m.createRequire(path.resolve(filename))

if (!filename) {
  console.error('Usage: npm-auto <filename> ...args')
  process.exit(1)
}

const deps = detective(fs.readFileSync(filename))
  .filter(d => m.builtinModules.indexOf(d) === -1)
  .filter(unresolved)

  if (deps.length) {
    fs.mkdirSync('node_modules', { recursive: true })

    let args = []
    if (tool === 'yarn') {
        args = ['add'].concat(deps)
    } else {
        args = ['install'].concat(deps)
    }
    registry && args.push('--registry', registry)

    spawnSync(tool, args, { stdio: 'inherit' })
}

spawnSync(process.execPath, args._.slice(2), { stdio: 'inherit' })

function unresolved (d) {
  try {
    resolve(d)
    return false
  } catch (_) {
    return true
  }
}
