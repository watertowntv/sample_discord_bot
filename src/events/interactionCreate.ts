import { Interaction, Collection } from 'discord.js';
import { EventInterface } from '../interfaces/event.js';
import { CommandInterface } from '../interfaces/command.js';
import { logger } from '../utils/logger.js';


export const interactionEvent: EventInterface<'interactionCreate'> = {
    name: 'interactionCreate',
    async execute(incomingInteraction: Interaction): Promise<void> {
        if (!incomingInteraction.isChatInputCommand()) return;

        const clientWithCommands = incomingInteraction.client as typeof incomingInteraction.client & {
            commands?: Collection<string, CommandInterface>;
        };

        const targetCommand = clientWithCommands.commands?.get(incomingInteraction.commandName);
        if (!targetCommand) return;

        try {
            await targetCommand.execute(incomingInteraction);
        } catch (executionError) {
            logger.error(`Command execution failed (${incomingInteraction.commandName})`, executionError);

            const errorMessagePayload = {
                content: 'An error occurred while executing this command.',
                ephemeral: true,
            };

            if (incomingInteraction.replied || incomingInteraction.deferred) {
                await incomingInteraction.followUp(errorMessagePayload);
            } else {
                await incomingInteraction.reply(errorMessagePayload);
            }
        }
    },
};