import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

export const data = new SlashCommandBuilder()
  .setName("stop-recording")
  .setDescription("Ends the recording.");

export async function execute (interaction) {
  const embed = new EmbedBuilder();

  /*
   * Ends the transcription by destroying all of the active audio stream
   * subscriptions, killing all transcription processes, and removing the bot 
   * from the channel.
   */
  const connection = getVoiceConnection(interaction.guildId);
  if (connection) {
    const receiver = connection.receiver;
    for (const [ /*userId*/, stream ] of receiver.subscriptions) {
      stream.emit('end');
    }
    
    interaction.client.processes.forEach((process) => {
      process.kill('SIGTERM');
    })

    connection.destroy();
    interaction.client.recordable.clear();
    interaction.client.processes = [];
    
    embed.setColor(0x22C55E)
      .setTitle("Recording and transcription has successfully ended.")
  } else {
    embed.setColor(0xEF4444)
      .setTitle("Bot is not currently recording.");
  }
  return await interaction.reply({ embeds : [embed] });
}