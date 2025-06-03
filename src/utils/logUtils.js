const winston = require('winston');
const colors = require('ansi-colors');

const logFilePath = process.env.LOG_FILE_PATH || 'transpile.log';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level.toUpperCase()}] ${message}`)
  ),
  transports: [new winston.transports.File({
      filename: logFilePath,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true,
      zippedArchive: true,
      handleExceptions: true })]
});

const levelColors = {
  error: colors.red,
  warn: colors.yellow,
  info: colors.green,
  debug: colors.blue
};

const logMessage = (level, message, isSilent) => {
  logger.log({ level, message });
  if (!isSilent) {
    const colorize = levelColors[level] || colors.white;
    console.log(colorize(`[${level.toUpperCase()}]`), message);
  }
};

module.exports = { logMessage };
