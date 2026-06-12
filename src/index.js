require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    ActivityType
} = require('discord.js');

const config = require('./config');
const handlePresenceUpdate =
    require('./presenceHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

client.once('clientReady', () => {

    console.log('================================');
    console.log(
        `Logged in as ${client.user.tag}`
    );
    console.log(
        'Resonant Streams Online'
    );
    console.log('================================');

    client.user.setActivity(
        'for Twitch streams',
        {
            type: ActivityType.Watching
        }
    );

});

client.on(
    'presenceUpdate',
    handlePresenceUpdate
);

process.on(
    'unhandledRejection',
    console.error
);

process.on(
    'uncaughtException',
    console.error
);

if (!config.token) {

    console.error(
        'Missing DISCORD_TOKEN'
    );

    process.exit(1);

}

client.login(config.token);
