require('dotenv').config();

module.exports = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    liveRoleId: process.env.LIVE_ROLE_ID,
    logChannelId: process.env.LOG_CHANNEL_ID,
    keywords: (process.env.KEYWORDS || '')
        .split(',')
        .map(keyword => keyword.trim().toLowerCase())
        .filter(Boolean)
};
