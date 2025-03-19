import { Events } from 'discord.js';
import { db } from '../utils/database.js';

export const name = Events.ClientReady;
export const once = true;
export const execute = (client) => {
    console.log('syncing database...');
    db.sync();
    console.log(`Ready! Logged in as ${client.user.tag}`);
};
