const Embed = require("../../functions/embed")
const Paginator = require("../../functions/pagination")

module.exports = {
    config: {
        name: "test",
        description: "hi",
        usage: "",
        category: "",
        cooldown: 0,
        accessible: "",
        aliases: []
    },
    run: async (client, message, args) => {
        const embed = new Embed()
            .setTitle("Test")
            .setDescription("hi")

            const embed2 = new Embed()
            .setTitle("Yo")
            .setDescription("2")
        
            const embed3 = new Embed()
            .setTitle("Yo")
            .setDescription("3")
        
            const embed4 = new Embed()
            .setTitle("Yo")
            .setDescription("4")

        await new Paginator({ timeout: 5 * 2e4, user: message.author._id, client: client })
            .add([embed, embed2, embed3, embed4])
            .start(message.channel);
    },
};
