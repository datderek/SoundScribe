import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('enable-recording')
  .setDescription('Enables recording for the invoked user.')

export async function execute(interaction) {
  const embed = new EmbedBuilder();
  
  /*
   * Adds the user to the set of recordable users.
   */
  const userName = interaction.member.user.username;
  const userId = interaction.member.user.id;
  interaction.client.recordable.add(userId);

  embed.setColor(0x22C55E)
    .setTitle('Recording enabled.')
    .setDescription(`The bot will now record audio from ${userName}`);

  return await interaction.reply({ embeds: [embed], ephemeral: true });
}