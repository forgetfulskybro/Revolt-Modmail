const Thread = require('../../models/thread');
const Snippet = require('../../models/snippet');
const Embed = require("../../functions/embed")

module.exports = {
    config: {
        name: "snippets",
        description: "Add, delete, view snippets for Modmail",
        usage: "-add [SnippetName] [SnippetDescription] | -remove [SnippetName] | -view",
        category: "Modmail",
        cooldown: 5000,
        accessible: "Thread",
        aliases: ['snip']
    },
    run: async (client, message, args) => {
        let type = args[0];
        let name = args[1];
        let desc = args.slice(2).join(" ");
        const error = new Embed()
            .setColor("#1F9E96")
            .setDescription(`${client.config.emojis.redTick} Provide what you want to do!\n**Examples**: ${client.config.misc.prefix}snippets -add [SnippetName] [SnippetDescription] | -remove [SnippetName] | -view`)
        if (!type) return message.reply({ embeds: [error] })

        if (type === "-add") {
            if (!name) return message.reply({ content: `${client.config.emojis.redTick} Provide a snippet name when creating a snippet!` })
            if (!args[2]) return message.reply({ content: `${client.config.emojis.redTick} Provide a snippet description when creating a snippet!` })
            const snipp = await Snippet.findOne({ keyword: name })
            if (snipp) return message.reply({ content: `${client.config.emojis.redTick} A snippet with name \`${name}\` already exists!` })

            message.reply(`${client.config.emojis.greenTick} Successfully created snippet \`${name}\``)
            return await (new Snippet({
                keyword: name,
                content: desc
            }).save());
        } else if (type === "-remove") {
            if (!name) return message.reply({ content: `${client.config.emojis.redTick} Provide a snippet name when creating a snippet!` })
            const snipp = await Snippet.findOneAndDelete({ keyword: name })
            if (!snipp) return message.reply({ content: `${client.config.emojis.redTick} Snippet \`${name}\` doesn't exist to delete!` })
            return message.reply({ content: `${client.config.emojis.greenTick} Successfully deleted snippet \`${name}\`` })
        } else if (type === "-view") {
            let text = "";
            const snipp = await Snippet.find();
            if (snipp.length === 0) return message.reply({ content: `${client.config.emojis.redTick} There's currently no snippets to be displayed! You can create some by using \`${client.config.misc.prefix}snippets -add [SnippetName] [SnippetDescription]\`` })
            for (let snip of snipp) {
                text += `Name: ${snip.keyword}\nContent:\n${snip.content}\n\n`
            }
            return message.reply({ content: "### **Viewing Snippets**", attachments: [await client.Uploader.upload(Buffer.from(text), `Saved_Snippets.txt`)] });
        }
    },
};
 