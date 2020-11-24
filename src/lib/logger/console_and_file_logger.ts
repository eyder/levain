import * as log from "https://deno.land/std/log/mod.ts";
import Config from "../config.ts";
import Logger from "./logger.ts";

export default class ConsoleAndFileLogger implements Logger {
    private static config: Config;

    public static async setup(): Promise<Array<string>> {
        const logFiles = [];
        
        const logFileWithTimestamp = Deno.makeTempFileSync({
            prefix: `levain-${ConsoleAndFileLogger.logTag(new Date())}-`,
            suffix: ".log",
        });
        logFiles.push(logFileWithTimestamp);

        const fixedLogFile = `levain.log`
        logFiles.push(fixedLogFile)

        await log.setup({
            handlers: {
                console: new log.handlers.ConsoleHandler("INFO", {
                    formatter: logRecord => {
                        let msg = ConsoleAndFileLogger.hidePassword(logRecord.msg);
                        return `${ConsoleAndFileLogger.logTag(logRecord.datetime)} ${logRecord.levelName} ${msg}`;
                    }
                }),

                fileWithTimestamp: new AutoFlushLogFileHandler("DEBUG", {
                    filename: logFileWithTimestamp,
                    formatter: logRecord => {
                        let msg = ConsoleAndFileLogger.hidePassword(logRecord.msg);
                        return `${ConsoleAndFileLogger.logTag(logRecord.datetime)} ${logRecord.levelName} ${msg}`;
                    }
                }),

                fixedFile: new AutoFlushLogFileHandler("DEBUG", {
                    filename: fixedLogFile,
                    formatter: logRecord => {
                        let msg = ConsoleAndFileLogger.hidePassword(logRecord.msg);
                        return `${ConsoleAndFileLogger.logTag(logRecord.datetime)} ${logRecord.levelName} ${msg}`;
                    }
                }),
            },

            loggers: {
                // configure default logger available via short-hand methods above
                default: {
                    level: "DEBUG",
                    handlers: ["console", "fixedLogFile", "fileWithTimestamp"],
                }
            },
        });

        log.info(`logFile -> ${logFiles}`);
        log.info("")

        return logFiles
    }

    public static setConfig(config: Config): void {
        ConsoleAndFileLogger.config = config;
    }

    private static logTag(dt: Date): string {
        let logTag: string = "";
        logTag += dt.getFullYear() + "";
        logTag += (dt.getMonth() < 10 ? "0" : "") + dt.getMonth();
        logTag += (dt.getDate() < 10 ? "0" : "") + dt.getDate();
        logTag += "-";
        logTag += (dt.getHours() < 10 ? "0" : "") + dt.getHours();
        logTag += (dt.getMinutes() < 10 ? "0" : "") + dt.getMinutes();
        logTag += (dt.getSeconds() < 10 ? "0" : "") + dt.getSeconds();
        return logTag;
    }

    private static hidePassword(msg: string): string {
        if (!ConsoleAndFileLogger.config?.password) {
            return msg;
        }

        return msg.replace(ConsoleAndFileLogger.config.password, "******");
    }

    info(text: string): void {
        log.info(text)
    }
}

class AutoFlushLogFileHandler extends log.handlers.FileHandler {
    log(msg: string): void {
        super.log(msg);
        super.flush();
    }
}
