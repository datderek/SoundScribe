import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { spawn } from 'child_process';

export const data = new SlashCommandBuilder()
  .setName("stop-recording")
  .setDescription("Ends the recording.");

export async function execute (interaction) {
  const embed = new EmbedBuilder();

  /*
   * Ends the recording by destroying all of the active Audio stream subscriptions
   * and removing the bot from the channel. Clears the array of filenames for
   * subsequent recordings.
   */
  const connection = getVoiceConnection(interaction.guildId);
  if (connection) {
    const receiver = connection.receiver;
    for (const [ /*userId*/, stream ] of receiver.subscriptions) {
      stream.emit('end');
    }
    connection.destroy();
    interaction.client.recordingFileNames = [];
    
    embed.setColor(0x22C55E)
      .setTitle("Recording has successfully ended.");
  } else {
    embed.setColor(0xEF4444)
      .setTitle("Bot is not currently recording.");
  }
  return await interaction.reply({ embeds : [embed] });
}