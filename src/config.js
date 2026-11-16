require('dotenv').config();
module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  liveRoleId: process.env.LIVE_ROLE_ID,
  logChannelId: process.env.LOG_CHANNEL_ID,
  contentCreationChannelId: process.env.CONTENT_CREATION_CHANNEL_ID,
  kickRegistrationRoleId: process.env.KICK_REGISTRATION_ROLE_ID || '1196068828057186306',
  kickClientId: process.env.KICK_CLIENT_ID,
  kickClientSecret: process.env.KICK_CLIENT_SECRET,
  dataDir: process.env.DATA_DIR || './data',
  kickPollMs: Math.max(60000, Number(process.env.KICK_POLL_SECONDS || 120) * 1000),
  keywords: (process.env.KEYWORDS || 'ResonantRP,Resonant RP,Resonant Roleplay').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
};
