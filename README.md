# Resonant Streams — Private Button Guide

When a member posts a Twitch URL in the configured content creation text channel, the bot replies publicly with a **How to Get the Live Now Role** button. Clicking the button shows the full setup guide **ephemerally**, visible only to the clicker. The guide itself is not posted publicly.

The bot also assigns/removes the Live Now role for eligible Twitch streaming presence and keeps internal logging. It does not post automatic public go-live announcements.

## Install via GitHub
Extract the ZIP and replace the matching files in the **root** of the existing repository, keeping the `src` folder. Do not upload the ZIP itself. If the previous repository contains `src/liveAnnouncer.js`, delete that unused file. If it contains an old `package-lock.json` incompatible with this `package.json`, delete it (or regenerate it with npm install locally). Commit and allow Railway to redeploy.

## Railway
Keep your existing bot token, server/role/log IDs and `KEYWORDS=ResonantRP,Resonant RP,Resonant Roleplay`. Set `CONTENT_CREATION_CHANNEL_ID` to the numeric ID of the channel where users share Twitch links. No new Railway variables are needed for the button.

## Discord
In Discord Developer Portal → Bot → Privileged Gateway Intents, enable **Message Content Intent**, **Presence Intent**, and **Server Members Intent**. The bot needs View Channel, Send Messages, Embed Links, and Read Message History in the configured channel; Manage Roles for the Live Now role. Its highest role must be above the Live Now role.

## Test
Post `https://www.twitch.tv/example` as a human member in the configured text channel. The bot should reply with a button. Click the button to see the private guide. Other members can click the same button to see their own private copy. Buttons remain functional across bot restarts because the interaction handler uses a stable custom ID.

The bot responds to Twitch URLs in the configured channel, but cannot verify that the posted Twitch account belongs to the posting member. A forum post/thread has a different channel ID and requires additional code if you want to support forum channels.
