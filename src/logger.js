const { EmbedBuilder } = require('discord.js');
const config = require('./config');

async function sendLog(guild, title, description, member = null) {

    const channel = guild.channels.cache.get(config.logChannelId);

    if (!channel) return;

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();

    if (member) {
        embed.addFields({
            name: 'Member',
            value: `${member.user.tag}`
        });
    }

    await channel.send({
        embeds: [embed]
    });
}

module.exports = {
    sendLog
};
