const Thread = require('../../models/thread');
const Embed = require("../../functions/embed")
const fetchTime = require("../../functions/fetchTime")
const Members = require("../../functions/members");

module.exports = {
    config: {
        name: "ticket",
        description: "Create a ticket for support to get in contact with a user",
        usage: "[UserID]",
        category: "Modmail",
        cooldown: 5000,
        accessible: "Thread",
        aliases: []
    },
    run: async (client, message, args) => {
        if (!args[0]) return message.reply(`${client.config.emojis.redTick} Provide a user's ID to open a ticket!`)
        const dm = client.users.get(args[0])
        if (!dm) return message.reply(`${client.config.emojis.redTick} Provided user ID wasn't a valid ID!`)
        const haveThread = await Thread.findOne({ recipient: dm._id, closed: false });
        if (haveThread) return message.reply({ content: `${client.config.emojis.redTick} A thread is already ongoing in <#${haveThread.channel}>.` });

        const members = await Members(client, client.config.tickets.mainGuild)
        if (members.error) return message.reply(`${client.config.emojis.redTick} ${members.msg}`)
        const error = new Embed()
            .setColor("#1F9E96")
            .setDescription(`${client.config.emojis.redTick} Ticket can't be opened as user isn't in this server!`)
        if (!members.members.find(u => u._id.user === dm._id)) return message.reply({ embeds: [error] })

        const issueEmbed = new Embed()
            .setDescription("### **Ticket Opened!**\n\nHello, the support team has reached out to you. Any message you send in this DM will be forwarded to them. Please wait while we get messages ready to be sent, thanks for the patience!\n\n Cheers,\n**Support Team")
            .setColor("#1F9E96")

        try {
            await dm.openDM().then(d => d.sendMessage({ embeds: [issueEmbed] }))
        } catch {
            return message.channel.sendMessage(`${client.config.emojis.redTick} Ticket can't be opened as user may not be in the server or they have DMs off!`)
        }

        const channel = await client.servers.get(client.config.tickets.mainGuild).createChannel({
            name: dm.username,
            description: `**Recipient**: ${message.author.username} (Click to read more info)\n**ID**: ${message.author_id}\n**Issue**: ${args.join(" ")}\n**Created**: ${fetchTime(Date.now() - message.author.createdAt)}`,
        });

        let cat = [];
        client.api.put(`/channels/${channel._id}/permissions/${client.config.roles.members}`, { "permissions": { "allow": 0, "deny": 1048576 } });
        client.api.put(`/channels/${channel._id}/permissions/${client.config.roles.management}`, { "permissions": { "allow": 1048576, "deny": 0 } });
        client.api.put(`/channels/${channel._id}/permissions/${client.config.roles.support}`, { "permissions": { "allow": 1048576, "deny": 0 } });
        message.channel.server.categories.map(d => { if (d.id === client.config.tickets.category) d.channels.push(channel._id); cat.push(d) });
        message.channel.server.edit({ categories: cat });

        const infoEmbed = new Embed()
            .setColor("#1F9E96")
            .setDescription(`Support Team (<@${message.author_id}>) has opened a ticket with <@${dm._id}>\nAccount was created ${fetchTime(Date.now() - dm.createdAt)} ago.`)
        client.channels.get(channel._id).sendMessage({ embeds: [infoEmbed] });

        var threadID = await Thread.countDocuments();
        threadID += 1;

        await (new Thread({
            id: threadID,
            recipient: dm._id,
            channel: channel._id,
            guild: channel.server_id,
            issue: `Support Team (Operator: ${message.author._id}) opened this ticket.`,
            timestamp: Date.now()
        }).save());

        message.reply(`${client.config.emojis.greenTick} The ticket has been created: <#${channel._id}>`);
    },
};
 