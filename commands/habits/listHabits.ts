import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Habits, Users } from '../../utils/database';

export const data = new SlashCommandBuilder()
    .setName('list-habits')
    .setDescription('List all your habits');

export async function execute(interaction: ChatInputCommandInteraction) {
    const userTag = interaction.user.tag;

    const user = await Users.findOne({
        where: {
            discord_tag: userTag,
        },
    });

    if (!user) {
        throw new Error('User not found');
    }
    const habits = await Habits.findAll({
        where: {
            user_id: user.id,
        },
    });

    if (!habits || habits.length === 0) {
        return await interaction.reply(
            `You don't have any habits yet. Use /create-habit to create one!`,
        );
    }

    // possible future todo: make table paginated
    const habitString = habits
        .map((habit) => {
            return (
                `## ${habit.habit_name}\n` +
                '**Description:**\n' +
                habit.habit_description +
                '\n' +
                '**Frequency:**\n' +
                habit.frequency +
                '\n' +
                '**Reminder Time:**\n' +
                habit.reminder_time +
                '\n\n'
            );
        })
        .join('');

    return await interaction.reply(habitString);
}
