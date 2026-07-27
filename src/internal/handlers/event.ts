import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Client, ClientEvents } from 'discord.js';
import { EventInterface } from '../interfaces/event.js';


const eventDirectories = [
    join(process.cwd(), 'src', 'internal', 'events'),
    join(process.cwd(), 'src', 'events')
];

export const registerEvents = async (client: Client): Promise<void> => {
    for (const eventsDirectoryPath of eventDirectories) {
        if (!existsSync(eventsDirectoryPath)) continue;

        const eventFiles = readdirSync(eventsDirectoryPath).filter((fileName) =>
            (fileName.endsWith('.ts') || fileName.endsWith('.js')) && !fileName.endsWith('.d.ts')
        );

        for (const fileName of eventFiles) {
            const filePath = join(eventsDirectoryPath, fileName);
            const importedModule = await import(`file://${filePath}`);
            const eventObject: EventInterface<keyof ClientEvents> = importedModule.default || Object.values(importedModule)[0];

            if (eventObject && 'name' in eventObject && 'execute' in eventObject) {
                if (eventObject.once) client.once(eventObject.name, (...eventArguments: ClientEvents[keyof ClientEvents]) =>
                    eventObject.execute(...eventArguments)
                );
                else client.on(eventObject.name, (...eventArguments: ClientEvents[keyof ClientEvents]) =>
                    eventObject.execute(...eventArguments)
                );
            }
        }
    }
};
