const Thread = require('../../models/thread');
const Embed = require("../../functions/embed")
const fetchTime = require("../../functions/fetchTime")

module.exports = {
    config: {
        name: "close",
        description: "Closes a ticket from further use",
        usage: "",
        category: "Modmail",
        cooldown: 5000,
        accessible: "Thread",
        aliases: []
    },
    run: async (client, message, args) => {
        const recipientThread = await Thread.findOne({ channel: message.channel_id, closed: false });

        const error = new Embed()
            .setColor("#1F9E96")
            .setDescription(`${client.config.emojis.redTick} There's no concurring thread in this channel!`)
        if (!recipientThread) return message.reply({ embeds: [error] })

        const embed = new Embed()
            .setColor("#1F9E96")
            .setDescription(`### **Ticket Closed**\n\n**Recipient**: <@${recipientThread.recipient}> (${recipientThread.recipient})\n**Operator**: <@${message.author_id}> (${message.author_id})\n**Channel ID**: ${recipientThread.channel}\n**Issue**: ${recipientThread.issue}\n**Timed Lasted**: ${fetchTime(Date.now() - recipientThread.timestamp)}\n**Thread ID**: ${recipientThread.id}`)
 
        const closed = new Embed()
            .setColor("#1F9E96")
            .setDescription("### **Ticket Closed!**\n\nYour ticket has been closed from further use, if you got any other issues don't be afraid to DM us again!\n\nCheers,\n**Support Team**")
            .setColor("#1F9E96")

        await client.users.get(recipientThread.recipient).openDM().then(d => d.sendMessage({ embeds: [closed] }).catch(() => { }))
        client.channels.get(client.config.tickets.log).sendMessage({ embeds: [embed] }).catch(() => { });
        recipientThread.closed = true;
        await recipientThread.save()
        await message.channel.delete()
    },
};
