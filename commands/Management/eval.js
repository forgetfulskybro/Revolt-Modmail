const { inspect } = require('util');
module.exports = {
	config: {
		name: "eval",
		description: "Evaluates code",
		accessible: "All",
		category: "Management",
		usage: `<input>`,
		cooldown: 0,
		aliases: ["e"]
	},
	run: async (client, message, args) => {
		try {
			let codein = args.join(" ");
			if (!args[0]) return message.reply("Send me code.")
			if (codein === 'client.session' || codein === 'client.api.authentication' || codein === 'client.api.authentication.revolt') {
				return message.reply(`\`\`\`js\nundefined`)
			};

			let code = await eval(codein);
			if (typeof code !== 'string') {
				if (code && typeof code.session === 'string') code.session = null;
				code = inspect(code, { depth: 0 });
			} 
			message.reply(`\`\`\`js\n${code}`).catch((e) => {
				message.reply(`\`\`\`js\n${e.message}\n\`\`\``);
			});
		} catch (e) {
			message.reply(`\`\`\`js\n${e ? e.message : "Unknown Error"}`);
		}

	}
}