const { ActivityType } = require('discord.js');
const config = require('./config');
const { addLiveRole, removeLiveRole } = require('./roleManager');
const { sendLog } = require('./logger');
const store = require('./kickStore');
const kickEligible = new Map();
function twitchEligible(presence) {
  return Boolean(presence?.activities?.some(a => a.type === ActivityType.Streaming && /^https?:\/\/(?:www\.)?twitch\.tv\//i.test(a.url || '') && config.keywords.some(k => String(a.details || '').toLowerCase().includes(k))));
}
async function reconcile(member, presence) {
  if (!member || member.user.bot || (config.guildId && member.guild.id !== config.guildId)) return;
  const kick = store.get(member.id);
  const qualifies = twitchEligible(presence === undefined ? member.presence : presence) || Boolean(kick && kickEligible.get(member.id));
  try {
    const changed = qualifies ? await addLiveRole(member) : await removeLiveRole(member);
    if (changed) await sendLog(member.guild, qualifies ? 'Stream Detected' : 'Stream Ended / Not Eligible', qualifies ? 'Live Now role added: qualifying Twitch or Kick stream detected.' : 'Live Now role removed: no qualifying Twitch or Kick stream detected.', member);
  } catch (error) { console.error(`Role reconciliation for ${member.id}:`, error); }
}
async function handlePresenceUpdate(oldPresence, newPresence) {
  const member = newPresence?.member || oldPresence?.member;
  if (member) await reconcile(member, newPresence);
}
module.exports = { kickEligible, twitchEligible, reconcile, handlePresenceUpdate };
