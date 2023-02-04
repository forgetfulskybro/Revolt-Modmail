const { Client } = require("revolt.js");
const { Collection } = require('@discordjs/collection')
const { token, mongoDB } = require("./botconfig.json");
const Uploader = require("revolt-uploader"); // Thanks to ShadowLp174 for the cool package.
const client = new Client();
client.Uploader = new Uploader(client);
client.cooldowns = new Map();
client.used = new Map();
client.config = require("./config");

const mongoose = require("mongoose");
mongoose.set('strictQuery', true)
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

["aliases", "commands", "events", "functions"].forEach(x => client[x] = new Collection());
["command", "event", "function"].forEach(x => require(`./handlers/${x}`)(client));

client.loginBot(token); 