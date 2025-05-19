import { Client, Collection, ChatInputCommandInteraction } from 'discord.js';

export interface Command {
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    // Add other properties as needed
}

export class CustomClient extends Client {
    public commands: Collection<string, Command> = new Collection();
}
