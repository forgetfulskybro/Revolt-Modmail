module.exports = {
    config: {
        name: "uptime",
        description: "Check bot's uptime",
        usage: "",
        category: "General",
        cooldown: 5000,
        accessible: "All",
        aliases: []
    },
    run: async (client, message, args) => {
        const unixstamp = Math.floor((Date.now() / 1000) | 0) - Math.floor(client.websocket.heartbeat._idleStart / 1000);
        message.reply(`**Uptime**: <t:${unixstamp}:R>`)
    },
};
 