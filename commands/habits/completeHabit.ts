import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Habits, Users, HabitCompletions } from '../../utils/database';

export const data = new SlashCommandBuilder()
    .setName('markdone')
    .setDescription('Marks a habit as done for the day/week/month')
    .addStringOption((option) =>
        option
            .setName('name')
            .setDescription('the name of the habit')
            .setRequired(true),
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const habitName = interaction.options.getString('name');
    const userTag = interaction.user.tag;

    const user = await Users.findOne({
        where: {
            discord_tag: userTag,
        },
    });
    if (!user) {
        return await interaction.reply(
            'You need to register a habit first using `/register` before you can mark it as done.',
        );
    }
    const habit = await Habits.findOne({
        where: {
            user_id: user?.id,
            habit_name: habitName?.toLowerCase(), // todo: sanitize user input?
        },
    });

    if (!habit) {
        return await interaction.reply(
            `You don't have a habit called ${habitName}. Please check the name and try again.`,
        );
    }

    try {
        await HabitCompletions.create({
            user_id: user?.id,
            habit_id: habit?.id,
            completed_at: new Date(),
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
