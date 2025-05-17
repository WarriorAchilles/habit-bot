import { SlashCommandBuilder } from 'discord.js';
import { Habits, Users, HabitCompletions } from '../../utils/database.js';

export const data = new SlashCommandBuilder()
    .setName('markdone')
    .setDescription('Marks a habit as done for the day/week/month')
    .addStringOption((option) =>
        option
            .setName('name')
            .setDescription('the name of the habit')
            .setRequired(true),
    );

export async function execute(interaction) {
    const habitName = interaction.options.getString('name');
    const userTag = interaction.user.tag;

    const user = await Users.findOne({
        where: {
            discord_tag: userTag,
        },
    });
    const habit = await Habits.findOne({
        where: {
            user_id: user.id,
            habit_name: habitName.toLowerCase(), // todo: sanitize user input?
        },
    });

    try {
        await HabitCompletions.create({
            user_id: user.id,
            habit_id: habit.id,
            completed_at: Date.now(),
        });
        // Possible TODO: maybe change this response message based on habit frequency
        return await interaction.reply(
            `Congrats on completing your habit ${habitName}!`,
        );
    } catch (e) {
        console.log(`Error completing habit ${habitName}: ${e}`);
        return await interaction.reply(
            `Something went wrong when marking habit ${habitName} complete.`,
        );
    }
}
