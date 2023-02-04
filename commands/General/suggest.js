const Embed = require("../../functions/embed")

module.exports = {
    config: {
        name: "suggest",
        description: "Suggest something to be added to the server",
        usage: "[Suggestion]",
        category: "General",
        cooldown: 120000,
        accessible: "All",
        aliases: []
    },
    run: async (client, message, args) => {
        if (!args[0]) return message.reply(`${client.config.emojis.redTick} Provide text to suggest something toward the server!`)
        if (args.join(" ").length > 1960) return message.reply(`${client.config.emojis.redTick} Provide less than 1,960 characters in your suggestion!`)

        const channel = client.channels.get(client.config.misc.suggests);
        const embed = new Embed()
            .setColor(`#1F9E96`) 
            .setTitle(message.author.username)
            .setIcon(message.author.avatar._id ? `https://autumn.revolt.chat/avatars/${message.author.avatar._id}/${message.author.avatar.filename}` : `https://api.revolt.chat/users/${message.author._id}/default_avatar`)
            .setDescription(`### Suggestion\n\`\`\`txt\n${args.join(" ")}\n\`\`\`\n###### UserID: ${message.author._id}`)
    
        const msg = await channel.sendMessage({ embeds: [embed] });
        await msg.react(encodeURI(client.config.emojis.greenTick)).catch(() => { })
        await msg.react(encodeURI(client.config.emojis.redTick)).catch(() => { })
        message.reply(`${client.config.emojis.greenTick} Successfully sent suggestion to <#${client.config.misc.suggests}>!`)
    },
};
