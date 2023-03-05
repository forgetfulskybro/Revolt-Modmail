const Thread = require('../../models/thread');
const Embed = require("../../functions/embed")
const fetchTime = require("../../functions/fetchTime")
const Members = require("../../functions/members");

module.exports = {
    config: {
        name: "start",
        description: "Starts a ticket",
        usage: "[Issue]",
        category: "General",
        cooldown: 5000,
        accessible: "All",
        aliases: []
    }, 
    run: async (client, message, args) => {
        const error = new Embed()
            .setColor("#1F9E96")
            .setDescription(`${client.config.emojis.redTick} If you wish to open a ticket, DM me \`${client.config.misc.prefix}start\` and a thread will be opened!`)
        if (message.channel.channel_type !== "DirectMessage") return message.reply({ embeds: [error] })

        const recipientThread = await Thread.findOne({
            recipient: message.author_id,
            closed: false
        });
        
        const embed = new Embed()
            .setColor("#1F9E96")
            .setDescription(`${client.config.emojis.redTick} You already have an ongoing thread. You can't create multiple tickets!`)
        if (recipientThread) return message.reply({ embeds: [embed] })

        const members = await Members(client, client.config.tickets.mainGuild)
        if (members.error) return message.reply(`${client.config.emojis.redTick} ${members.msg}`)
        const error2 = new Embed()
            .setColor("#1F9E96")
            .setDescription(`${client.config.emojis.redTick} Ticket can't be opened as user isn't in the server!`)
        if (!members.members.find(u => u._id.user === message.author._id)) return message.reply({ embeds: [error2] })

        if (!args[0]) return message.reply(`${client.config.emojis.redTick} If you wish to start a ticket, provide an issue with the command.\n**Example**: \`${client.config.misc.prefix}start [Issue]\``)
        
        const infoEmbed = new Embed()
            .setColor("#1F9E96")
            .setDescription(`**${message.author.username}** (ID: ${message.author_id}) has opened a ticket.\nAccount was created ${fetchTime(Date.now() - message.author.createdAt)} ago.\n\n**Issue**: ${args.join(" ")}`)

        const channel = await client.servers.get(client.config.tickets.mainGuild).createChannel({
            name: message.author.username,
            description: `**Recipient**: ${message.author.username} (Click to read more info)\n**ID**: ${message.author_id}\n**Issue**: ${args.join(" ")}\n**Created**: ${fetchTime(Date.now() - message.author.createdAt)}`,
        });

        let cat = [];
        client.api.put(`/channels/${channel._id}/permissions/${client.config.roles.members}`, { "permissions": { "allow": 0, "deny": 1048576 } });
        client.api.put(`/channels/${channel._id}/permissions/${client.config.roles.management}`, { "permissions": { "allow": 1048576, "deny": 0 } });
        client.api.put(`/channels/${channel._id}/permissions/${client.config.roles.support}`, { "permissions": { "allow": 1048576, "deny": 0 } });
        client.servers.get(client.config.tickets.mainGuild).categories.map(d => { if (d.id === client.config.tickets.category) d.channels.push(channel._id); cat.push(d) });
        client.servers.get(client.config.tickets.mainGuild).edit({ categories: cat });
        client.channels.get(channel._id).sendMessage({ embeds: [infoEmbed] });

        var threadID = await Thread.countDocuments();
        threadID += 1;

        await (new Thread({
            id: threadID,
            recipient: message.author_id,
            channel: channel._id,
            guild: channel.server_id,
            issue: args.join(" "),
            timestamp: Date.now()
        }).save());

        const start = new Embed()
            .setColor("#1F9E96")
            .setDescription('A ticket has been started and a support member will get to you soon!\nThanks for your patience \n\n Cheers!\n **Support Team**')
        return message.reply({
            embeds: [start]
        });
    },
};
