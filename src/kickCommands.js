const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, REST, Routes } = require('discord.js');
const config = require('./config');
const store = require('./kickStore');
const { findChannel } = require('./kickApi');
const { kickEligible, reconcile } = require('./eligibility');
const commands = [
  new SlashCommandBuilder().setName('register-kick').setDescription('Register your Kick channel for the Live role').addStringOption(o => o.setName('username').setDescription('Your Kick channel username (not a URL)').setRequired(true)),
  new SlashCommandBuilder().setName('unregister-kick').setDescription('Remove your Kick registration'),
  new SlashCommandBuilder().setName('kick-status').setDescription('Check your Kick registration and eligibility'),
  new SlashCommandBuilder().setName('approve-kick').setDescription('Staff: approve a registered Kick channel after checking ownership').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild).addUserOption(o => o.setName('member').setDescription('Member to approve').setRequired(true))
].map(c => c.toJSON());
async function deploy() {
  if (!config.clientId || !config.guildId) throw new Error('CLIENT_ID and GUILD_ID are required to register Kick commands');
  const rest = new REST({ version: '10' }).setToken(config.token);
  // Only modify our four Kick commands. Do not overwrite other slash commands.
  const route = Routes.applicationGuildCommands(config.clientId, config.guildId);
  const existing = await rest.get(route);
  for (const cmd of commands) {
    const found = existing.find(c => c.name === cmd.name);
    if (found) await rest.patch(Routes.applicationGuildCommand(config.clientId, config.guildId, found.id), { body: cmd });
    else await rest.post(route, { body: cmd });
  }
  console.log('Kick slash commands registered.');
}
async function handle(interaction) {
  if (!interaction.isChatInputCommand() || !['register-kick','unregister-kick','kick-status','approve-kick'].includes(interaction.commandName)) return;
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  if (!interaction.inGuild() || (config.guildId && interaction.guildId !== config.guildId)) return interaction.editReply('This command only works in the Resonant Roleplay server.');
  try {
    if (interaction.commandName === 'register-kick') {
      const member = await interaction.guild.members.fetch(interaction.user.id);
      if (!member.roles.cache.has(config.kickRegistrationRoleId)) return interaction.editReply('You do not have the required role to register a Kick channel.');
      const username = interaction.options.getString('username').trim().replace(/^https?:\/\/(?:www\.)?kick\.com\//i, '').replace(/\/$/, '');
      if (!/^[a-zA-Z0-9_-]{2,32}$/.test(username)) return interaction.editReply('Please enter only your Kick username (letters, numbers, underscores, or hyphens).');
      const channel = await findChannel(username);
      if (!channel) return interaction.editReply('I could not find that Kick channel. Check the spelling and try again.');
      const duplicate = store.all().find(r => r.discordId !== interaction.user.id && r.broadcasterId === channel.broadcasterId);
      if (duplicate) return interaction.editReply('That Kick channel is already registered to another member. Contact staff.');
      store.set(interaction.user.id, { ...channel, approved: false });
      kickEligible.delete(interaction.user.id);
      await reconcile(member);
      return interaction.editReply(`Registered **https://kick.com/${channel.username}**. Registration is **pending staff approval**. Staff should verify that you own the channel, then use \`/approve-kick\`.`);
    }
    if (interaction.commandName === 'unregister-kick') {
      if (!store.get(interaction.user.id)) return interaction.editReply('You do not have a registered Kick channel.');
      store.remove(interaction.user.id);
      kickEligible.delete(interaction.user.id);
      await reconcile(await interaction.guild.members.fetch(interaction.user.id));
      return interaction.editReply('Your Kick registration has been removed.');
    }
    if (interaction.commandName === 'kick-status') {
      const r = store.get(interaction.user.id);
      if (!r) return interaction.editReply('You have not registered a Kick channel. Use `/register-kick`.');
      return interaction.editReply(`Channel: **https://kick.com/${r.username}**\nStaff approval: **${r.approved ? 'Approved' : 'Pending'}**\nQualifying Kick stream: **${kickEligible.get(interaction.user.id) ? 'Yes' : 'No / not yet checked'}**`);
    }
    if (interaction.commandName === 'approve-kick') {
      if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) return interaction.editReply('You need Manage Server permission to approve Kick registrations.');
      const user = interaction.options.getUser('member', true);
      const r = store.get(user.id);
      if (!r) return interaction.editReply('That member has not registered a Kick channel.');
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (!member?.roles.cache.has(config.kickRegistrationRoleId)) return interaction.editReply('That member no longer has the required registration role.');
      store.set(user.id, { ...r, approved: true });
      return interaction.editReply(`Approved **${user.username}** for **https://kick.com/${r.username}**. The next polling cycle will check their live status.`);
    }
  } catch (error) {
    console.error('Kick command error:', error);
    return interaction.editReply('The command could not finish. Check the Railway deployment logs for details.');
  }
}
module.exports = { deploy, handle };
