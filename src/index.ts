import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { configModule } from './modules/config.js';
import { loadCommandsCollection } from './handlers/command.js';
import { registerEvents } from './handlers/event.js';
import { CommandInterface } from './interfaces/command.js';
import { databaseManager } from './modules/database.js';


const initializeApplication = async (): Promise<void> => {
    await databaseManager.loadData();

    const discordClientInstance = new Client({
        intents: [GatewayIntentBits.Guilds],
    }) as Client & { commands?: Collection<string, CommandInterface> };

    discordClientInstance.commands = await loadCommandsCollection();
    await registerEvents(discordClientInstance);

    await discordClientInstance.login(configModule.discordToken);
};

void initializeApplication();