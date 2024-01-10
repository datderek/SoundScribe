import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

export const data = new SlashCommandBuilder()
  .setName('enable-recording')
  .setDescription('Enables recording for the current user!')

export async function execute(interaction) {
  const embed = new EmbedBuilder();
  const connection = getVoiceConnection(interaction.guildId);
  
  /*
   * Adds the user to the set of recordable users.
   */
  if (connection) {
    const userName = interaction.member.user.username;
    const userId = interaction.member.user.id;
    interaction.client.recordable.add(userId);

    embed.setColor(0x22C55E)
      .setTitle('Enabled recording!')
      .setDescription(`The bot will now record audio from ${userName}`);
  } else {
    embed.setColor(0xEF4444)
    .setTitle('SoundScribe is not ready!')
    .setDescription('Please use `/join` to invite the bot to your channel then try again.')
  }

  return await interaction.reply({ embeds: [embed], ephemeral: true });
}