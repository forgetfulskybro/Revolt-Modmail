const Snippet = require('../../models/snippet');
const Message = require('../../models/message');
const Thread = require('../../models/thread');
const Embed = require("../../functions/embed")
const Members = require("../../functions/members");
module.exports = {
    config: {
        name: "send",
        description: "Sends messages to thread users",
        usage: "<message> | [AttachedImage] | -snip [SnippetName]",
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

        let type;
        let safeImgs;
        let logImgs = "";
        let msg;
        let msgType;
        if (message.member.roles.includes(client.config.roles.management)) {
            type = "Management Team";
        } else if (message.member.roles.includes(client.config.roles.support)) {
            type = "Support Team";
        }

        const members = await Members(client, client.config.tickets.mainGuild)
        if (members.error) return message.reply(`${client.config.emojis.redTick} ${members.msg}`)
        const error = new Embed()
            .setColor("#1F9E96")
            .setDescription(`${client.config.emojis.redTick} Recipient for this thread couldn't be found. They most likely left the server.`)
        if (!members.users.find(u => u._id === recipientThread.recipient)) return message.reply({ embeds: [error] })
        const user = await client.users.get(recipientThread.recipient);

        if (args[0] === '-snip') {
            const snippt = await Snippet.findOne({ keyword: args[1] });
            const embed = new Embed()
                .setColor("#1F9E96")
                .setDescription(`${client.config.emojis.redTick} The provided snippet wasn't found. Check all snippets using \`${client.config.misc.prefix}snippets view\``)
            if (!snippt) return message.reply({ embeds: [embed] })
            msg = snippt.content;
        } else if (message.attachments) {
            msgType = 'attachment';
            msg = "**Attachments**: ";
            safeImgs = "**Attachments**: ";
            for (let att of message.attachments) {
                logImgs += `https://autumn.revolt.chat/attachments/${att._id}/${att.filename} `
                msg += `https://autumn.revolt.chat/attachments/${att._id}/${att.filename}\n`
                safeImgs += `<https://autumn.revolt.chat/attachments/${att._id}/${att.filename}>\n`
            }
        } else {
            msg = args.join(" ");
        }
        const errorTw = new Embed()
            .setColor("#1F9E96")
            .setDescription(`${client.config.emojis.redTick} When sending a message, make sure to either provide a message, snippet or attachment.\n**Examples**: ${client.config.misc.prefix}send <message> | [AttachedImage] | -snip [SnippetName]`)
        if (!msg) return message.reply({ embeds: [errorTw] })

        const messageID = (await Message.countDocuments({
            thread: recipientThread.id
        })) + 1;

        await (new Message({
            thread: recipientThread.id,
            message: messageID,
            recipient: 'Support Operator',
            channel: message.channel_id,
            content: msgType === "attachment" ? "~~No Content~~" : msg,
            author: message.author_id,
            attachments: msgType === "attachment" ? logImgs.split(/ +/g) : [],
            timestamp: Date.now()
        }).save());

        let userChan = new Embed()
            .setColor("#1F9E96")
            .setDescription(`### <@${message.author_id}>\n##### — ${type}\n\n\`\`\`txt\n${msg}\n\`\`\``)

        let attUser = new Embed()
            .setColor("#1F9E96")
            .setDescription(`### <@${message.author_id}>\n##### — ${type}\n\n${msg}`)

        let supportChan = new Embed()
            .setColor("#1F9E96")
            .setDescription(`### <@${message.author_id}>\n##### — ${type}\n##### — ID: ${message.author_id}\n\n\`\`\`txt\n${msg}\n\`\`\``)

        let attSupport = new Embed()
            .setColor("#1F9E96")
            .setDescription(`### <@${message.author_id}>\n##### — ${type}\n##### — ID: ${message.author_id}\n\n${safeImgs}`)

        await message.channel.sendMessage({ embeds: [msgType === "attachment" ? attSupport : supportChan] })
        await user.openDM().then(d => d.sendMessage({ embeds: [msgType === "attachment" ? attUser : userChan] })).catch(() => message.channel.sendMessage(`${client.config.emojis.redTick} User either isn't in the server or turned DMs off! I couldn't DM them your message.`))

    },
};
 