import { ClientEvents } from 'discord.js';


export interface EventInterface<EventNameKey extends keyof ClientEvents> {
    name: EventNameKey;
    once?: boolean;
    execute(...eventArguments: ClientEvents[EventNameKey]): Promise<void>;
}
