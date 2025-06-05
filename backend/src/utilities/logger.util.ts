import env from '../env';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import morgan_ from 'morgan';
import { createLogger, format, transports } from 'winston';

class LoggerUtil {
    morgan() {
        let dev_format = '[:date[web] :remote-addr :remote-user ] :method :url HTTP/:http-version | :status :response-time ms'
        let prod_format = '[:date[web] :remote-addr :remote-user ] :method :url HTTP/:http-version :referrer - :user-agent | :status :response-time ms'
        let morgan_format = env.NODE_ENV === 'prod' ? prod_format : dev_format;
        let request_log_stream = createWriteStream(resolve(__dirname, `../../logs/request.log`), { flags: 'a' });
        return morgan_(morgan_format, { stream: request_log_stream });
    }
    winston() {
        let { colorize, combine, printf, timestamp } = format
        let log_transports = {
            console: new transports.Console({ level: 'warn' }),
            combined_log: new transports.File({ level: 'info', filename: `logs/combined.log` }),
            error_log: new transports.File({ level: 'error', filename: `logs/error.log` }),
            exception_log: new transports.File({ filename: 'logs/exception.log' }),
        };
        let log_format = printf(({ level, message, timestamp }) => `[${timestamp} : ${level}] - ${message}`);
        let logger = createLogger({
            transports: [
                log_transports.console,
                log_transports.combined_log,
                log_transports.error_log,
            ],
            exceptionHandlers: [
                log_transports.exception_log,
            ],
            exitOnError: false,
            format: combine(
                colorize(),
                timestamp(),
                log_format
            )
        });
        return logger;
    }
}


const loggerUtil = new LoggerUtil()
const morgan = loggerUtil.morgan()
const winston = loggerUtil.winston()

export {
    morgan,
    winston
}