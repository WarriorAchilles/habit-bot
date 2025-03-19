import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('tableflip')
    .setDescription("Flips a table. Use when you're angry");

export async function execute(interaction) {
    await interaction.reply('(╯°□°）╯︵ ┻━┻');
}
