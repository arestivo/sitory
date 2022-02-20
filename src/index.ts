#!/usr/bin/env node

import yargs, { string } from 'yargs'
import { build } from './commands/build'
import { init } from './commands/init'
import { serve } from './commands/serve'

import * as fs from 'fs-extra'

const argv = yargs
  .scriptName('sitory')
  .strict()
  .demandCommand(1)
  .command('init [path]', 'initialize a sitory site in the current directory', (yargs) => {
    yargs.positional('path', {
      description: 'the folder to initialize',
      type: 'string',
      default: '.'
    })
  })
  .command('build', 'build the site', {
    config: {
      alias: 'c',
      description: 'config file to use',
      type: 'string',
      default: 'config.xml'
    }
  })
  .command('serve', 'start a webserver serving the site', {
    port: {
      alias: 'p',
      description: 'the port to use',
      type: 'number',
      default: 3000
    },
  })
  .example([
    ['sitory init', 'Initialize a sitori website at the current directory'],
    ['sitory build', 'Build the sitori website at the current directory'],
    ['sitory serve', 'Serve the website at http://localhost:3000'],
    ['sitory serve -p 5000', 'Serve the website at http://localhost:5000'],
  ])
  .help()
  .parseSync()

if (argv._[0] === 'serve') serve(parseInt(argv['port'] as string, 10))
if (argv._[0] === 'build') build(argv['config'] as string)
if (argv._[0] === 'init') init(argv['path'] as string)