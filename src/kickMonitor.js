const config = require('./config');
const store = require('./kickStore');
const { getLiveStreams } = require('./kickApi');
const { kickEligible, reconcile } = require('./eligibility');
let running = false;
async function poll(client) {
  if (running || !config.kickClientId || !config.kickClientSecret) return;
  running = true;
  try {
    const guild = await client.guilds.fetch(config.guildId);
    const registrations = store.all().filter(r => r.approved);
    if (!registrations.length) return;
    const streams = await getLiveStreams([...new Set(registrations.map(r => r.broadcasterId))]);
    for (const r of registrations) {
      const stream = streams.get(r.broadcasterId);
      const eligible = Boolean(stream && config.keywords.some(k => stream.title.toLowerCase().includes(k)));
      kickEligible.set(r.discordId, eligible);
      const member = await guild.members.fetch(r.discordId).catch(() => null);
      if (member) await reconcile(member);
    }
  } catch (error) {
    console.error('Kick polling failed; retaining existing role state until next successful check:', error);
  } finally { running = false; }
}
function start(client) {
  if (!config.kickClientId || !config.kickClientSecret) {
    console.warn('Kick monitoring disabled: set KICK_CLIENT_ID and KICK_CLIENT_SECRET.');
    return;
  }
  poll(client);
  setInterval(() => poll(client), config.kickPollMs);
}
module.exports = { start };
