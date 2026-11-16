const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require('discord.js');
const config = require('./config');

const TWITCH_BUTTON_ID = 'resonant_streams_twitch_guide';
const KICK_BUTTON_ID = 'resonant_streams_kick_guide';
const LEGACY_BUTTON_ID = 'resonant_streams_live_role_guide';
const STREAM_LINK = /(?:https?:\/\/)?(?:(?:www\.|m\.)?twitch\.tv\/[a-z0-9_]+|(?:www\.)?kick\.com\/[a-z0-9_-]+)(?:[/?#][^\s<>]*)?/i;

const keywords = ['> ResonantRP', '> Resonant RP', '> Resonant Roleplay'].join('\n');

function buildTwitchGuide() {
  return new EmbedBuilder()
    .setColor(0x9146FF)
    .setTitle('Getting the Live Now Role — Twitch')
    .setDescription([
      'To receive the Live on Resonant RP role, Discord must show that you are streaming on Twitch, and your stream title must include one of these:',
      '', keywords, '',
      '**1. Connect your Twitch account**',
      'Open the Discord desktop app, click User Settings beside your username, then select Connections → Twitch. Link the account you stream from and enable Display on profile.', '',
      '**2. Enable activity sharing**',
      'Go to User Settings → Activity Privacy and enable Share your detected activities with others or Share my activity, depending on your Discord version.', '',
      '**3. Check the server’s privacy settings**',
      'Right-click the Resonant Roleplay server icon → Privacy Settings and enable Activity Status.', '',
      '**4. Enable Streamer Mode**',
      'Go to User Settings → Streamer Mode and turn on Enable Streamer Mode. You can also enable Automatically Enable/Disable for supported streaming software.', '',
      '**5. Go live and check your status**',
      'Keep Discord open while streaming. Your profile should display a purple Streaming status with your Twitch stream.', '',
      '**Still missing the role?**',
      'Confirm your title includes one of the keywords above and ask someone to check whether they can see your streaming status. If it is missing, restart Discord and reconnect Twitch if needed.', '',
      '***Streamer Mode alone does not make you appear live. Your Twitch streaming activity must be visible to Discord for the bot to detect it.***'
    ].join('\n'));
}

function buildKickGuide() {
  return new EmbedBuilder()
    .setColor(0x53FC18)
    .setTitle('Getting the Live Now Role — Kick')
    .setDescription([
      'To receive the Live on Resonant RP role while streaming on Kick, register your Kick channel and include one of these in your stream title:',
      '', keywords, '',
      '**1. Register your Kick channel**',
      'In Resonant Roleplay, use `/register-kick` and enter your Kick username (not the full URL). Registration activates automatically; no staff approval is required.', '',
      '**2. Go live with an approved title**',
      'The bot checks your registered Kick channel automatically and assigns the Live on Resonant RP role when your live stream title includes an approved keyword.', '',
      '**3. Check or remove your registration**',
      'Use `/kick-status` to view your registration and eligibility. Use `/unregister-kick` if you need to remove it.', '',
      '**Still missing the role?**',
      'Make sure `/kick-status` shows your channel, verify your stream is live and its title includes an approved keyword, and allow a few minutes for the next automatic check.', '',
      '***Kick does not use Discord streaming activity. Your registered channel is checked directly, so enabling Discord Streamer Mode is not required for Kick detection.***'
    ].join('\n'));
}

async function handleContentCreationMessage(message) {
  if (!message.inGuild() || message.author.bot) return;
  if (!config.contentCreationChannelId || (message.channelId !== config.contentCreationChannelId && message.channel.parentId !== config.contentCreationChannelId)) return;
  if (config.guildId && message.guildId !== config.guildId) return;
  if (!STREAM_LINK.test(message.content)) return;

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(TWITCH_BUTTON_ID).setLabel('Twitch Setup Guide').setEmoji('🟣').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(KICK_BUTTON_ID).setLabel('Kick Setup Guide').setEmoji('🟢').setStyle(ButtonStyle.Success)
  );
  try {
    await message.reply({
      content: 'Need the **Live on Resonant RP** role? Choose your streaming platform below. Only you will see the guide you open.',
      components: [row],
      allowedMentions: { repliedUser: false },
      failIfNotExists: false
    });
    console.log(`Posted Twitch/Kick setup buttons for ${message.author.tag}`);
  } catch (error) {
    console.error('Could not post setup-guide buttons:', error);
  }
}

async function handleGuideButton(interaction) {
  if (!interaction.isButton()) return;
  const id = interaction.customId;
  if (![TWITCH_BUTTON_ID, KICK_BUTTON_ID, LEGACY_BUTTON_ID].includes(id)) return;
  try {
    await interaction.reply({
      embeds: [id === KICK_BUTTON_ID ? buildKickGuide() : buildTwitchGuide()],
      flags: MessageFlags.Ephemeral
    });
  } catch (error) {
    console.error('Could not show private setup guide:', error);
  }
}

module.exports = { handleContentCreationMessage, handleGuideButton };
