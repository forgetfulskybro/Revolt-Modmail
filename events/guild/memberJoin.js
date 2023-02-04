const Embed = require('../../functions/embed');
const Members = require('../../functions/members');
const Thread = require("../../models/thread.js");

module.exports = async (client, member) => {
    const recipientThread = await Thread.findOne({ recipient: member.user._id, closed: false });
    if (recipientThread) {
        const embed = new Embed()
            .setTitle("User Joined")
            .setDescription(`${client.config.emojis.greenTick} <@${member.user._id}> has joined the server and the thread can be continued!`)
            .setColor("#1F9E96")

        const channel = client.channels.get(recipientThread.channel);
        channel.sendMessage({ embeds: [embed] })
    }

    const members = await Members(client, client.config.tickets.mainGuild)
    if (members.error) return console.error(members.msg)
    
    const channel = client.channels.get(client.config.misc.joins);
    const embed = new Embed()
        .setColor(`#1F9E96`)
        .setTitle("User Joined")
        .setDescription(`##### — ID: ${member.user._id}\n##### — Created:  <t:${Math.floor(member.user.createdAt / 1000)}:f> (<t:${Math.floor(member.user.createdAt / 1000)}:R>)\n\nWelcome ${member.user.username} to **${client.servers.get(client.config.tickets.mainGuild).name}**!\nYou're member #${members.members.length}`)
    channel.sendMessage({ content: `<@${member.user._id}>`, embeds: [embed] });
};
 