module.exports = async (client, message, newMsg) => {
    if (newMsg.data && newMsg.data.content && newMsg.type === "MessageUpdate") {
        const testCmd = client.commands.get(newMsg.data.content.slice(client.config.misc.prefix.length)) || client.aliases.get(newMsg.data.content.slice(client.config.misc.prefix.length));
        if (!testCmd || testCmd.config.name === "ping") return;
        client.emit("message", message)
    }
} 