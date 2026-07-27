import { Client } from 'discord.js';
import { EventInterface } from '../interfaces/event.js';
import { logger } from '../utils/logger.js';


export const readyEvent: EventInterface<'ready'> = {
    name: 'ready',
    once: true,
    async execute(authenticatedClient: Client<true>): Promise<void> {
        logger.info(`Authenticated as ${authenticatedClient.user.tag}`);
    },
};