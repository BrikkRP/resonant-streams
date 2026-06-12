const { ActivityType } = require('discord.js');

const config = require('./config');
const { addLiveRole, removeLiveRole } = require('./roleManager');
const { sendLog } = require('./logger');
const { sendLiveAnnouncement } = require('./liveAnnouncer');

async function handlePresenceUpdate(
    oldPresence,
    newPresence
) {

    try {

        const member = newPresence?.member;

        if (!member || member.user.bot) {
            return;
        }

        const oldStreaming =
            oldPresence?.activities?.find(
                activity =>
                    activity.type === ActivityType.Streaming
            );

        const newStreaming =
            newPresence?.activities?.find(
                activity =>
                    activity.type === ActivityType.Streaming
            );

        if (oldStreaming && !newStreaming) {

            const removed =
                await removeLiveRole(member);

            if (removed) {

                await sendLog(
                    member.guild,
                    '🔴 Stream Ended',
                    'Live Now role removed.',
                    member
                );

            }

            return;
        }

        if (!newStreaming) {
            return;
        }

        const streamTitle =
            (newStreaming.details || '')
                .toLowerCase();

        console.log(
            `${member.user.tag} is streaming: ${newStreaming.details}`
        );

        const keywordMatch =
            config.keywords.some(
                keyword =>
                    streamTitle.includes(keyword)
            );

        if (!keywordMatch) {

            const removed =
                await removeLiveRole(member);

            if (removed) {

                await sendLog(
                    member.guild,
                    '⚠️ Stream Title No Longer Matches',
                    'Live Now role removed because the stream title does not contain an approved keyword.',
                    member
                );

            }

            return;
        }

        const added =
            await addLiveRole(member);

        if (added) {

            await sendLog(
                member.guild,
                '🟢 Stream Detected',
                `Live Now role added.\n\n**Title:** ${newStreaming.details}`,
                member
            );

            await sendLiveAnnouncement(
                member,
                newStreaming
            );

        }

    } catch (error) {

        console.error(
            'Presence Handler Error:',
            error
        );

    }

}

module.exports =
    handlePresenceUpdate;
