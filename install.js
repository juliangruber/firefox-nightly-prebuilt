#!/usr/bin/env node
'use strict'

const fs = require('fs')
const { promisify } = require('util')
const { https } = require('follow-redirects')
const pipe = require('promisepipe')
const cp = require('child_process')
const escape = require('shell-escape')
const mount = require('mount-dmg')

const get = url => new Promise(resolve => https.get(url, resolve))
const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)
const stat = promisify(fs.stat)
const exec = promisify(cp.exec)

const cacheRoot = `${process.env.HOME}/.firefox-nightly-cache`
const dmgPath = `${cacheRoot}/firefox.dmg`
const appPath = `${cacheRoot}/FirefoxNightly.app`
const executablePath = `${appPath}/Contents/MacOS/firefox-bin`

const downloadURL =
  'https://download.mozilla.org/?product=firefox-nightly-latest-ssl&os=osx&lang=en-US'

const ONEDAY = 86400000

const run = async () => {
  try {
    await mkdir(cacheRoot)
  } catch (_) {}

  try {
    const s = await stat(appPath)
    if (new Date() - s.ctime < ONEDAY) return
  } catch (_) {}

  console.error('Downloading Firefox Nightly...')
  await pipe(await get(downloadURL), fs.createWriteStream(dmgPath))

  console.error('Mounting DMG...')
  const { volumePath, unmount } = await mount(dmgPath)

  console.error('Installing app...')
  await exec(escape(['cp', '-r', `${volumePath}/FirefoxNightly.app`, appPath]))
  await writeFile(`${__dirname}/path.txt`, executablePath)

  console.error('Unmounting DMG...')
  await unmount()

  console.error('Firefox Nightly successfully installed.')
}

run().catch(err => {
  console.error(err.stack || err)
  process.exit(1)
})
