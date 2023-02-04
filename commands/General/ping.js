const Embed = require("../../functions/embed");
const Thread = require('../../models/thread.js');

module.exports = {
    config: {
        name: "ping",
        description: "Check bot's ping",
        usage: "",
        category: "General",
        cooldown: 5000,
        accessible: "All",
        aliases: []
    }, 
    run: async (client, message, args) => {
        let beforeCall = Date.now();
        await Thread.findOne();
        let dbPing = Date.now() - beforeCall;

        const embed = new Embed()
            .setColor("#1F9E96")
            .setDescription(`**Ping**: ${client.websocket.ping > 200 ? client.config.emojis.redTick : client.config.emojis.greenTick} ${client.websocket.ping}\n**Database**: ${dbPing > 60 ? client.config.emojis.redTick : client.config.emojis.greenTick} ${dbPing}`)
        message.reply({ embeds: [embed] })
    }
}
