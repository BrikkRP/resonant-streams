const { ActivityType } = require('discord.js');
const config = require('./config');
const { addLiveRole, removeLiveRole } = require('./roleManager');
const { sendLog } = require('./logger');

function twitchActivity(presence) {
  return presence?.activities?.find(activity =>
    activity.type === ActivityType.Streaming &&
    /^https?:\/\/(?:www\.)?twitch\.tv\//i.test(activity.url || '')
  );
}

async function handlePresenceUpdate(oldPresence, newPresence) {
  const member = newPresence?.member || oldPresence?.member;
  if (!member || member.user.bot) return;
  if (config.guildId && member.guild.id !== config.guildId) return;

  try {
    const activity = twitchActivity(newPresence);
    const title = (activity?.details || '').toLowerCase();
    const qualifies = Boolean(activity) && config.keywords.some(keyword => title.includes(keyword));

    if (!qualifies) {
      const removed = await removeLiveRole(member);
      if (removed) {
        await sendLog(member.guild, 'Stream Ended / Not Eligible',
          'Live Now role removed: no qualifying Twitch stream was detected.', member);
      }
      return;
    }

    console.log(`${member.user.tag} is streaming: ${activity.details || 'Untitled stream'}`);
    const added = await addLiveRole(member);
    if (!added) return;

    await sendLog(member.guild, 'Stream Detected',
      `Live Now role added.\n\n**Title:** ${activity.details || 'Untitled stream'}`, member);

    // No public live announcement. The setup embed is sent only as a reply
    // to a Twitch link posted in the configured content creation channel.
  } catch (error) {
    console.error(`Presence handler error for ${member.user.tag}:`, error);
  }
}

module.exports = handlePresenceUpdate;
