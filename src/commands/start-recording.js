import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { createTranscription } from '../utils/createTranscription.js';
import { joinChannel } from '../utils/joinChannel.js';

export const data = new SlashCommandBuilder()
  .setName('start-recording')
  .setDescription("Starts recording audio for users that granted permission.");

export async function execute(interaction) {
  const embed = new EmbedBuilder();

  /*
   * Checks if there is atleast one user that has enabled their recording.
   */
  if (interaction.client.recordable.size === 0) {
    embed.setColor(0xEF4444)
      .setTitle("No users to record!")
      .setDescription("If you would like to have your audio recorded, please\
      enable the recording via `/enable-recording`");

    return await interaction.reply({ embeds: [embed] });
  }

  /*
   * Attempt to join the invoked user's voice channel and transcribe audio for 
   * users that opt'd to be recorded AND are in the same voice channel as the bot
   */
  try {
    const connection = await joinChannel(interaction);
    const channelId = interaction.member.voice.channel.id;
    const voiceChannel = interaction.client.channels.cache.get(channelId);
    const receiver = connection.receiver;
    let usersRecorded = "";

    for (const [member, info] of voiceChannel.members) {
      const userId = member;
      const userName = info.user.username;
      if (interaction.client.recordable.has(userId)) {
        usersRecorded += `- ${userName}\n`;
        createTranscription(receiver, userId, userName, interaction);
      }
    }

    embed.setColor(0x22C55E)
      .setTitle('Recording has started.')
      .setDescription(`SoundScribe is now recording audio!`)
      .addFields({ name: 'Audio recorded for users:', value: usersRecorded });
    return await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.log(error);
    return;
  }
}