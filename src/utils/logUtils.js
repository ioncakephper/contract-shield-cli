const winston = require("winston");
const colors = require("ansi-colors");

const logFilePath = process.env.LOG_FILE_PATH || "transpile.log";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] [${level.toUpperCase()}] ${message}`
    )
  ),
  transports: [
    new winston.transports.File({
      filename: logFilePath,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true,
      zippedArchive: true,
      handleExceptions: true,
    }),
  ],
});


const levelColors = {
  error: colors.red,
  warn: colors.yellow,
  info: colors.green,
  debug: colors.blue,
};

const validLogLevels = ["error", "warn", "info", "debug"];

/**
 * Logs a message to the console with a specified log level.
 *
 * @param {string} level - The log level (e.g., 'info', 'error') to display.
 * @param {string} message - The message to be logged.
 */
const writeToConsole = (level, message) => {
  console.log(colors.green(`[${level.toUpperCase()}]`), message);
};

/**
 * Logs a message at a specified log level and optionally writes it to the console.
 *
 * @param {string} level - The log level for the message. Must be one of: "error", "warn", "info", "debug".
 * @param {string} message - The message to be logged.
 * @param {boolean} isSilent - If true, the message will not be written to the console.
 * @throws {Error} Throws an error if the log level is invalid.
 */
const logMessage = (level, message, isSilent) => {
  if (!validLogLevels.includes(level)) {
    throw new Error(
      `Invalid log level: ${level}. Must be one of: ${validLogLevels.join(
        ", "
      )}`
    );
  }
  logger.log({ level, message });
  if (!isSilent) {
    writeToConsole(level, message);
  }
};

module.exports = { logMessage };
