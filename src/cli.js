#!/usr/bin/env node

const { Command } = require('commander');
const { logMessage } = require('../src/utils/logUtils');
const { loadConfig } = require('../src/utils/configUtils');
const { transpileCommand } = require('./commands/transpile');
const packageJson = require('../package.json');

const program = new Command();
program.name(packageJson.name.replace(/-cli$/, ''))
  .description(packageJson.description || 'A CLI tool for contract validation using Design by Contract.')
  .version(packageJson.version);

program
  .command('transpile [patterns...]', {isDefault: true})
  .alias('t')
  .description('Transpile contracts and apply validation rules.')
  .option('-c, --config <file>', 'Specify a configuration file')
  .option('-s, --silent', 'Suppress output messages')
  .option('-v, --verbose', 'Enable detailed logging')
  .option('-e, --exclude <files...>', 'Specify glob patterns to exclude from transpilation')
  .option('-o, --output <folder>', 'Specify destination folder for transpiled files')
  .action((patterns, options) => transpileCommand(patterns, options));

program.parse(process.argv);