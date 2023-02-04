const Thread = require('../../models/thread');
const Embed = require("../../functions/embed")

module.exports = {
    config: {
        name: "admin",
        description: "Only allows Management Team to view current ticket",
        usage: "",
        category: "Management",
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
        if (!message.member.roles.includes(client.config.roles.management)) return message.reply({ content: `${client.config.emojis.redTick} You must be apart of the Management Team to access this command!` })
 
        if (!recipientThread.admin) {
            client.api.put(`/channels/${message.channel._id}/permissions/${client.config.roles.support}`, { "permissions": { "allow": 0, "deny": 1048576 } });
            message.reply({ content: `${client.config.emojis.greenTick} Successfully transferred to only Management view.` })

            await recipientThread.updateOne({ admin: true });
            recipientThread.save();
        } else {
            client.api.put(`/channels/${message.channel._id}/permissions/${client.config.roles.support}`, { "permissions": { "allow": 1048576, "deny": 0 } });
            message.reply({ content: `${client.config.emojis.greenTick} Successfully disabled Management view.` })

            await recipientThread.updateOne({ admin: false });
            recipientThread.save();
        }
    },
};
