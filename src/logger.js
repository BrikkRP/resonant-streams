const { EmbedBuilder } = require('discord.js');
const config = require('./config');

async function sendLog(guild, title, description, member = null) {
  if (!config.logChannelId) return;
  try {
    const channel = await guild.channels.fetch(config.logChannelId);
    if (!channel?.isTextBased()) return;
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();
    if (member) embed.addFields({ name: 'Member', value: member.user.tag });
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Log channel error:', error);
  }
}

module.exports = { sendLog };
