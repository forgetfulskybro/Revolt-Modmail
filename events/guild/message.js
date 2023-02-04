const Embed = require("../../functions/embed")
const Threading = require("../../functions/threading");
const Members = require("../../functions/members");
module.exports = async (client, message) => {
    if (!message) return;
    if (message.author.bot) return;
    let args = message.content.slice(client.config.misc.prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    if (message.content && (new RegExp(`^(<@!?${client.config.misc.botID}>)`)).test(message.content)) return message.channel.sendMessage({
        content: `${client.config.emojis.greenTick} My current prefix is \`${client.config.misc.prefix}\``
    }).then(msg => setTimeout(() => msg.delete(), 7500));

    let commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (commandfile) {
        if (!message.content.startsWith(client.config.misc.prefix)) return;
        if (message.channel.channel_type === "DirectMessage" && commandfile.config.accessible === 'Thread') {
            const embed = new Embed()
                .setColor("#1F9E96")
                .setDescription(`${client.config.emojis.redTick} Thread commands can only be used within the main server!`)
            return message.reply({ embeds: [embed] })
        } else if (message.channel.channel_type === "TextChannel" && commandfile.config.accessible === 'Thread') {
            if (!message.member.roles.includes(client.config.roles.support)) {
                const embed = new Embed()
                    .setColor("#1F9E96")
                    .setDescription(`${client.config.emojis.redTick} You have to be apart of the Support Team to use this!`)
                return message.reply({ embeds: [embed] })
            }
        } else if (commandfile.config.category === 'Management') {
            const members = await Members(client, client.config.tickets.mainGuild)
            if (!members.members.find(u => u._id.user === message.author_id).roles.includes(client.config.roles.management)) {
                const embed = new Embed()
                    .setColor("#1F9E96")
                    .setDescription(`${client.config.emojis.redTick} You have to be apart of the Management Team to use this command!`)
                return message.reply({ embeds: [embed] })
            }
        }

        const Duration = require("humanize-duration");
        const used = client.used.get(message.author_id + "-" + cmd.toLowerCase())
        if (used) {
            const uremaining = Duration(used - Date.now(), {
                units: ['m', 's'],
                round: true
            });

            const embed = new Embed()
                .setColor("#1F9E96")
                .setDescription(`<@${message.author_id}>, wait \`${uremaining}\` before using \`${cmd.toLowerCase()}\` again.`)

            return message.reply({ embeds: [embed] }).catch(() => { return })
        } else {
            let cooldown = commandfile.config.cooldown;
            client.used.set(message.author_id + "-" + cmd.toLowerCase(), Date.now() + cooldown)
            setTimeout(() => client.used.delete(message.author_id + "-" + cmd.toLowerCase()), cooldown)

            return commandfile.run(client, message, message.content.slice(client.config.misc.prefix.length).slice(cmd.length).trim().split(/ +/g));
        };
    } else {
        Threading.message(client, message);
    }
} 