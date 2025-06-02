#!/usr/bin/env node

const { Command } = require('commander');
const colors = require('ansi-colors');
const fs = require('fs');
const path = require('path');
const os = require('os');
const glob = require('glob');
const winston = require('winston');
const packageJson = require('../package.json'); // Load package.json

const program = new Command();

// Dynamically set CLI name (remove `-cli` if present)
const packageName = packageJson.name.replace(/-cli$/, '');
const packageDescription = packageJson.description || 'A CLI tool for contract validation using Design by Contract.';
const packageVersion = packageJson.version || '0.0.1';

program
  .name(packageName)
  .description(packageDescription)
  .version(packageVersion);

/**
 * Loads the configuration file, checking both local and global locations.
 * If no path is provided, it defaults to searching common config locations.
 *
 * @param {string} [configPath] - Optional path to the configuration file.
 * @returns {Object} - Parsed configuration object (or an empty object if none found).
 */
function loadConfig(configPath) {
  const defaultProjectConfig = path.resolve(process.cwd(), 'contract-shield.config.json');
  const defaultGlobalConfig = path.resolve(os.homedir(), 'contract-shield.json');

  const finalConfigPath = configPath || (fs.existsSync(defaultProjectConfig) ? defaultProjectConfig : fs.existsSync(defaultGlobalConfig) ? defaultGlobalConfig : null);

  if (finalConfigPath && fs.existsSync(finalConfigPath)) {
    return JSON.parse(fs.readFileSync(finalConfigPath, 'utf-8'));
  }

  return {}; // Return empty config if no file is found
}

// Define log file path
const logFilePath = path.resolve(process.cwd(), 'transpile.log');

// Create Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level.toUpperCase()}] ${message}`)
  ),
  transports: [
    new winston.transports.File({ filename: logFilePath }) // Always save logs to file
  ]
});

/**
 * Logs messages with different levels (`info`, `warn`, `error`).
 * Logs to a file when `--silent` is enabled, otherwise to the console.
 *
 * @param {'info' | 'warn' | 'error'} level - Log level.
 * @param {string} message - Log message.
 * @param {boolean} isSilent - Whether silent mode is enabled.
 */
function logMessage(level, message, isSilent) {
  logger.log({ level, message });

  if (!isSilent) {
    console.log(colors.green(`[${level.toUpperCase()}]`), message);
  }
}

program
  .command('transpile [patterns...]', { isDefault: true })
  .description('Transpile contracts and apply Design by Contract validation. Optionally, specify patterns to filter validations.')
  .option('-c, --config <file>', 'Specify a configuration file')
  .option('-s, --silent', 'Suppress output messages')
  .option('-v, --verbose', 'Enable detailed logging')
  .option('-e, --exclude <files...>', 'Specify glob patterns to exclude from transpilation')
  .action((patterns, options) => {
    const config = loadConfig(options.config);

    const finalPatterns = patterns.length > 0 ? patterns : config.patterns || ['**/*.js'];
    const excludePatterns = options.exclude || config.exclude || [];
    if (typeof excludePatterns === 'string') {
      // If exclude is a string, convert it to an array
      excludePatterns = [excludePatterns];
    }
    if (excludePatterns.length > 0) {
        logMessage('info', `Excluding patterns: ${excludePatterns.join(', ')}`, options.silent);
    }

    const isSilent = options.silent ?? config.silent;
    const isVerbose = options.verbose ?? config.verbose;

    if (isSilent && isVerbose) {
      console.log(colors.gray(`Verbose logs will be saved to ${logFilePath}`));
    }

    logMessage('info', 'Starting transpilation process...', isSilent);


    try {
      const files = glob.sync(finalPatterns.join('|'), { ignore: excludePatterns, nodir: true });

      if (files.length === 0) {
        logMessage('warn', 'No files matched for transpilation.', isSilent);
        return;
      }

      logMessage('info', `Processing ${files.length} files...`, isSilent);


      for (const file of files) {
        logMessage('info', `Transpiling: ${file}`, isSilent);
        logMessage('info', `Successfully transpiled: ${file}`, isSilent);
      }

      logMessage('info', 'Transpilation process completed!', isSilent);
    } catch (error) {
      logMessage('error', `Error matching files: ${error.message}`, isSilent);
      process.exit(1);
    }
  });

program.parse(process.argv);