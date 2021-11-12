const { OWNERS, DEVELOPER, PREFIX } = require("../Config/Config.json");
const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  Collection,
} = require("discord.js");

module.exports = async (client, message) => {
  const mentionRegex1 = message.content.match(
    new RegExp(`^<@!?(${client.user.id})>`, "gi")
  );
  if (mentionRegex1) {
    prefix = `${mentionRegex1[0]}`;
  } else {
    prefix = PREFIX;
  }

  if (
    !message.content.toLocaleLowerCase().startsWith(prefix) ||
    message.author.bot ||
    message.channel.type === "DM" || 
    !message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES") ||
    !message.guild.available ||
    !message.channel .permissionsFor(message.channel.guild.me).has("VIEW_CHANNEL"))
    return;

  if (
    !message.channel.permissionsFor(message.channel.guild.me).has("EMBED_LINKS")
  ) {
    return message.channel.send({
      content: `${client.emotes.wrong} **|** I dont have permission for this command \`EMBED_LINKS\``,
    });
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;
  if (command.guildOnly && message.channel.type === "DM") return;

  if (command.disabled == true) {
    if (DEVELOPER.includes(message.author.id)) {
    } else {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setDescription(
              `:x: **|** This command is now mode maintenance`
            )
            .setColor("RED"),
        ],
      });
    }
  }

  const validPermissions = [
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "USE_APPLICATION_COMMANDS",
    "MANAGE_EMOJIS_ADN_STICKERS",
    "USE_PUBLIC_THREADS",
    "USE_PRIVATE_TREADS",
    "MANAGE_THREADS",
  ];
  if (command.userpermissions.length) {
    let invalidPerms = [];
    for (const perm of command.userpermissions) {
      if (!validPermissions.includes(perm)) {
        return;
      }
      if (!message.member.permissions.has(perm)) {
        invalidPerms.push(perm);
      }
    }
    if (invalidPerms.length) {
      const embed = new MessageEmbed()
        .setDescription(
          `:x: **|** You dont have permissions for this \`${invalidPerms}\``
        )
        .setColor("RED");
      return message.channel.send({ embeds: [embed] });
    }
  }
  const { cooldowns } = client;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    if (DEVELOPER.includes(message.author.id)) {
    } else {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;

        message.channel.send({
          content: `> :x: **|** Please wait \`${timeLeft.toFixed(
            1
          )}\` \n> More seconds before using \`${command.name}\``,
        });
        return;
      }
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  if (command.devOnly == true) {
    if (DEVELOPER.includes(message.author.id)) {
    } else {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setDescription(
              `:x: **|** This command is now only used by developers`
            )
            .setColor("RED"),
        ],
      });
    }
  }

  command.execute(client, message, args, prefix).catch((e) => {
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setDescription(
            `:x: **|** **Error:** \n\`\`\`js\n${e}\n\`\`\``
          )
          .setColor("RED"),
      ],
    });
  });
};
