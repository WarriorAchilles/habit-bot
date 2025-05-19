import { Events, Client } from 'discord.js';
import { db } from '../utils/database.ts';

export const name = Events.ClientReady;
export const once = true;
export const execute = (client: Client) => {
    console.log('syncing database...');
    db.sync();
    console.log(`Ready! Logged in as ${client.user?.tag}`);
};
