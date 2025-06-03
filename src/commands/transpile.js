const { logMessage } = require("../utils/logUtils");
const { loadConfig } = require("../utils/configUtils");
const colors = require("ansi-colors");
const fs = require("fs");
const path = require("path");
const glob = require("glob");

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
 * @throws Will exit the process if an error occurs during file matching.
 */
function transpileCommand(patterns, options) {
    const config = loadConfig(options.config);

    const finalPatterns = patterns.length > 0 ? patterns : config.patterns || ["**/*.js"];
    let excludePatterns = options.exclude || config.exclude || [];
    if (typeof excludePatterns === "string") {
        excludePatterns = [excludePatterns]; // Convert to array if needed
    }

    const outputDir = options.output || config.output || "dist";
    const isSilent = options.silent ?? config.silent;
    const isVerbose = options.verbose ?? config.verbose;

    logMessage("info", "Starting transpilation process...", isSilent);

    if (!isSilent && isVerbose) {
        logMessage("debug", `Using output directory: ${outputDir}`, false);
    }

    try {
        const files = glob.sync(finalPatterns.join("|"), { ignore: excludePatterns, nodir: true });

        if (files.length === 0) {
            logMessage("warn", "No files matched for transpilation.", isSilent);
            return;
        }

        logMessage("info", `Processing ${files.length} files...`, isSilent);

        if (!isSilent && isVerbose) {
            logMessage("debug", `Matched files: ${files.join(", ")}`, false);
        }

        const failedFiles = [];

        for (const file of files) {
            logMessage("info", `Transpiling: ${file}`, isSilent);

            if (!isSilent && isVerbose) {
                logMessage("debug", `Source directory: ${path.dirname(file)}`, false);
            }

            try {
                const destinationFile = path.join(outputDir, path.dirname(file), path.basename(file));

                if (!fs.existsSync(path.dirname(destinationFile))) {
                    fs.mkdirSync(path.dirname(destinationFile), { recursive: true });
                }

                fs.copyFileSync(file, destinationFile);
                logMessage("info", `Successfully transpiled: ${file} -> ${destinationFile}`, isSilent);
            } catch (error) {
                logMessage("error", `Failed to transpile ${file}: ${error.message}`, isSilent);
                failedFiles.push(file);
            }
        }

        logMessage("info", "Transpilation process completed!", isSilent);

        if (failedFiles.length > 0) {
            logMessage("warn", `Failed to transpile ${failedFiles.length} files: ${failedFiles.join(", ")}`, isSilent);
        }
    } catch (error) {
        logMessage("error", `Error matching files: ${error.message}`, false);
        process.exit(1);
    }
}

module.exports = { transpileCommand };