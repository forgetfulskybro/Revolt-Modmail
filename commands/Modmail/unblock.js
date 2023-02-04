const Thread = require('../../models/thread');
const Blocks = require("../../models/blocked.js");
const Embed = require("../../functions/embed")

module.exports = {
    config: {
        name: "unblock",
        description: "Unblocks users from the ticket system",
        usage: "[UserID]",
        category: "Modmail",
        cooldown: 5000,
        accessible: "All",
        aliases: []
    },
    run: async (client, message, args) => {
        if (message.channel.channel_type !== "TextChannel") return message.reply({ content: `${client.config.emojis.redTick} You have to be in the server to run this command!` })
        if (!args[0]) return message.reply(`${client.config.emojis.redTick} Provide a user's ID to unblock them!`)

        const block = await Blocks.findOne({ block: args[0] });
        if (!block) return message.reply({ content: "This user is either already unblocked or doesn't exist!" })

        block.delete()
        const blocked = new Embed()
            .setColor("#1F9E96")
            .setDescription(`### **User Unblocked**\n\n**User**: <@${args[0]}> (${args[0]})\n**Support**: <@${message.author_id}> (${message.author_id})`)

        client.channels.get(client.config.tickets.blocks).sendMessage({ embeds: [blocked] })
        message.reply(`${client.config.emojis.greenTick} Successfully unblocked this user from the ticket system!`);
    },
};
 