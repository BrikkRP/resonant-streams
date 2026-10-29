# Resonant Streams

Discord.js bot for Resonant Roleplay.

## Features
- Assigns Live Now role when a Discord-visible Twitch streaming activity has a title containing an approved keyword.
- Removes Live Now role when the stream stops or the title no longer qualifies (on a presence update).
- Posts a live announcement and optionally pings a role when the Live Now role is newly assigned.
- Logs role changes.
- **Replies with the setup guide embed every time a non-bot member posts a Twitch URL in the configured content-creation channel.**

## GitHub replacement
Upload the **contents of this ZIP** to the root of your existing `resonant-streams` GitHub repository. Do not upload the ZIP itself or create an extra nested folder. Replace existing files with the same names, and delete the old `package-lock.json` from GitHub (this package intentionally does not include a lockfile). GitHub's browser interface may require editing existing files or deleting them first when replacing them.

## Railway variables
Copy the variable names from `.env.example` into Railway > your service > Variables. **Do not put a real `.env` file or bot token in GitHub.**
Required: DISCORD_TOKEN, GUILD_ID, LIVE_ROLE_ID, CONTENT_CREATION_CHANNEL_ID.
For other features: LOG_CHANNEL_ID, LIVE_ANNOUNCE_CHANNEL_ID, LIVE_PING_ROLE_ID.
KEYWORDS=ResonantRP,Resonant RP,Resonant Roleplay

## Discord setup
Enable **Presence Intent**, **Server Members Intent**, and **Message Content Intent** in Discord Developer Portal > Bot > Privileged Gateway Intents.

Bot permissions: View Channel, Send Messages, Embed Links, Read Message History, Manage Roles. For pinging a non-mentionable role, enable Mention @everyone, @here, and All Roles (or make the target role mentionable). The bot's highest role must be above the Live Now role.

Railway start command: `npm start`. A commit normally triggers a redeploy.

## Test
Post `https://www.twitch.tv/example` as a member in the configured channel. The bot should reply with the guide embed. The bot ignores messages from other bots and other channels.

To test live role assignment, connect Twitch to Discord, make streaming activity visible, and include an approved keyword in the stream title.

## Notes
- The Twitch-link reply triggers for every matching message; there is no cooldown.
- Live role assignment depends on Discord presence, not on the Twitch link itself.
- Streamer Mode is optional for detection; visible Twitch streaming activity is what matters.
- Role reconciliation after bot downtime is not included.
