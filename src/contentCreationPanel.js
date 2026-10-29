const { EmbedBuilder } = require('discord.js');
const config = require('./config');

// Match a Twitch URL, not unrelated domains such as nottwitch.tv.
const TWITCH_LINK = /(?:https?:\/\/)?(?:www\.|m\.)?twitch\.tv\/[a-z0-9_]+(?:[/?#][^\s<>]*)?/i;

async function handleContentCreationMessage(message) {
  if (!message.inGuild() || message.author.bot) return;
  if (!config.contentCreationChannelId ||
      message.channelId !== config.contentCreationChannelId) return;
  if (config.guildId && message.guildId !== config.guildId) return;
  if (!TWITCH_LINK.test(message.content)) return;

  const embed = new EmbedBuilder()
    .setColor(0x008080)
    .setTitle('Getting the Live Now Role')
    .setDescription(
      'To receive the **Live on Resonant RP** role, Discord must show that you are streaming on Twitch, and your stream title must include one of these:\n\n' +
      '> ResonantRP\n> Resonant RP\n> Resonant Roleplay'
    )
    .addFields(
      {
        name: '1. Connect your Twitch account',
        value: 'Open the Discord desktop app, click **User Settings** beside your username, then select **Connections → Twitch**. Link the account you stream from and enable **Display on profile**.'
      },
      {
        name: '2. Enable activity sharing',
        value: 'Go to **User Settings → Activity Privacy** and enable **Share your detected activities with others** or **Share my activity**, depending on your Discord version.'
      },
      {
        name: '3. Check the server’s privacy settings',
        value: 'Right-click the **Resonant Roleplay** server icon → **Privacy Settings** and enable **Activity Status**.'
      },
      {
        name: '4. Enable Streamer Mode',
        value: 'Go to **User Settings → Streamer Mode** and turn on **Enable Streamer Mode**. You can also enable **Automatically Enable/Disable** for supported streaming software.'
      },
      {
        name: '5. Go live and check your status',
        value: 'Keep Discord open while streaming. Your profile should display a purple **Streaming** status with your Twitch stream.'
      },
      {
        name: 'Still missing the role?',
        value: 'Confirm your title includes one of the keywords above and ask someone to check whether they can see your streaming status. If it is missing, restart Discord and reconnect Twitch if needed.\n\n***Streamer Mode alone does not make you appear live. Your Twitch streaming activity must be visible to Discord for the bot to detect it.***'
      }
    )
    .setFooter({ text: 'Resonant Streams | Streaming Setup Guide' });

  try {
    await message.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
      failIfNotExists: false
    });
    console.log(`Streaming guide replied to ${message.author.tag}`);
  } catch (error) {
    console.error('Content creation reply error:', error);
  }
}

module.exports = { handleContentCreationMessage };
