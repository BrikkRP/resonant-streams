const { PermissionFlagsBits } = require('discord.js');
const config = require('./config');

async function addLiveRole(member) {
  const botMember = await member.guild.members.fetchMe();
  const role = await member.guild.roles.fetch(config.liveRoleId);
  if (!role) throw new Error('LIVE_ROLE_ID does not match a role in this server.');
  if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
    throw new Error('Bot is missing Manage Roles permission.');
  }
  if (botMember.roles.highest.comparePositionTo(role) <= 0) {
    throw new Error('Bot highest role must be above the Live Now role.');
  }
  const current = await member.guild.members.fetch(member.id);
  if (current.roles.cache.has(role.id)) return false;
  await current.roles.add(role, 'Approved Twitch stream detected');
  return true;
}

async function removeLiveRole(member) {
  const current = await member.guild.members.fetch(member.id);
  if (!current.roles.cache.has(config.liveRoleId)) return false;
  await current.roles.remove(config.liveRoleId, 'Twitch stream ended or title no longer qualifies');
  return true;
}

module.exports = { addLiveRole, removeLiveRole };
