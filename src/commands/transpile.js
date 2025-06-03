const { logMessage } = require('../utils/logUtils');
const { loadConfig } = require('../utils/configUtils');
const colors = require('ansi-colors');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { log } = require('console');

/**
 * Transpile files based on provided patterns and options.
 * @param {string[]} patterns - Glob patterns for source files.
 * @param {Object} options - CLI options (`--output`, `--silent`, etc.).
 */
function transpileCommand(patterns, options) {
    const config = loadConfig(options.config);

    const finalPatterns = patterns.length > 0 ? patterns : config.patterns || ['**/*.js'];
    let excludePatterns = options.exclude || config.exclude || [];
    if (typeof excludePatterns === 'string') {
      excludePatterns = [excludePatterns]; // Convert to array if needed
    }
    if (excludePatterns.length > 0) {
      logMessage('info', `Excluding patterns: ${excludePatterns.join(', ')}`, options.silent);
    }

    const outDir = options.output || config.output || 'dist'; // Load from config or use default


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

        try {
            logMessage('debug', `Source file dirname: ${path.dirname(file)}`, isSilent);
            const destinationFile = path.join(outputDir, path.dirname(file), path.basename(file)); 
            logMessage('debug', `Destination file: ${destinationFile}`, isSilent);
          logMessage('debug', `Destination file dirname: ${path.dirname(destinationFile)}`, isSilent);
          if (!fs.existsSync(path.dirname(destinationFile))) {
            fs.mkdirSync(path.dirname(destinationFile), { recursive: true }); // Ensure output directory exists
          }
          fs.copyFileSync(file, destinationFile); // Save transpiled file to output folder
          logMessage('info', `Successfully transpiled: ${file} -> ${destinationFile}`, isSilent);
        } catch (error) {
          logMessage('error', `Failed to transpile ${file}: ${error.message}`, isSilent);
          continue; // Skip to the next file on error
        }
      }

      logMessage('info', 'Transpilation process completed!', isSilent);
    } catch (error) {
      logMessage('error', `Error matching files: ${error.message}`, isSilent);
      process.exit(1);
    }
}

module.exports = { transpileCommand };