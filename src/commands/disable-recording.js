import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('disable-recording')
  .setDescription('Disables recording for the invoked user.')

export async function execute(interaction) {
  const embed = new EmbedBuilder();

  /*
   * Removes the user from the set of recordable users.
   */
  const userName = interaction.member.user.username;
  const userId = interaction.member.user.id;
  interaction.client.recordable.delete(userId);

  embed.setColor(0x22C55E)
    .setTitle('Recording disabled.')
    .setDescription(`The bot will no longer record audio from ${userName}`);
  return await interaction.reply({ embeds: [embed], ephemeral: true });
}