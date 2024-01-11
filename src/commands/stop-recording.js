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

    /*
     * Create Python child processes to transcribe the audio for each user and 
     * output the transcription in Discord embeds.
     */
    let transcription = '';
    for (const fileName of interaction.client.recordingFileNames) {
      const childPython = spawn('python', ['./src/utils/transcribe.py', 
        `${fileName}`]);
      childPython.stdout.on('data', async (data) => {
        const exampleEmbed = new EmbedBuilder()
	        .setTitle('Transcription completed.')
	        .setDescription(`${data}`);
        await interaction.editReply({embeds: [exampleEmbed]});
      })
      childPython.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      })
      childPython.on('close', (code) => {
      })
    }

    connection.destroy();
    interaction.client.recordingFileNames = [];
    interaction.client.recordable.clear();
    
    embed.setColor(0x22C55E)
      .setTitle("Recording has successfully ended.")
      .setDescription("Please wait while the audio is being transcribed...")
  } else {
    embed.setColor(0xEF4444)
      .setTitle("Bot is not currently recording.");
  }
  return await interaction.reply({ embeds : [embed] });
}