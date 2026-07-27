// noinspection JSUnusedGlobalSymbols

import { Client, Collection } from 'discord.js';
import { EventInterface } from '../interfaces/event.js';
import { CommandInterface } from '../interfaces/command.js';
import { logger } from '../utils/logger.js';


export const readyEvent: EventInterface<'clientReady'> = {
    name: 'clientReady',
    once: true,
    async execute(authenticatedClient: Client<true>): Promise<void> {
        logger.info(`Authenticated: ${authenticatedClient.user.tag}`);

        const guildNames = authenticatedClient.guilds.cache
            .map((guild) => guild.name)
            .join(', ');
        logger.info(`Guilds: ${guildNames}`);

        const clientWithCommands = authenticatedClient as typeof authenticatedClient & {
            commands?: Collection<string, CommandInterface>;
        };
        const commandNames = clientWithCommands.commands
            ? Array.from(clientWithCommands.commands.keys())
                .map((commandName) => `/${commandName}`)
                .join(', ')
            : '';
        logger.info(`Commands: ${commandNames}`);
    },
};