const { logMessage } = require('../utils/logUtils');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Transpile files based on provided patterns and options.
 * @param {string[]} patterns - Glob patterns for source files.
 * @param {Object} options - CLI options (`--output`, `--silent`, etc.).
 */
function transpileCommand(patterns, options) {
  const outputDir = options.output || 'dist';
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  logMessage('info', `Saving transpiled files to: ${outputDir}`, options.silent);
  
  const finalPatterns = patterns.length > 0 ? patterns : ['**/*.js'];
  const files = glob.sync(finalPatterns.join('|'), { ignore: options.exclude || [], nodir: true });

  if (files.length === 0) {
    logMessage('warn', 'No files matched for transpilation.', options.silent);
    return;
  }

  files.forEach(file => {
    const destinationFile = path.join(outputDir, path.basename(file));
    fs.copyFileSync(file, destinationFile);
    logMessage('info', `Transpiled: ${file} -> ${destinationFile}`, options.silent);
  });

  logMessage('info', 'Transpilation completed!', options.silent);
}

module.exports = { transpileCommand };