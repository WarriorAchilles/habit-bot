import { REST, Routes } from 'discord.js';
import configs from './config.json';
import fs from 'node:fs';
import path from 'node:path';
import { RESTPutAPIApplicationGuildCommandsJSONBody } from 'discord-api-types/v10';

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the comman files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.ts'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
            );
        }
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(configs.token);
// and deploy your commands!
(async () => {
    try {
        console.log(
            `Started refresing ${commands.length} application (/) commands.`,
        );

        // The put method is used to fully refresh all commands in the guild with the current set
        const data: RESTPutAPIApplicationGuildCommandsJSONBody[] | unknown =
            await rest.put(
                // use this for deployment to a specific server
                Routes.applicationGuildCommands(
                    configs.clientId,
                    configs.guildId,
                ),
                // use this instead for global deployment
                // Routes.applicationCommands(configs.clientId),
                { body: commands },
            );

        if (data instanceof Array) {
            console.log(
                `Successfully reloaded ${data.length} application (/) commands`,
            );
        } else {
            console.log('Failed to reload application (/) commands');
        }
    } catch (error) {
        console.error(error);
    }
})();
