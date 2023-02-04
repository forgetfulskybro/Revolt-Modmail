const Thread = require('../../models/thread');
const Embed = require("../../functions/embed")

module.exports = {
    config: {
        name: "sub",
        description: "Subscribe to a thread to be mentioned on every message",
        usage: "-sub | -unsub | -override",
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

        const error = new Embed()
            .setColor("#1F9E96")
            .setDescription(`${client.config.emojis.redTick} Provide if you want to sub or unsub!\n**Example**: \`${client.config.misc.prefix}sub -sub | -unsub\``)
        const error2 = new Embed()
            .setColor("#1F9E96")
            .setDescription(`${client.config.emojis.redTick} Provide if you want to sub, unsub, or override!\n**Example**: \`${client.config.misc.prefix}sub -sub | -unsub | -override\``)
        if (message.member.roles.includes(client.config.roles.management)) {
            if (!args[0]) return message.reply({ embeds: [error2] })
        } else {
            if (!args[0]) return message.reply({ embeds: [error] })
        }

        if (args[0] === "-sub") {
            if (recipientThread.sub === message.author_id) {
                return message.reply({ content: `${client.config.emojis.redTick} You are already subscribed to this thread!` })
            } else if (recipientThread.sub !== "none") {
                return message.reply({ content: `${client.config.emojis.redTick} Someone else is already subscribed to this thread!` })
            }

            await recipientThread.updateOne({ sub: message.author_id });
            recipientThread.save();

            return message.reply({ content: `${client.config.emojis.greenTick} You've successfully subscribed to this thread!` })
        } else if (args[0] === "-unsub") {
            if (recipientThread.sub !== message.author_id) {
                return message.reply({ content: `${client.config.emojis.redTick} Someone else is subscribed to this thread!` })
            } else if (recipientThread.sub === "none") {
                return message.reply({ content: `${client.config.emojis.redTick} You aren't subscribed to this thread!` })
            }

            await recipientThread.updateOne({ sub: 'none' });
            recipientThread.save();

            return message.reply({ content: `${client.config.emojis.greenTick} You've successfully unsubscribed to this thread!` })
        } else if (args[0] === "-override") {
            if (!message.member.roles.includes(client.config.roles.management)) return message.reply(`${client.config.emojis.redTick} You have to be apart of the Management Team to use this sub-command!`)
            if (recipientThread.sub === "none") {
                return message.reply({ content: `${client.config.emojis.redTick} No one is currently subscribed to override!` })
            } else if (recipientThread.sub === message.author_id) {
                return message.reply({ content: `${client.config.emojis.redTick} You are already subscribed to this thread!` })
            }

            await recipientThread.updateOne({ sub: message.author_id });
            recipientThread.save();

            return message.reply({ content: `${client.config.emojis.greenTick} Successfully overrided subscribed user!` })
        }
    },
};
 