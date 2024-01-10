import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { saveAudioStreamToFile } from '../utils/saveAudioStreamToFile.js';

export const data = new SlashCommandBuilder()
  .setName('start-recording')
  .setDescription("Starts recording audio for users that granted permission.");

export async function execute(interaction) {
  const embed = new EmbedBuilder();
  const pause = new ButtonBuilder()
    .setCustomId('stop')
    .setLabel('⏹️ Stop')
    .setStyle(ButtonStyle.Danger);
  const row = new ActionRowBuilder()
    .addComponents(pause);

  if (interaction.client.recordable.size === 0) {
    embed.setColor(0xEF4444)
      .setTitle("No users to record!")
      .setDescription("If you would like to have your audio recorded, please\
      enable the recording via `/enable-recording`");

    return await interaction.reply({ embeds: [embed] });
  }

  /*
   * Starts recording audio for all users that enabled recording if they are in
   * the same channel as the bot.
   */
  const connection = getVoiceConnection(interaction.guildId);
  if (connection && connection.state.status === 'ready') {
    const channelId = interaction.member.voice.channel.id;
    const voiceChannel = interaction.client.channels.cache.get(channelId);
    const receiver = connection.receiver;
    let usersRecorded = "";

    for (const [member, info] of voiceChannel.members) {
      const userId = member;
      const userName = info.user.username;
      if (interaction.client.recordable.has(userId)) {
        usersRecorded += `- ${userName}\n`;
        saveAudioStreamToFile(receiver, userId, userName);
      }
    }

    embed.setColor(0x22C55E)
      .setTitle('Recording has started.')
      .setDescription(`SoundScribe is now recording audio!`)
      .addFields({ name: 'Audio recorded for users:', value: usersRecorded })
  } else {
    embed.setColor(0xEF4444)
      .setTitle("Please invite the bot!")
      .setDescription("Bot needs to be in a channel to start recording. Please\
      invite the bot to your channel via `/join`");
  }
  return await interaction.reply({ embeds: [embed], components: [row] });

}