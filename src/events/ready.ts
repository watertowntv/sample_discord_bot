// noinspection JSUnusedGlobalSymbols

import { Client } from 'discord.js';
import { EventInterface } from '../internal/interfaces/event.js';
import { logger } from '../internal/utils/logger';


export const readyEvent: EventInterface<'ready'> = {
    name: 'ready',
    once: true,
    async execute(authenticatedClient: Client<true>): Promise<void> {
        logger.info(`Authenticated: ${authenticatedClient.user.tag}`);
    },
};