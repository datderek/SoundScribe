import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('opt-out')
  .setDescription('Disables recording and transcription for the invoked user.')

export async function execute(interaction) {
  const embed = new EmbedBuilder();

  /*
   * Removes the user from the set of recordable users.
   */
  const userName = interaction.member.user.username;
  const userId = interaction.member.user.id;
  if (interaction.client.recordable.delete(userId)) {
    embed.setColor(0x22C55E)
      .setTitle('Recording disabled.')
      .setDescription(`The bot will no longer receive audio from ${userName}`);
  } else {
    embed.setColor(0xEF4444)
      .setTitle('You have already disabled recording.')
  }
  
  return await interaction.reply({ embeds: [embed], ephemeral: true });
}