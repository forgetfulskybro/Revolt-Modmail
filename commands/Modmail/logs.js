const Thread = require('../../models/thread');
const Messages = require("../../models/message");
module.exports = {
    config: {
        name: "logs",
        description: "Show logs of specific thread cases",
        usage: "",
        category: "Modmail",
        cooldown: 5000,
        accessible: "Thread",
        aliases: []
    },
    run: async (client, message, args) => {
        const ID = args[0];
        if (!ID) return message.reply({ content: `${client.config.emojis.redTick} Provided a thread ID!` });
        if (isNaN(ID)) return message.reply({ content: `${client.config.emojis.redTick} Provided thread ID was invalid!` });
        const msgs = await Messages.find({ thread: ID });
        if (msgs.length === 0) return message.reply({ content: `${client.config.emojis.redTick} Provided thread ID has no messages to be displayed!` });
        const thread = await Thread.findOne({ id: ID });
        if (!thread) return message.reply({ ephemeral: true, content: `${client.config.emojis.redTick} Provided thread ID doesn't exist!` });
        if (thread && thread.admin && !message.member.roles.includes(client.config.roles.management)) return message.reply({ content: `That thread was locked for only Management Team to view!` })

        const threadRecipient = client.users.get(thread.recipient);

        let out = `=== Thread Details ===
Thread ID: ${thread.id}
Recipient: ${threadRecipient.username} (ID: ${threadRecipient._id})
Issue: ${thread.issue}
Created At: ${new Date(thread.timestamp).toLocaleString()}

=== Messages ===

`;

        for (const m of msgs) {
            const ma = client.users.get(m.author);


            let fetchedContent = `@ ${ma.username} (ID: ${m.author}) ${new Date(m.timestamp).toLocaleString()}
- Content: ${m.content}
`;

            for (const at of m.attachments.filter((item) => item != ' ').filter((item) => item != '')) {
                fetchedContent += `> Attachment: ${at}\n`;
            }

            out += `${fetchedContent}

`;
        }

        message.reply({
            attachments: [await client.Uploader.upload(Buffer.from(out), `ticket_${thread.id}_details.txt`)],
            content: `${client.config.emojis.greenTick} Thread **#${thread.id}** Details:`,
        });
    },
};
 