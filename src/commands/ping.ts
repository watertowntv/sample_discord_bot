import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CommandInterface } from '../interfaces/command.js';


const PING_COMMAND_CONSTANTS = {
    NAME: 'ping',
    DESCRIPTION: 'Returns ping in ms'
} as const;

// noinspection JSUnusedGlobalSymbols
export const command = {
    data: new SlashCommandBuilder()
        .setName(PING_COMMAND_CONSTANTS.NAME)
        .setDescription(PING_COMMAND_CONSTANTS.DESCRIPTION),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const initialResponseMessage = await interaction.reply({
            content: "Pong",
            fetchReply: true,
        });

        const roundTripLatencyInMilliseconds = initialResponseMessage.createdTimestamp - interaction.createdTimestamp;
        const webSocketPingInMilliseconds = interaction.client.ws.ping;

        await interaction.editReply(
            `Round-trip latency: ${roundTripLatencyInMilliseconds}ms | WebSocket ping: ${webSocketPingInMilliseconds}ms`
        );
    },
} satisfies CommandInterface;
