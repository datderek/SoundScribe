import { EmbedBuilder } from 'discord.js'
import { entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice'

/*
 * Joins the invoked user's voice channel and returns the voice connection on 
 * success, otherwise throws an error
 */
export async function joinChannel(interaction) {
    const embed = new EmbedBuilder();
    const channel = interaction.member.voice.channel;

    /*
     * Attempt to establish a connection to the user's voice channel
     */
    let connection;
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
        await interaction.reply({ embeds: [embed] });
        throw new Error('User not in a voice channel');
    }

    /*
     * Allows the connection 10 seconds to enter the Ready state before throwing
     * an error and destroying the attempted connection.
     */
    try {
      entersState(connection, VoiceConnectionStatus.Ready, 10e3);
      return connection;
    } catch (error) {
      connection.destroy();
      embed.setColor(0xEF4444)
        .setTitle('Failed to join the channel.')
        .setDescription('Soundscribe failed to join to voice channel within 10 seconds, please try again.')
      await interaction.reply({ embeds: [embed] });
      throw error;
    }
}