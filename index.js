#!/usr/bin/env node
const detective = require('detective')
const fs = require('fs')
const path = require('path')
const m = require('module')
const { spawnSync } = require('child_process')

const filename = process.argv[2]
const { resolve } = m.createRequire(path.resolve(filename))

if (!filename) {
  console.error('Usage: npm-auto <filename> ...args')
  process.exit(1)
}

const deps = detective(fs.readFileSync(filename))
  .filter(d => m.builtinModules.indexOf(d) === -1)
  .filter(unresolved)
  .map(onlyModule)
  .filter(dups)

if (deps.length) {
  fs.mkdirSync('node_modules', { recursive: true })
  spawnSync('npm', ['install', '--no-save'].concat(deps), { stdio: 'inherit' })
}
spawnSync(process.execPath, process.argv.slice(2), { stdio: 'inherit' })

function unresolved (d) {
  try {
    resolve(d)
    return false
  } catch (_) {
    return true
  }
}

function onlyModule (n) {
  if (n[0] === '@') return n.split('/').slice(0, 2).join('/')
  return n.split('/')[0]
}

function dups (n, i, all) {
  return all.indexOf(n) === i
}
