# Resonant Streams — Twitch + Kick

This is a full replacement for the uploaded Resonant Streams source, preserving Twitch presence-based Live role automation and the private Twitch setup-guide button. Kick support adds role-gated registration, periodic Kick API monitoring, and shared Twitch/Kick role handling. No public go-live announcements.

## BEFORE YOU UPLOAD
1. Download a backup of your GitHub repository.
2. Set up a Kick developer application and obtain its **Client ID** and **Client Secret**. Official docs: https://docs.kick.com and https://github.com/KickEngineering/KickDevDocs . Enable two-factor authentication on your Kick account if requested.
3. In Railway, open the **existing** bot service > Variables and add:
   - `KICK_REGISTRATION_ROLE_ID=1196068828057186306`
   - `KICK_CLIENT_ID=<Kick developer application Client ID>`
   - `KICK_CLIENT_SECRET=<Kick developer application Client Secret>`
   - `DATA_DIR=/data`
   - `KICK_POLL_SECONDS=120` (optional)
   Keep all existing variables: `DISCORD_TOKEN`, `CLIENT_ID` (DISCORD application ID, NOT Kick ID), `GUILD_ID`, `LIVE_ROLE_ID`, `LOG_CHANNEL_ID`, `CONTENT_CREATION_CHANNEL_ID`, `KEYWORDS`.
4. In Railway, add a **persistent Volume** mounted at `/data` to this service. Registrations are saved at `/data/kick-registrations.json`. Without a volume, registrations can disappear on redeploy. Keep only **one bot replica**; this JSON store is not suitable for multiple replicas.

## GITHUB MANUAL UPLOAD
1. Extract this ZIP locally. You should see `package.json`, `README.md`, and the `src` folder.
2. In your existing GitHub repo, replace `package.json`, `README.md` and the matching files under `src`. Upload the NEW files `src/kickApi.js`, `src/kickStore.js`, `src/kickCommands.js`, `src/kickMonitor.js`, `src/eligibility.js` too. Do not upload a nested extra `rrp_build` folder. GitHub's website uploader may not overwrite existing files via drag-and-drop: use the pencil icon for each existing file or delete and re-upload files while keeping the same paths. A GitHub Desktop local commit is also fine.
3. Delete unused `src/presenceHandler.js` if present. Do not delete the current `src/contentCreationPanel.js`: replace it with the one here.
4. Commit. Railway should redeploy from GitHub. Check the logs for `Resonant Streams online`, `Kick slash commands registered`, and no API errors.
5. If the project contains an old `package-lock.json` incompatible with package.json, regenerate it via `npm install` and commit it, or delete the old lock file.

## DISCORD COMMANDS
- `/register-kick username:<channel>` — member must have role `1196068828057186306`; validates channel through Kick API; registration activates **immediately**, without staff approval.
- `/kick-status` — check registration and last known eligible live state.
- `/unregister-kick` — remove your registration.
All replies are private. Commands are registered automatically when the bot starts; `CLIENT_ID` and `GUILD_ID` must be correct. This code creates/updates ONLY its four Kick guild commands and does not delete unrelated commands.

## STREAM CHECKS
Every 120 seconds, the bot checks registered Kick broadcasters through the official Kick API. The stream title must contain one of `KEYWORDS`. Twitch activity is checked separately through Discord. The bot adds the existing Live role if EITHER platform qualifies and removes it when NEITHER qualifies. Kick API failures are logged; the bot doesn't intentionally remove roles due to a failed API request. It does not automatically notify a public channel.

## IMPORTANT LIMITATIONS
- Registrations survive restarts only with Railway Volume correctly mounted at `/data`.
- After a full bot restart, the first successful Kick poll restores Kick eligibility; presence changes before that poll can briefly affect role state.
- Kick API response formats/permissions can change; check Railway logs during first live test. No live API test is possible without your Kick credentials.
- If the content creation channel is a Discord forum, the updated handler accepts posts in its child threads as well.

**Security note:** Registration is automatic and checks that the Kick channel exists, but does not prove ownership. Someone with the authorized Discord role could register a Kick channel they do not own. The same Kick broadcaster cannot be registered by two members simultaneously.

## Two private streaming guides
When a Twitch or Kick link is posted in the configured content creation channel (including forum threads), the bot replies with two buttons: blue **Twitch Setup Guide** and green **Kick Setup Guide**. Clicking either displays only that platform’s instructions as an ephemeral Discord message. Existing old guide buttons remain usable and open the Twitch guide.
