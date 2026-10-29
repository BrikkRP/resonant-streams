const { EmbedBuilder } = require('discord.js');
const config = require('./config');

async function sendLiveAnnouncement(member, activity) {
  if (!config.liveAnnounceChannelId) return;
  const channel = await member.guild.channels.fetch(config.liveAnnounceChannelId);
  if (!channel?.isTextBased()) {
    console.error('Live announcement channel unavailable.');
    return;
  }

  const title = activity.details || 'Untitled stream';
  const url = /^https:\/\/(?:www\.)?twitch\.tv\/[a-z0-9_]+(?:[/?#].*)?$/i.test(activity.url || '')
    ? activity.url
    : null;

  const embed = new EmbedBuilder()
    .setColor(0x008080)
    .setTitle(`${member.displayName} is now live!`)
    .setDescription(`**Title:** ${title}${url ? `\n**Watch:** ${url}` : ''}`)
    .setTimestamp();

  await channel.send({
    content: config.livePingRoleId ? `<@&${config.livePingRoleId}>` : '',
    embeds: [embed],
    allowedMentions: { roles: config.livePingRoleId ? [config.livePingRoleId] : [] }
  });
}

module.exports = { sendLiveAnnouncement };
