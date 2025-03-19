import { SlashCommandBuilder } from 'discord.js';
import { Tags } from '../../utils/database.js';

export const data = new SlashCommandBuilder()
    .setName('get-tag')
    .setDescription('Retrieves a tag from the database')
    .addStringOption((option) =>
        option
            .setName('name')
            .setDescription('the name of the tag to be retreived')
            .setRequired(true),
    );

export async function execute(interaction) {
    const tagName = interaction.options.getString('name');
    try {
        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({
            where: { name: tagName },
        });

        if (tag) {
            // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
            tag.increment('usage_count');

            return await interaction.reply(tag.get('description'));
        }

        return await interaction.reply(`Could not find tag: ${tagName}`);
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return await interaction.reply('That tag already exists.');
        }

        return await interaction.reply(
            'Something went wrong with adding a tag.',
        );
    }
}
