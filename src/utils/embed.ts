// noinspection JSUnusedGlobalSymbols

import { EmbedBuilder } from 'discord.js';


const DEFAULT_EMBED_COLOR = 0x57f287;
const ERROR_EMBED_COLOR = 0xed4245;

export const createBaseEmbed = (title?: string, description?: string): EmbedBuilder => {
    const embedBuilderInstance = new EmbedBuilder().setColor(DEFAULT_EMBED_COLOR);

    if (title) {
        embedBuilderInstance.setTitle(title);
    }
    if (description) {
        embedBuilderInstance.setDescription(description);
    }

    return embedBuilderInstance;
};

export const createErrorEmbed = (errorMessage: string): EmbedBuilder => {
    return new EmbedBuilder()
        .setColor(ERROR_EMBED_COLOR)
        .setTitle('Error')
        .setDescription(errorMessage);
};
