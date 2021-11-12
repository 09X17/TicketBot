const { Client, Collection, MessageEmbed } = require("discord.js");
const Mongo = require("mongoose");
const config = require("./Src/Config/Config.json");

const client = new Client({
  disableMentions: "everyone",
  fetchAllMembers: true,
  retryLimit: 100,
  restRequestTimeout: 30000,
  allowedMentions: { repliedUser: false, parse: ["users"] },
  intents: 32767,
  partials: ["MESSAGE", "CHANNEL", "USER", "GUILD_MEMBER"],
  presence: {
    status: "idle",
    activities: [{ name: "A Ticket Bot", type: "LISTENING" }],
  },
});

client.commands = new Collection();
client.interactions = new Collection();
client.cooldowns = new Collection();

Mongo.connect(config.MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
Mongo.connection.on("connected", () => {
  console.log(`[ MONGO ] Connected`);
});
Mongo.connection.on("disconnected", () => {
  console.log(`[ MONGO ] Disconnected`);
});
Mongo.connection.on("err", (err) => {
  console.log(`[ MONGO ] Error: ${err}`);
});

["Commands", "Events"].forEach((handler) => {
  require(`./Src/Util/Handlers/${handler}`)(client);
});

client.login(config.TOKEN);
