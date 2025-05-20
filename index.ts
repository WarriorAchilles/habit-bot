// Require all the necessary discord.js classes
import { Collection, GatewayIntentBits, TextChannel } from 'discord.js';
import configs from './config.json';
import fs from 'node:fs';
import path from 'node:path';
import { CustomClient } from './types/CustomClient.ts';

const token = configs.token;

// Create a new client instance
// "Guild" refers to a Discord server
const client = new CustomClient({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.ts'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(
                `[WARNING] The command set at ${filePath} is missing a required "data" or "execute" property`,
            );
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.ts'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Log into Discord with your client's token
client.login(token);

import cron from 'node-cron';
import { DateTime } from 'luxon'; // For time zone handling
import { Habits, Users } from './utils/database.ts';
import { Op } from 'sequelize';

// This runs every minute
cron.schedule('* * * * *', async () => {
    const nowUTC = DateTime.utc();

    const getTimeStringsToCheck = (timezone: string): string[] => {
        const base = nowUTC.setZone(timezone);
        console.log(`Checking for habits to remind at time: ${base}...`);
        const times = [
            base.minus({ minutes: 1 }),
            base,
            base.plus({ minutes: 1 }),
        ];
        return times.map((time) => time.toFormat('HH:mm'));
    };

    const stringsToCheck = getTimeStringsToCheck('America/New_York');
    console.log(`Time strings to check: ${stringsToCheck}`);

    const habitsToRemind = await Habits.findAll({
        where: {
            reminder_time: {
                [Op.in]: getTimeStringsToCheck('America/New_York'),
            },
        },
    });

    for (const habit of habitsToRemind) {
        const userTime = nowUTC.setZone('America/New_York').toFormat('HH:mm');
        if (userTime === habit.reminder_time) {
            const userFromDB = await Users.findOne({
                where: {
                    id: habit.user_id,
                },
            });
            if (!userFromDB) {
                console.error(
                    `User with ID ${habit.user_id} not found in the database.`,
                );
            } else {
                console.log(`User found: ${userFromDB.discord_tag}`);
                const user = await client.users
                    .fetch(userFromDB.discord_snowflake_id)
                    .catch(() => null);
                if (user) {
                    // TODO: make this configurable
                    const channelId = '1344805822047191142'; // test channel id
                    const channel = client.channels.cache.get(
                        '1344805822047191142',
                    ) as TextChannel;
                    if (channel && channel.isTextBased()) {
                        await channel.send(
                            `${user} ⏰ Reminder: Time to do your habit: **${habit.habit_name}**!`,
                        );
                    } else {
                        console.error(
                            `Channel with ID ${channelId} not found or is not a text channel.`,
                        );
                    }
                }
            }
        }
    }
});
