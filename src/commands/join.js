import { SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';


export const data = new SlashCommandBuilder()
  .setName('join')
  .setDescription('Joins your voice channel.');

export async function execute(interaction) {
  const channel = interaction.member.voice.channel;
  if (channel) {
    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      selfDeaf: false,
      selfMute: true,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    })
    await interaction.reply('Joined!');
  } else {
    await interaction.reply('Please join a voice channel first.');
  }
}