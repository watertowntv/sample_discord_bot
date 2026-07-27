import dotenv from 'dotenv';


dotenv.config();

interface EnvironmentConfigInterface {
    discordToken: string;
    clientIdentifier: string;
    guildIdentifiers: string[];
}

const readEnvironmentVariable = (variableKey: string, isOptional = false): string => {
    const variableValue = process.env[variableKey];
    if (!variableValue && !isOptional) {
        throw new Error(`Missing environment variable: ${variableKey}`);
    }
    return variableValue ?? '';
};

export const configModule: EnvironmentConfigInterface = {
    discordToken: readEnvironmentVariable('DISCORD_TOKEN'),
    clientIdentifier: readEnvironmentVariable('CLIENT_ID'),
    guildIdentifiers: readEnvironmentVariable('GUILD_ID', true)
        .split(',')
        .map((identifier) => identifier.trim())
        .filter((identifier) => identifier.length > 0),
};
