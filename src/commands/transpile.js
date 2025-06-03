const { logMessage } = require("../utils/logUtils");
const { loadConfig } = require("../utils/configUtils");
const colors = require("ansi-colors");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const { log } = require("console");


/**
 * Transpiles files based on specified patterns and options.
 *
 * @param {string[]} patterns - Array of glob patterns to match files for transpilation.
 * @param {Object} options - Options for the transpilation process.
 * @param {string} [options.config] - Path to the configuration file.
 * @param {string|string[]} [options.exclude] - Patterns to exclude from transpilation.
 * @param {string} [options.output] - Directory to output transpiled files.
 * @param {boolean} [options.silent] - If true, suppresses log output.
 * @param {boolean} [options.verbose] - If true, enables verbose logging.
 *
 * @throws Will throw an error if an invalid log level is provided.
 * @throws Will exit the process if an error occurs during file matching.
 */
function transpileCommand(patterns, options) {
  if (!Array.isArray(patterns) || typeof options !== 'object') {
    throw new Error("Invalid input: `patterns` should be an array and `options` should be an object.");
  }

  const config = loadConfig(options.config);
  const finalPatterns = patterns.length ? patterns : config.patterns || ["**/*.js"];
  let excludePatterns = Array.isArray(options.exclude) ? options.exclude : [options.exclude || config.exclude || []].flat();
  
  if (excludePatterns.length) {
    logMessage("info", `Excluding patterns: ${excludePatterns.join(", ")}`, options.silent);
  }

  const outputDir = options.output || config.output || "dist";
  const isSilent = options.silent ?? config.silent;
  const isVerbose = options.verbose ?? config.verbose;

  if (isSilent && isVerbose) {
    console.log(colors.gray(`Verbose logs will be saved to ${logFilePath}`));
  }

  logMessage("info", "Starting transpilation process...", isSilent);

  try {
    const files = glob.sync(finalPatterns.join("|"), { ignore: excludePatterns, nodir: true });

    if (!files.length) {
      logMessage("warn", "No files matched for transpilation.", isSilent);
      return;
    }

    logMessage("info", `Processing ${files.length} files...`, isSilent);

    files.forEach(file => {
      logMessage("info", `Transpiling: ${file}`, isSilent);

      try {
        const destinationFile = path.join(outputDir, path.dirname(file), path.basename(file));
        if (!fs.existsSync(path.dirname(destinationFile))) {
          fs.mkdirSync(path.dirname(destinationFile), { recursive: true });
        }
        fs.copyFileSync(file, destinationFile);
        logMessage("info", `Successfully transpiled: ${file} -> ${destinationFile}`, isSilent);
      } catch (error) {
        logMessage("error", `Failed to transpile ${file}: ${error.message}`, isSilent);
      }
    });

    logMessage("info", "Transpilation process completed!", isSilent);
  } catch (error) {
    logMessage("error", `Error matching files: ${error.message}`, isSilent);
    process.exit(1);
  }
}

module.exports = { transpileCommand };
