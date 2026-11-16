const config = require('./config');
let token = null, expires = 0;
async function request(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
  const body = await response.text();
  let data; try { data = JSON.parse(body); } catch { data = {}; }
  if (!response.ok) throw new Error(`Kick API ${response.status}: ${body.slice(0, 240)}`);
  return data;
}
async function getToken() {
  if (!config.kickClientId || !config.kickClientSecret) throw new Error('Missing KICK_CLIENT_ID or KICK_CLIENT_SECRET');
  if (token && Date.now() < expires - 60000) return token;
  const params = new URLSearchParams({ grant_type: 'client_credentials', client_id: config.kickClientId, client_secret: config.kickClientSecret });
  const result = await request('https://id.kick.com/oauth/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params });
  if (!result.access_token) throw new Error('Kick OAuth did not return an access token');
  token = result.access_token;
  expires = Date.now() + (Number(result.expires_in) || 3600) * 1000;
  return token;
}
async function api(path) {
  const access = await getToken();
  return request(`https://api.kick.com${path}`, { headers: { Authorization: `Bearer ${access}`, Accept: 'application/json' } });
}
async function findChannel(username) {
  const response = await api(`/public/v1/channels?slug=${encodeURIComponent(username)}`);
  const channels = Array.isArray(response.data) ? response.data : [];
  const channel = channels.find(c => String(c.slug || '').toLowerCase() === username.toLowerCase());
  if (!channel || !channel.broadcaster_user_id) return null;
  return { username: channel.slug, broadcasterId: String(channel.broadcaster_user_id) };
}
async function getLiveStreams(ids) {
  const result = new Map();
  for (let i = 0; i < ids.length; i += 40) {
    const params = new URLSearchParams();
    for (const id of ids.slice(i, i + 40)) params.append('broadcaster_user_id', id);
    const response = await api(`/public/v1/users/livestreams?${params}`);
    if (!Array.isArray(response.data)) throw new Error('Unexpected Kick livestream response');
    for (const stream of response.data) {
      const id = String(stream.broadcaster_user_id ?? stream.user_id ?? stream.user?.id ?? '');
      if (id) result.set(id, { title: String(stream.stream_title ?? stream.title ?? '') });
    }
  }
  return result;
}
module.exports = { findChannel, getLiveStreams };
