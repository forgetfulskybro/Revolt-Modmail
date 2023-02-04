const Embed = require('../../functions/embed');
const Members = require('../../functions/members');
const Thread = require("../../models/thread.js");

module.exports = async (client, id) => {
    const recipientThread = await Thread.findOne({ recipient: id.user, closed: false });
    if (recipientThread) {
        const embed = new Embed()
            .setTitle("User Left")
            .setDescription(`${client.config.emojis.redTick} <@${id.user}> has left the server and the thread will be paused!`)
            .setColor("#1F9E96")

        const channel = client.channels.get(recipientThread.channel);
        channel.sendMessage({ embeds: [embed] })
    }

    const members = await Members(client, client.config.tickets.mainGuild)
    if (members.error) return console.error(members.msg)
    
    const user = client.users.get(id.user);
    const channel = client.channels.get(client.config.misc.joins);
    const embed = new Embed()
        .setColor(`#1F9E96`)
        .setTitle("User Left")
        .setDescription(`##### — ID: ${id.user}\n##### — Created:  <t:${Math.floor(user.createdAt / 1000)}:f> (<t:${Math.floor(user.createdAt / 1000)}:R>)\n\n${user.username} just left our server!\nMember count: ${members.members.length}`)
    channel.sendMessage({ content: `<@${id.user}>`, embeds: [embed] });
};
 