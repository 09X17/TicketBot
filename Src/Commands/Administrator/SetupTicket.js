const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
  name: "tickets",
  description: "",
  aliases: [],
  usage: "",
  userpermissions: [],
  botpermissions: [],
  guildOnly: true,
  cooldown: 0,
  category: ["Administrator"],
  devOnly: false,
  async execute(client, message, args) {

   const x = `**__Tickets System__**`
   const x1 = `Depending on the service you require use corresponding menu`
   const x2 = `🎫 **Support** \`Information, Help\``

   const embed = new MessageEmbed()
   .setTitle(x)
   .setDescription(x1)
   .setColor("RANDOM")
   .addField(`\u200B`, `${x2}`)
   .setFooter(`Tickets created by 09X18`, message.guild.iconURL({ dynamic: true}))
   .setTimestamp()

    const row = new MessageActionRow()
    .addComponents(new MessageSelectMenu() 
    .setCustomId("tickets")
    .setPlaceholder("Ticket Panel")
    .addOptions([{
            label: "Ticket Support",
            description: "General Help",
            value: "tk1",
            emoji: "🎫"
 
        },
        ])
    )
    const msg = await message.channel.send({
        embeds: [embed],
        components: [row]
      })

  },
};