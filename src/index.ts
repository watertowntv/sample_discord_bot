import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { configModule } from './internal/modules/config.js';
import { loadCommandsCollection } from './internal/handlers/command.js';
import { registerEvents } from './internal/handlers/event.js';
import { CommandInterface } from './internal/interfaces/command.js';
import { databaseManager } from './modules/database.js';


const initializeApplication = async (): Promise<void> => {
    await databaseManager.loadData();

    const discordClientInstance = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildVoiceStates
        ],
        presence: {
            status: 'online'
        }
    }) as Client & { commands?: Collection<string, CommandInterface> };

    discordClientInstance.commands = await loadCommandsCollection();
    await registerEvents(discordClientInstance);

    await discordClientInstance.login(configModule.discordToken);
};

void initializeApplication();