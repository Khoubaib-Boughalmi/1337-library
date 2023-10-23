const winston = require('winston');
require('dotenv').config();

const SysLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, message }) => {
            return `${timestamp} ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({
            filename: process.env.SYSLOG_FILE || '../../syslog-bookingbooks.log',
            level: 'info'
        })
    ]
});

module.exports = SysLogger;
