const Thread = require("../models/thread");
const Message = require("../models/message");
const Blacklist = require("../models/blocked");
const Embed = require("../functions/embed")
let safeImgs;
let logsImgs = "";
// await message.react(encodeURI(client.config.emojis.greenTick)).catch(() => { })
class Threading {
    static async message(client, message) {
        const black = await Blacklist.findOne({ block: message.author_id })
        if (black) return;

        if (message.author.bot) return;
        if (message.channel.channel_type === "DirectMessage") {
            const recipientThread = await Thread.findOne({
                recipient: message.author_id,
                closed: false
            });

            if (!recipientThread) return message.channel.sendMessage(`Hello! If you wish to start a new ticket, please use \`${client.config.misc.prefix}start\`.`).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            })

            this.dm(client, message, recipientThread);
        }
    }

    static async dm(client, message, thread) {
        const channel = client.channels.get(thread.channel);
        if (!channel) message.channel.sendMessage(`${client.config.emojis.redTick} Channel for thread ${thread.id} can not be found.`);

        if (message.attachments) {
            let subb;
            if (thread.sub === 'none') {
                subb = 'Recipient replied.'
            } else {
                subb = `<@${thread.sub}>, the recipient replied.`
            }

            safeImgs = `**Attachments**: `;
            for (let att of message.attachments) {
                logsImgs += `https://autumn.revolt.chat/attachments/${att._id}/${att.filename} `
                safeImgs += `https://autumn.revolt.chat/attachments/${att._id}/${att.filename}\n`
            }
 
            const messageID = (await Message.countDocuments({
                thread: thread.id
            })) + 1;

            await (new Message({
                thread: thread.id,
                message: messageID,
                recipient: message.author.username,
                channel: message.channel_id,
                content: "~~No Content~~",
                author: thread.recipient,
                attachments: logsImgs.split(/ +/g),
                timestamp: Date.now()
            }).save());

            const embed = new Embed()
                .setColor("#1F9E96")
                .setDescription(`### <@${message.author_id}>\n##### — ${subb}\n\n${safeImgs}`)

            channel.sendMessage({
                embeds: [embed],
            })
        }

        if (!message.content) return;
        let subb;
        if (thread.sub === 'none') {
            subb = 'Recipient replied.'
        } else {
            subb = `<@${thread.sub}>, the recipient replied.`
        }

        const messageID = (await Message.countDocuments({
            thread: thread.id
        })) + 1;

        await (new Message({
            thread: thread.id,
            message: messageID,
            recipient: message.author.username,
            channel: message.channel_id,
            content: message.content,
            author: thread.recipient,
            attachments: [],
            timestamp: Date.now()
        }).save());

        const embed = new Embed()
            .setColor("#1F9E96")
            .setDescription(`### <@${message.author_id}>\n##### — ${subb}\n\n\`\`\`txt\n${message.content}\n\`\`\``)

        channel.sendMessage({
            embeds: [embed],
        })
    }
}

module.exports = Threading;