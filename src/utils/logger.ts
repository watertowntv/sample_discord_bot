// noinspection JSUnusedGlobalSymbols

import { appendFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';


type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

const logsDirectoryPath = join(process.cwd(), 'logs');
const logFilePath = join(logsDirectoryPath, 'bot.log');

const formatTimestamp = (): string => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
};

const ensureLogsDirectory = async (): Promise<void> => {
    if (!existsSync(logsDirectoryPath)) {
        await mkdir(logsDirectoryPath, { recursive: true });
    }
};

const writeLogToFile = async (formattedMessage: string): Promise<void> => {
    try {
        await ensureLogsDirectory();
        await appendFile(logFilePath, `${formattedMessage}\n`, 'utf-8');
    } catch (writeError) {
        console.error('Failed to write log to file:', writeError);
    }
};

const createLogMessage = (level: LogLevel, message: string): string => {
    const timestamp = formatTimestamp();
    return `[${timestamp}] [${level}] ${message}`;
};

export const logger = {
    info(message: string): void {
        const formattedMessage = createLogMessage('INFO', message);
        console.log(`\x1b[32m${formattedMessage}\x1b[0m`);
        void writeLogToFile(formattedMessage);
    },

    warn(message: string): void {
        const formattedMessage = createLogMessage('WARN', message);
        console.warn(`\x1b[33m${formattedMessage}\x1b[0m`);
        void writeLogToFile(formattedMessage);
    },

    error(message: string, errorInstance?: unknown): void {
        const detailMessage = errorInstance instanceof Error ? `${message}: ${errorInstance.stack || errorInstance.message}` : message;
        const formattedMessage = createLogMessage('ERROR', detailMessage);
        console.error(`\x1b[31m${formattedMessage}\x1b[0m`);
        void writeLogToFile(formattedMessage);
    },

    debug(message: string): void {
        const formattedMessage = createLogMessage('DEBUG', message);
        console.debug(`\x1b[34m${formattedMessage}\x1b[0m`);
        void writeLogToFile(formattedMessage);
    },
};
