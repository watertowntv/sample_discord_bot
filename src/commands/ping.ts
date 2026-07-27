import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CommandInterface } from '../interfaces/command.js';


const PROPERTY = {
    NAME: 'ping',
    DESCRIPTION: 'Returns ping in ms'
} as const;

// noinspection JSUnusedGlobalSymbols
export const command = {
    data: new SlashCommandBuilder()
        .setName(PROPERTY.NAME)
        .setDescription(PROPERTY.DESCRIPTION),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply({
            content: "Pong",
        });

        const fetch = await interaction.fetchReply();
        const ping_ms = fetch.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(
            `Pong: ${ping_ms}ms`
        );
    },
} satisfies CommandInterface;
