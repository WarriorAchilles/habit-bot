import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Habits, Users } from '../../utils/database';

export const data = new SlashCommandBuilder()
    .setName('delete-habit')
    .setDescription("deletes a habit that you've created")
    .addStringOption((option) =>
        option
            .setName('name')
            .setDescription('the name of the habit')
            .setRequired(true),
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const habitName = interaction.options.getString('name')?.toLowerCase();
    const userTag = interaction.user.tag;

    if (!habitName) {
        return await interaction.reply('Please provide a habit name.');
    }

    try {
        const user = await Users.findOne({
            where: {
                discord_tag: userTag,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const habit = await Habits.findOne({
            where: {
                user_id: user.id,
                habit_name: habitName, // TODO: sanitize user input?
            },
        });
        if (!habit) {
            throw new Error('Habit not found');
        }
        await habit.destroy();
        return await interaction.reply(
            `Successfully removed habit ${habitName}`,
        );
    } catch (e) {
        console.log(`Error removing habit ${habitName}: ${e}`);
        return await interaction.reply(
            `Something went wrong when removing habit ${habitName}.`,
        );
    }
}
