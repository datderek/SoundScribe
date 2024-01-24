import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';

config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] })

/*
 * Stores all IDs of the users that can be recorded by the bot.
 */
client.recordable = new Set();

/*
 * Stores all of the transcription processes started by the bot.
 */
client.processes = [];

/* 
 * Loads in the commands from the files
 */
client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = await import(`./commands/${file}`);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

/* 
 * Loads in the event handlers from the files 
 */
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = await import(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);