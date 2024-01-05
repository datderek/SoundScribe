import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';

export const data = new SlashCommandBuilder()
  .setName('join')
  .setDescription('Joins your voice channel.');

export async function execute(interaction) {
  await interaction.deferReply({ephemeral: true});

  let connection;
  const channel = interaction.member.voice.channel;
  const embed = new EmbedBuilder();

  /*
   * Attempt to establish a connection to the user's voice channel
   */
  if (channel) {
    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      selfDeaf: false,
      selfMute: true,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
  } else {
    embed.setColor(0xEF4444)
      .setTitle('Please join a voice channel!')
      .setDescription('You must be in a channel for the bot to join.');
      await interaction.followUp({ embeds: [embed] });
      return;
  }

  /*
   * Handles when a connection is not yet in the Ready state. Allows the
   * connection 10 seconds to enter the ready state before destroying the connection
   * and throwing an error.
   */
  try {
    entersState(connection, VoiceConnectionStatus.Ready, 10e3);
    embed.setColor(0x22C55E)
      .setTitle('Joined!');
    await interaction.followUp({ embeds: [embed] });
    return connection;
  } catch (error) {
    connection.destroy();
    embed.setColor(0xEF4444)
      .setTitle('Failed to join the channel within 10 seconds!')
    await interaction.followUp({ embeds: [embed] });
    throw error;
  }
}