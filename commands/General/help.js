const Thread = require('../../models/thread');
const Embed = require("../../functions/embed")

module.exports = {
    config: {
        name: "help",
        description: "View all available commands that you can access",
        usage: "[CommandName]",
        category: "General",
        cooldown: 5000,
        accessible: "All",
        aliases: []
    }, 
    run: async (client, message, args) => {
        if (message.channel.channel_type !== "TextChannel") return message.reply({ content: `${client.config.emojis.redTick} You have to be in the server to run this command!` })
        if (args[0] && client.commands.find(c => c.config.name.toLowerCase() === client.aliases.get(args[0].toLowerCase())) || client.commands.find(c => c.config.name.toLowerCase() === args[0].toLowerCase())) {
            const cmd = client.commands.find(c => c.config.name.toLowerCase() === client.aliases.get(args[0].toLowerCase())) || client.commands.find(c => c.config.name.toLowerCase() === args[0].toLowerCase());
            if (cmd.config.category === "Management" && !message.member.roles.includes(client.config.roles.management)) return message.reply({ content: `${client.config.emojis.redTick} That isn't an available command that you have access to!` })
            if (cmd.config.category === "Modmail" && !message.member.roles.includes(client.config.roles.support)) return message.reply({ content: `${client.config.emojis.redTick} That isn't an available command that you have access to!` })

            const embed = new Embed()
                .setDescription(`### **Command Menu**\n\n**Name**: ${cmd.config.name}\n**Description**: ${cmd.config.description}\n**Usage**: ${cmd.config.usage.length > 0 ? `\`${client.config.misc.prefix}${cmd.config.name} ${cmd.config.usage}\`` : `\`${client.config.misc.prefix}${cmd.config.name}\``}\n**Category**: ${cmd.config.category}\n**Accessible**: ${cmd.config.accessible}\n**Cooldown**: ${cmd.config.cooldown / 1000} seconds\n${cmd.config.aliases.length > 0 ? `**Aliases**: ${cmd.config.aliases.join(", ")}` : `**Aliases**: None`}`)
                .setColor("#1F9E96")
            return message.reply({ embeds: [embed] });
        }

        if (message.member.roles.includes(client.config.roles.management)) {
            const embed = new Embed()
                .setDescription(`### **Help Menu**\n\n**General**\n\`\`\`fix\n${client.commands.filter(c => c.config.category === "General").map(c => c.config.name).join(", ")}\n\`\`\`\n**Modmail**\n\`\`\`fix\n${client.commands.filter(c => c.config.category === "Modmail").map(c => c.config.name).join(", ")}\n\`\`\`\n**Management**\n\`\`\`fix\n${client.commands.filter(c => c.config.category === "Management").map(c => c.config.name).join(", ")}\n\`\`\``)
                .setColor("#1F9E96")
            return message.reply({ embeds: [embed] });
        } else if (message.member.roles.includes(client.config.roles.support)) {
            const embed = new Embed()
                .setDescription(`### **Help Menu**\n\n**General**\n\`\`\`fix\n${client.commands.filter(c => c.config.category === "General").map(c => c.config.name).join(", ")}\n\`\`\`\n**Modmail**\n\`\`\`fix\n${client.commands.filter(c => c.config.category === "Modmail").map(c => c.config.name).join(", ")}\n\`\`\``)
                .setColor("#1F9E96")
            return message.reply({ embeds: [embed] });
        } else {
            const embed = new Embed()
                .setDescription(`### **Help Menu**\n\n**General**:\n\`\`\`fix\n${client.commands.filter(c => c.config.category === "General").map(c => c.config.name).join(", ")}\n\`\`\``)
                .setColor("#1F9E96")
            message.reply({ embeds: [embed] });
        }
    },
};