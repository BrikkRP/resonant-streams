# Resonant Streams — Twitch Setup Reply Edition

## What the bot does
- Assigns the Live Now role when Discord detects a Twitch streaming activity with an approved title keyword.
- Removes the Live Now role when Discord detects that the stream ends or stops qualifying.
- Optionally logs role changes to `LOG_CHANNEL_ID` (internal logging only).
- Replies directly with the full **Getting the Live Now Role** instructional embed whenever a non-bot member posts a Twitch URL in the configured `CONTENT_CREATION_CHANNEL_ID` channel.
- **Does not post public “someone is live” announcement embeds or ping announcement roles.**

## Replace the GitHub repository
Extract the ZIP and upload its **contents**, not the ZIP or a nested directory, to the root of your existing `resonant-streams` GitHub repository. Replace matching files, including the `src` files. **Delete `src/liveAnnouncer.js`** from GitHub because this edition no longer uses it. If your repo has an old `package-lock.json`, delete it as well; this ZIP intentionally does not include a lockfile. Railway will install dependencies from `package.json`.

## Railway variables
Required:
- `DISCORD_TOKEN` — existing bot token (never upload to GitHub)
- `GUILD_ID` — your Discord server ID
- `LIVE_ROLE_ID` — role granted while eligible streaming
- `CONTENT_CREATION_CHANNEL_ID` — channel where users post Twitch links

Optional:
- `LOG_CHANNEL_ID` — internal bot logging channel
- `CLIENT_ID` — preserved for compatibility
- `KEYWORDS=ResonantRP,Resonant RP,Resonant Roleplay`

`LIVE_ANNOUNCE_CHANNEL_ID` and `LIVE_PING_ROLE_ID` are not used and can be removed from Railway.

## Discord settings
In Discord Developer Portal > Bot > Privileged Gateway Intents, enable **Presence Intent**, **Server Members Intent**, and **Message Content Intent**.

Bot needs View Channel, Send Messages, Embed Links, Read Message History in the content creation channel, plus Manage Roles and a highest role above the Live Now role.

## Test
Post `https://www.twitch.tv/example` as a regular member in the configured content creation channel. The bot should **reply to that message** with the full guide, not post a live announcement. The bot ignores bot-authored messages and messages in other channels.

Live role assignment still depends on Discord-visible Twitch streaming activity and an approved stream title, not merely posting a Twitch URL. Streamer Mode alone is not sufficient for Discord presence detection.
