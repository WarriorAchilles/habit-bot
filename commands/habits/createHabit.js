import { SlashCommandBuilder } from 'discord.js';
import { Habits, Users } from '../../utils/database.js';

export const data = new SlashCommandBuilder()
    .setName('create-habit')
    .setDescription('Creates a new habit to track.')
    .addStringOption((option) =>
        option
            .setName('name')
            .setDescription('the name of the habit')
            .setRequired(true),
    )
    .addStringOption((option) =>
        option
            .setName('description')
            .setDescription('the description of the habit')
            .setRequired(false),
    )
    .addStringOption((option) =>
        option
            .setName('frequency')
            .setDescription(
                'How often you want to do the habit, and be reminded of it. By default it will be set to daily.',
            )
            .setRequired(false)
            .addChoices(
                { name: 'Daily', value: 'daily' },
                { name: 'Weekdays', value: 'weekdays' },
                { name: 'Weekly', value: 'weekly' },
            ),
    )
    .addStringOption((option) =>
        option
            .setName('time')
            .setDescription(
                "The time you would to be reminded of the habit. Format like either '8:00 PM' or '20:00'.",
            )
            .setRequired(false),
    );

export async function execute(interaction) {
    const habitName = interaction.options.getString('name');
    const habitDescription = interaction.options.getString('description');
    const habitfrequency = interaction.options.getString('frequency');
    const habitReminderTime = interaction.options.getString('time');
    const userTag = interaction.user.tag;

    let user = await Users.findOne({
        where: { discord_tag: userTag },
    });

    // add new user to the database
    if (!user) {
        try {
            const newUser = await Users.create({
                discord_tag: userTag,
            });
            user = newUser;
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return await interaction.reply('That user already exists.');
            }

            return await interaction.reply(
                'Something went wrong with adding a user.',
            );
        }
    }

    try {
        const habit = await Habits.create({
            habit_name: habitName,
            habit_description: habitDescription,
            frequency: habitfrequency,
            reminder_time: habitReminderTime ?? '12:00 PM', // TODO: sanitize input
            user_id: user.id,
        });

        return await interaction.reply(`Habit ${habit.habit_name} added.`);
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return await interaction.reply('That tag already exists.');
        }

        return await interaction.reply(
            'Something went wrong with adding a habit.',
        );
    }
}
