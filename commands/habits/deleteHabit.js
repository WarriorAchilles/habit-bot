import { SlashCommandBuilder } from 'discord.js';
import { Habits, Users } from '../../utils/database.js';

export const data = new SlashCommandBuilder()
    .setName('delete-habit')
    .setDescription("deletes a habit that you've created")
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
            habit_name: habitName,
        },
    });

    try {
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
