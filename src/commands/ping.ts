// noinspection JSUnusedGlobalSymbols

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CommandInterface } from '../internal/interfaces/command.js';


export const command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns ping in ms'),
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
