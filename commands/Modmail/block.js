const Thread = require('../../models/thread');
const Blocks = require("../../models/blocked");
const Embed = require("../../functions/embed")

module.exports = {
    config: {
        name: "block",
        description: "Blocks users from using tickets",
        usage: "",
        category: "Modmail",
        cooldown: 5000,
        accessible: "Thread",
        aliases: []
    },
    run: async (client, message, args) => {
        const recipientThread = await Thread.findOne({ channel: message.channel_id, closed: false });

        const embed = new Embed()
            .setColor("#1F9E96")
            .setDescription(`${client.config.emojis.redTick} There's no concurring thread in this channel!`)
        if (!recipientThread) return message.reply({ embeds: [embed] })

        const block = await Blocks.findOne({ block: recipientThread.recipient });
        if (block) return message.reply({ content: `${client.config.emojis.redTick} This user is already blocked from using tickets!` })

        const blocking = new Blocks({ block: recipientThread.recipient });
        blocking.save()
 
        const blocked = new Embed()
            .setColor("#1F9E96")
            .setDescription(`### **Thread user blocked**\n\n**Thread User**: <@${recipientThread.recipient}> (${recipientThread.recipient})\n**Thread Operator**: <@${message.author_id}> (${message.author_id})\n**Thread Case**: ${recipientThread.id}\n**Thread User's Issue**: ${recipientThread.issue}`)

        client.channels.get(client.config.tickets.blocks).sendMessage({ embeds: [blocked] })
        message.reply(`${client.config.emojis.greenTick} Successfully blocked the user of this thread from using the ticket system!`)
    },
};
