const winston = require('winston');
const colors = require('ansi-colors');

const logFilePath = 'transpile.log';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level.toUpperCase()}] ${message}`)
  ),
  transports: [new winston.transports.File({ filename: logFilePath })]
});

const logMessage = (level, message, isSilent) => {
  logger.log({ level, message });
  if (!isSilent) {
    console.log(colors.green(`[${level.toUpperCase()}]`), message);
  }
};

module.exports = { logMessage };