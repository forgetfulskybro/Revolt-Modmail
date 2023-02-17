module.exports = async (client, message, newMsg) => {
    if (newMsg.data && newMsg.data.content && newMsg.type === "MessageUpdate") {
        const testCmd = client.commands.get(newMsg.data.content.slice(client.config.misc.prefix.length)) || client.aliases.get(newMsg.data.content.slice(client.config.misc.prefix.length));
        if (!testCmd || testCmd.config.name === "ping") return;
        client.emit("message", message)
    } else if (newMsg.type === "MessageReact") {
        const check = client.paginate.get(newMsg.user_id);
        if (!check) return;
        if (check.message !== message._id) return;
        let pages = check.pages;
        let page = check.page;
        switch (newMsg.emoji_id) {
            case "⬅️":
                if (pages[page - 1]) {
                    message.edit({
                        embeds: [pages[--page]]
                    }).catch(() => { });
                    return check.page = check.page - 1
                } else {
                    return;
                }
            case "➡️":
                if (pages[page + 1]) {
                    message.edit({
                        embeds: [pages[++page]]
                    }).catch(() => { });
                    return check.page = check.page + 1
                } else {
                    return;
                }
        }
    }
} 