require('dotenv').config();

const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const config = require('./config');
const handlePresenceUpdate = require('./presenceHandler');
const { handleContentCreationMessage, handleGuideButton } = require('./contentCreationPanel');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('clientReady', () => {
  console.log(`Resonant Streams online as ${client.user.tag}`);
  client.user.setActivity('for Twitch streams', { type: ActivityType.Watching });
});

client.on('presenceUpdate', handlePresenceUpdate);
client.on('messageCreate', handleContentCreationMessage);
client.on('interactionCreate', handleGuideButton);

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

if (!config.token) {
  console.error('Missing DISCORD_TOKEN Railway variable.');
  process.exit(1);
}
client.login(config.token);
