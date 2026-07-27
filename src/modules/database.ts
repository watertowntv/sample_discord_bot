// noinspection JSUnusedGlobalSymbols

import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { logger } from '../internal/utils/logger.js';


export interface UserDataInterface {
    [key: string]: unknown;
}

export interface GuildDataInterface {
    [key: string]: unknown;
}

export interface GlobalDataInterface {
    [key: string]: unknown;
}


const DEFAULT_USER_DATA: UserDataInterface = {

};

const DEFAULT_GUILD_DATA: GuildDataInterface = {

};

const DEFAULT_GLOBAL_DATA: GlobalDataInterface = {

};


export interface DatabaseSchemaInterface {
    users: Record<string, UserDataInterface>;
    guilds: Record<string, GuildDataInterface>;
    global: GlobalDataInterface;
}
const DEFAULT_DATABASE_STATE: DatabaseSchemaInterface = {
    users: {},
    guilds: {},
    global: DEFAULT_GLOBAL_DATA,
};

class DatabaseManager {
    private databaseFilePath: string = join(process.cwd(), 'data', 'data.json');
    private temporaryFilePath: string = join(process.cwd(), 'data', 'data.json.tmp');
    private databaseCache: DatabaseSchemaInterface = structuredClone(DEFAULT_DATABASE_STATE);

    private async ensureDataDirectoryExists(): Promise<void> {
        const dataDirectoryPath = join(process.cwd(), 'data');
        if (!existsSync(dataDirectoryPath)) {
            await mkdir(dataDirectoryPath, { recursive: true });
        }
    }

    public async loadData(): Promise<void> {
        await this.ensureDataDirectoryExists();

        if (!existsSync(this.databaseFilePath)) {
            this.databaseCache = structuredClone(DEFAULT_DATABASE_STATE);
            await this.saveData();
            logger.info('Initialized new database file');
            return;
        }

        try {
            const rawFileContent = await readFile(this.databaseFilePath, 'utf-8');
            const parsedData = JSON.parse(rawFileContent) as Partial<DatabaseSchemaInterface>;

            this.databaseCache = {
                users: parsedData.users ?? {},
                guilds: parsedData.guilds ?? {},
                global: parsedData.global ?? structuredClone(DEFAULT_GLOBAL_DATA),
            };
            logger.info('Database successfully loaded');
        } catch (loadError) {
            logger.error('Failed to load database file', loadError);
            this.databaseCache = structuredClone(DEFAULT_DATABASE_STATE);
        }
    }

    public async saveData(): Promise<void> {
        await this.ensureDataDirectoryExists();

        try {
            const serializedData = JSON.stringify(this.databaseCache, null, 4);
            await writeFile(this.temporaryFilePath, serializedData, 'utf-8');
            await rename(this.temporaryFilePath, this.databaseFilePath);
            logger.debug('Database atomically saved');
        } catch (saveError) {
            logger.error('Failed to save database file', saveError);
        }
    }

    public getUser(userId: string): UserDataInterface {
        if (!this.databaseCache.users[userId]) {
            this.databaseCache.users[userId] = structuredClone(DEFAULT_USER_DATA);
        }
        return this.databaseCache.users[userId];
    }

    public updateUser(userId: string, updateFunction: (userData: UserDataInterface) => void): UserDataInterface {
        const userData = this.getUser(userId);
        updateFunction(userData);
        void this.saveData();
        return userData;
    }

    public getGuild(guildId: string): GuildDataInterface {
        if (!this.databaseCache.guilds[guildId]) {
            this.databaseCache.guilds[guildId] = structuredClone(DEFAULT_GUILD_DATA);
        }
        return this.databaseCache.guilds[guildId];
    }

    public updateGuild(guildId: string, updateFunction: (guildData: GuildDataInterface) => void): GuildDataInterface {
        const guildData = this.getGuild(guildId);
        updateFunction(guildData);
        void this.saveData();
        return guildData;
    }

    public getGlobal(): GlobalDataInterface {
        return this.databaseCache.global;
    }

    public updateGlobal(updateFunction: (globalData: GlobalDataInterface) => void): GlobalDataInterface {
        updateFunction(this.databaseCache.global);
        void this.saveData();
        return this.databaseCache.global;
    }

    public get data(): DatabaseSchemaInterface {
        return this.databaseCache;
    }
}

export const databaseManager = new DatabaseManager();
