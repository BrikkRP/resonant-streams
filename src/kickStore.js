const fs = require('node:fs');
const path = require('node:path');
const config = require('./config');
const file = path.join(config.dataDir, 'kick-registrations.json');
let records = {};
function load() {
  fs.mkdirSync(config.dataDir, { recursive: true });
  if (fs.existsSync(file)) {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid Kick registration database');
    records = parsed;
  }
}
function all() { return Object.entries(records).map(([discordId, entry]) => ({ discordId, ...entry })); }
function get(id) { return records[id] || null; }
function set(id, value) {
  const updated = { ...records, [id]: value };
  save(updated);
}
function remove(id) {
  const updated = { ...records };
  delete updated[id];
  save(updated);
}
function save(updated) {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(updated, null, 2));
  fs.renameSync(tmp, file);
  records = updated;
}
module.exports = { load, all, get, set, remove };
