import { REST, Routes } from 'discord.js';
import { configModule } from './modules/config.js';
import { loadCommandsCollection } from './handlers/command.js';
import { logger } from './utils/logger';


const deployApplicationCommands = async (): Promise<void> => {
    try {
        const commandsCollection = await loadCommandsCollection();
        const commandsPayloadList = commandsCollection.map((commandModule) =>
            commandModule.data.toJSON()
        );

        const restClient = new REST({
            version: '10'
        }).setToken(configModule.discordToken);

        if (configModule.guildIdentifiers.length > 0) {
            await Promise.all(
                configModule.guildIdentifiers.map((guildIdentifier) =>
                    restClient.put(
                        Routes.applicationGuildCommands(configModule.clientIdentifier, guildIdentifier),
                        { body: commandsPayloadList }
                    )
                )
            );
            logger.info(`Successfully deployed commands to ${configModule.guildIdentifiers.length} guild(s).`);
        } else {
            await restClient.put(
                Routes.applicationCommands(configModule.clientIdentifier),
                { body: commandsPayloadList }
            );
            logger.info('Successfully deployed commands globally.');
        }
    } catch (executionError) {
        logger.error('Failed to deploy application commands', executionError);
    }
};

void deployApplicationCommands();