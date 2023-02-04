const Thread = require('../../models/thread.js');
const Embed = require("../../functions/embed")

module.exports = {
    config: {
        name: "id",
        description: "Get ID of thread user",
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

        message.reply(`${client.config.emojis.greenTick} **ID**: ${recipientThread.recipient}`)
    },
};
 