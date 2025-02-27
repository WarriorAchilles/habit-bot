// Require all the necessary discord.js classes
import { Client, Events, GatewayIntentBits } from "discord.js";
import configs from "./config.json" with { type: "json" };

const token = configs.token;

// Create a new client instance
// "Guild" refers to a Discord server
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log into Discord with your client's token
client.login(token);
