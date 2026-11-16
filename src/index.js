require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const config = require('./config');
const store = require('./kickStore');
const { handlePresenceUpdate } = require('./eligibility');
const { handleContentCreationMessage, handleGuideButton } = require('./contentCreationPanel');
const kickCommands = require('./kickCommands');
const kickMonitor = require('./kickMonitor');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.once('clientReady', async () => {
  console.log(`Resonant Streams online as ${client.user.tag}`);
  client.user.setActivity('Twitch & Kick streams', { type: ActivityType.Watching });
  try { await kickCommands.deploy(); } catch (e) { console.error('Kick command registration failed:', e); }
  kickMonitor.start(client);
});
client.on('presenceUpdate', handlePresenceUpdate);
client.on('messageCreate', handleContentCreationMessage);
client.on('interactionCreate', async interaction => { await handleGuideButton(interaction); await kickCommands.handle(interaction); });
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
if (!config.token || !config.guildId || !config.liveRoleId) { console.error('Missing DISCORD_TOKEN, GUILD_ID, or LIVE_ROLE_ID'); process.exit(1); }
try { store.load(); } catch (error) { console.error('Could not load Kick registrations:', error); process.exit(1); }
client.login(config.token);
