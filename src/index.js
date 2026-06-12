require('dotenv').config();

const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const config = require('./config');
const handlePresenceUpdate = require('./presenceHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

client.once('ready', () => {
    console.log('================================');
    console.log(`Logged in as ${client.user.tag}`);
    console.log('Resonant Streams Online');
    console.log('================================');

    client.user.setActivity('for Twitch streams');
});

client.on('presenceUpdate', handlePresenceUpdate);

process.on('unhandledRejection', error => {
    console.error('Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
});

if (!config.token) {
    console.error('Missing DISCORD_TOKEN in .env');
    process.exit(1);
}

client.login(config.token);
