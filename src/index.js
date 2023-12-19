import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';

config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] })

// Executes when the Discord bot is connected
function ready() {
  console.log(`Ready! Logged in as ${client.user.tag}`);
}

// Event listeneder for client ready
client.once(Events.ClientReady, ready);

// Login into Discord with client's token
client.login(process.env.TOKEN);