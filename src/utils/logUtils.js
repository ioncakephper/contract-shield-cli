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

const writeToConsole = (level, message) => {
  console.log(colors.green(`[${level.toUpperCase()}]`), message);
};
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
