const { EmbedBuilder } = require('discord.js');
const config = require('./config');

async function sendLiveAnnouncement(member, streamActivity) {

    const channel =
        member.guild.channels.cache.get(
            config.liveAnnounceChannelId
        );

    if (!channel) return;

    const streamTitle =
        streamActivity.details || 'Unknown Title';

    const streamUrl =
        streamActivity.url || null;

    const pingText =
        config.livePingRoleId
            ? `<@&${config.livePingRoleId}>`
            : '';

    const embed = new EmbedBuilder()
        .setTitle(`🔴 ${member.displayName} is now live!`)
        .setDescription(
            [
                `**Title:** ${streamTitle}`,
                streamUrl
                    ? `**Watch:** ${streamUrl}`
                    : null
            ]
                .filter(Boolean)
                .join('\n')
        )
        .setTimestamp();

    await channel.send({
        content: pingText,
        embeds: [embed],
        allowedMentions: {
            roles: config.livePingRoleId
                ? [config.livePingRoleId]
                : []
        }
    });
}

module.exports = {
    sendLiveAnnouncement
};
