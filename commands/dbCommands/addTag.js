import { SlashCommandBuilder } from 'discord.js';
import { Tags } from '../../utils/database.js';

export const data = new SlashCommandBuilder()
    .setName('add-tag')
    .setDescription('Adds a tag to the database')
    .addStringOption((option) =>
        option
            .setName('name')
            .setDescription('the name of the tag')
            .setRequired(true),
    )
    .addStringOption((option) =>
        option
            .setName('description')
            .setDescription('the description of the tag')
            .setRequired(true),
    );

export async function execute(interaction) {
    const tagName = interaction.options.getString('name');
    const tagDescription = interaction.options.getString('description');
    const tagUsername = interaction.user.username;

    try {
        // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
        const tag = await Tags.create({
            name: tagName,
            description: tagDescription,
            username: tagUsername,
        });

        return await interaction.reply(`Tag ${tag.name} added.`);
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return await interaction.reply('That tag already exists.');
        }

        return await interaction.reply(
            'Something went wrong with adding a tag.',
        );
    }
}
