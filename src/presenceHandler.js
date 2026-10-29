const { ActivityType } = require('discord.js');
const config = require('./config');
const { addLiveRole, removeLiveRole } = require('./roleManager');
const { sendLog } = require('./logger');
const { sendLiveAnnouncement } = require('./liveAnnouncer');

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
    const qualifies = !!activity && config.keywords.some(word => title.includes(word));

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

    try {
      await sendLiveAnnouncement(member, activity);
    } catch (error) {
      console.error('Live announcement error:', error);
    }
  } catch (error) {
    console.error(`Presence handler error for ${member.user.tag}:`, error);
  }
}

module.exports = handlePresenceUpdate;
