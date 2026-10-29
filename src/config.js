require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  liveRoleId: process.env.LIVE_ROLE_ID,
  logChannelId: process.env.LOG_CHANNEL_ID,
  contentCreationChannelId: process.env.CONTENT_CREATION_CHANNEL_ID,
  keywords: (process.env.KEYWORDS || 'ResonantRP,Resonant RP,Resonant Roleplay')
    .split(',')
    .map(keyword => keyword.trim().toLowerCase())
    .filter(Boolean)
};
