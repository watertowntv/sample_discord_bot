import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Collection } from 'discord.js';
import { CommandInterface } from '../interfaces/command.js';


const commandsDirectoryPath = join(process.cwd(), 'src', 'commands');

export const loadCommandsCollection = async (): Promise<Collection<string, CommandInterface>> => {
    const commandsCollection = new Collection<string, CommandInterface>();
    const commandFiles = readdirSync(commandsDirectoryPath).filter((fileName) =>
        (fileName.endsWith('.ts') || fileName.endsWith('.js')) && !fileName.endsWith('.d.ts')
    );

    for (const fileName of commandFiles) {
        const filePath = join(commandsDirectoryPath, fileName);
        const importedModule = await import(`file://${filePath}`);
        const commandObject: CommandInterface = importedModule.default || Object.values(importedModule)[0];

        if (commandObject && 'data' in commandObject && 'execute' in commandObject) {
            commandsCollection.set(commandObject.data.name, commandObject);
        }
    }

    return commandsCollection;
};