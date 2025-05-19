import { Events, Interaction, MessageFlags } from 'discord.js';
import { CustomClient } from '../types/CustomClient.ts';

export const name = Events.InteractionCreate;
export const execute = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const client = interaction.client as CustomClient;
    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`,
        );
        throw new Error(
            `No command matching ${interaction.commandName} was found.`,
        );
    }

    try {
        console.log(
            `User ${interaction.user.globalName} (${interaction.user.tag}) used ${interaction.commandName}`,
        );
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        }
    }
};
