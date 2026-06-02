import { trace } from "@opentelemetry/api";
import { Logger } from "tslog";

export const mainLogger = new Logger({ name: 'fantasyLogs' });

mainLogger.attachTransport((logObj) => {
    const activeSpan = trace.getActiveSpan();
    if (!activeSpan) return;

    const message = logObj._meta.name
        ? `${logObj._meta.name} - ${logObj._meta.logLevelName}: ${logObj._meta.date}`
        : `${logObj._meta.logLevelName}: ${logObj._meta.date}`;

    activeSpan.setAttribute("log_message", message);
    activeSpan.setAttribute("log_name", logObj._meta.name || "");

    if (logObj._meta.path) {
        activeSpan.setAttribute("log_filename", logObj._meta.path.fileName || "");
        activeSpan.setAttribute("log_fileline", logObj._meta.path.fileLine || "");
    }

})