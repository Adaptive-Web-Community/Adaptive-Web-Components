import { IMeta, Logger } from "tslog";

let loggerInstance: Logger<unknown> | null = null;

export const getLogger = (): Logger<unknown> => {
    if (!loggerInstance) {
        loggerInstance = new Logger({
            name: "Adaptive UI Designer",
            stylePrettyLogs: false,
            prettyLogTemplate: "{{dateIsoStr}}\t{{name}}\t",
            prettyErrorTemplate: "{{errorName}}: {{errorMessage}}",
            minLevel: 3,  // 0: silly, 1: trace, 2: debug, 3: info, 4: warn, 5: error, 6: fatal
            overwrite: {
                addPlaceholders: (logObjMeta: IMeta, placeholderValues: Record<string, string | number>) => {
                    if (logObjMeta.name) {
                        placeholderValues["name"] = logObjMeta.name.substring(0, 20).padEnd(20);
                    }
                },
                transportFormatted: (logMetaMarkup, logArgs, logErrors, logMeta) => {
                    // Send different log levels to appropriate console methods
                    const logLevel = logMeta?.logLevelName ?? logMetaMarkup.trim().split("\t")[1];
                    switch (logLevel) {
                        case "WARN":
                            console.warn(logMetaMarkup, ...logArgs, ...logErrors);
                            break;
                        case "ERROR":
                        case "FATAL":
                            console.error(logMetaMarkup, ...logArgs, ...logErrors);
                            break;
                        case "INFO":
                            // In the console log, errors and warnings show a stack trace behind an arrow, so indent to align with that.
                            console.info("  " + logMetaMarkup, ...logArgs, ...logErrors);
                            break;
                        case "DEBUG":
                        case "TRACE":
                        case "SILLY":
                        default:
                            console.log("  " + logMetaMarkup, ...logArgs, ...logErrors);
                            break;
                    }
                }
            }
        });
    }
    return loggerInstance;
};

export const indent = (level: number) => "  ".repeat(level);
