import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';

export const data = new SlashCommandBuilder()
  .setName('join')
  .setDescription('Joins your voice channel.');

export async function execute(interaction) {
  const channel = interaction.member.voice.channel;
  const embed = new EmbedBuilder();
  if (channel) {
    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      selfDeaf: false,
      selfMute: true,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    embed.setColor(0x22C55E)
      .setTitle('Joined!');
  } else {
    embed.setColor(0xEF4444)
      .setTitle('Please join a voice channel!')
      .setDescription('You must be in a channel for the bot to join.');
  }
  await interaction.reply({ embeds: [embed], ephemeral: true });
}