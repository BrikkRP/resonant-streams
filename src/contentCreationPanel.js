const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageFlags
} = require('discord.js');
const config = require('./config');

const GUIDE_BUTTON_ID = 'resonant_streams_live_role_guide';
const TWITCH_LINK = /(?:https?:\/\/)?(?:www\.|m\.)?twitch\.tv\/[a-z0-9_]+(?:[/?#][^\s<>]*)?/i;

function buildGuideEmbed() {
  return new EmbedBuilder()
    .setColor(0x008080)
    .setTitle('Getting the Live Now Role')
    .setDescription([
      'To receive the Live on Resonant RP role, Discord must show that you are streaming on Twitch, and your stream title must include one of these:',
      '',
      '> ResonantRP',
      '> Resonant RP',
      '> Resonant Roleplay',
      '',
      '**1. Connect your Twitch account**',
      'Open the Discord desktop app, click User Settings beside your username, then select Connections → Twitch. Link the account you stream from and enable Display on profile.',
      '',
      '**2. Enable activity sharing**',
      'Go to User Settings → Activity Privacy and enable Share your detected activities with others or Share my activity, depending on your Discord version.',
      '',
      '**3. Check the server’s privacy settings**',
      'Right-click the Resonant Roleplay server icon → Privacy Settings and enable Activity Status.',
      '',
      '**4. Enable Streamer Mode**',
      'Go to User Settings → Streamer Mode and turn on Enable Streamer Mode. You can also enable Automatically Enable/Disable for supported streaming software.',
      '',
      '**5. Go live and check your status**',
      'Keep Discord open while streaming. Your profile should display a purple Streaming status with your Twitch stream.',
      '',
      '**Still missing the role?**',
      'Confirm your title includes one of the keywords above and ask someone to check whether they can see your streaming status. If it is missing, restart Discord and reconnect Twitch if needed.',
      '',
      '***Streamer Mode alone does not make you appear live. Your Twitch streaming activity must be visible to Discord for the bot to detect it.***'
    ].join('\n'));
}

async function handleContentCreationMessage(message) {
  if (!message.inGuild() || message.author.bot) return;
  if (!config.contentCreationChannelId || message.channelId !== config.contentCreationChannelId) return;
  if (config.guildId && message.guildId !== config.guildId) return;
  if (!TWITCH_LINK.test(message.content)) return;

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(GUIDE_BUTTON_ID)
      .setLabel('How to Get the Live Now Role')
      .setStyle(ButtonStyle.Primary)
  );

  try {
    await message.reply({
      content: 'Need help getting the **Live on Resonant RP** role? Click below to view the setup guide privately.',
      components: [row],
      allowedMentions: { repliedUser: false },
      failIfNotExists: false
    });
    console.log(`Posted setup-guide button for ${message.author.tag}`);
  } catch (error) {
    console.error('Could not post setup-guide button:', error);
  }
}

async function handleGuideButton(interaction) {
  if (!interaction.isButton() || interaction.customId !== GUIDE_BUTTON_ID) return;
  try {
    await interaction.reply({
      embeds: [buildGuideEmbed()],
      flags: MessageFlags.Ephemeral
    });
  } catch (error) {
    console.error('Could not show private setup guide:', error);
  }
}

module.exports = { handleContentCreationMessage, handleGuideButton };
