// noinspection JSUnusedGlobalSymbols

import { Client, Guild, GuildMember } from 'discord.js';


interface GuildMembersCacheEntry {
    members: GuildMember[];
    lastFetch: number;
}

let guildMembersCache = new Map<string, GuildMembersCacheEntry>();
const LAST_FETCH_THRESHOLD = 5 * 60 * 1000;


export const getGuildMembers = async (guild: Guild): Promise<GuildMember[]> => {
    const cached = guildMembersCache.get(guild.id);

    if (!cached || Date.now() - cached.lastFetch > LAST_FETCH_THRESHOLD) {
        const members = await guild.members.fetch();
        const nonBotMembers = Array.from(members.filter(m => !m.user.bot).values());

        guildMembersCache.set(guild.id, {
            members: nonBotMembers,
            lastFetch: Date.now()
        });

        return nonBotMembers;
    }

    return cached.members;
};

export const getVoiceGuildMembers = async (
    guild: Guild,
    client: Client<true> | null = null
): Promise<GuildMember[]> => {
    const guildMembers = await getGuildMembers(guild);

    if (client) return guildMembers.map(member =>
        client.guilds.cache.find(g =>
            g.voiceStates.cache.has(member.id)
        )?.members.cache.get(member.id)
    ).filter((member): member is GuildMember =>
        member !== undefined
    );

    return guildMembers.filter(member => member.voice.channelId !== null);
};
