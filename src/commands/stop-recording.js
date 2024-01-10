import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

export const data = new SlashCommandBuilder()
  .setName("stop-recording")
  .setDescription("Ends the recording.");

export async function execute (interaction) {
  const embed = new EmbedBuilder();
  const connection = getVoiceConnection(interaction.guildId);
  if (connection) {
    const receiver = connection.receiver;
    for (const [ /*userId*/, stream ] of receiver.subscriptions) {
      stream.emit('end');
    }
    connection.destroy();

    embed.setColor(0x22C55E)
      .setTitle("Recording has successfully ended.");
  } else {
    embed.setColor(0xEF4444)
      .setTitle("Bot is not currently recording.");
  }
  return await interaction.reply({ embeds : [embed] });
}