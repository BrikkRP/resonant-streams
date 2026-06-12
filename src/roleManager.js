const config = require('./config');

async function addLiveRole(member) {
    if (!member.roles.cache.has(config.liveRoleId)) {
        await member.roles.add(config.liveRoleId);
        return true;
    }

    return false;
}

async function removeLiveRole(member) {
    if (member.roles.cache.has(config.liveRoleId)) {
        await member.roles.remove(config.liveRoleId);
        return true;
    }

    return false;
}

module.exports = {
    addLiveRole,
    removeLiveRole
};
