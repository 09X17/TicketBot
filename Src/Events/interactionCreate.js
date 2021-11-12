const {
  MessageEmbed,
  MessageAttachment,
  MessageButton,
  MessageActionRow,
} = require("discord.js");
const TSchema = require("../Util/More/Models/Ticket");
const MSchema = require("../Util/More/Models/Guild");
const { GUILDID, CHTICKET, PARENTID } = require("../Config/Config.json");

module.exports = async (client, interaction) => {
  if (interaction.isCommand()) {
    const args = [];
    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    if (!client.interactions.has(interaction.commandName)) return;
    client.interactions
      .get(interaction.commandName)
      .run(client, interaction, args)
      .catch((e) => {
        interaction.reply({ content: `Error ocurred` });
        console.log(e.stack)                                                                             
      });
  }

  let guildDoc = await MSchema.findOne({
    guildID: interaction.guild.id,
  });

  if (!guildDoc) {
    guildDoc = new MSchema({
      guildID: interaction.guild.id,
      ticketCount: 0,
    });

    await guildDoc.save();
  }
  if (interaction.guild.id === GUILDID) {
    if (interaction.channel.id === CHTICKET) {
      if (interaction.isSelectMenu() && interaction.customId === "tickets") {
        if (interaction.values[0] === "tk1") {
            const ticketDoc = await TSchema.findOne({
                guildID: interaction.guild.id,
                userID: interaction.user.id,
            });

    if (ticketDoc) {
      const channel = interaction.guild.channels.cache.get(ticketDoc.channelID);
            if (channel) {
              interaction.reply({
                  embeds: [ new MessageEmbed()
                      .setDescription(`__Error__ You already have an open ticket`)
                      .setColor("RANDOM")],
                  ephemeral: true
                })
               
            } else {
              await ticketDoc.deleteOne();
              guildDoc.ticketCount += 1;
              await guildDoc.save();
              let everyone = interaction.guild.roles.cache.find((m) => m.name == "@everyone");
              const ticketChannel = await interaction.guild.channels.create(`🎫・support・${guildDoc.ticketCount}`, {
                  type: "text",
                  parent: PARENTID,
                  permissionOverwrites: [{
                      id: everyone.id, deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS"]  },
                    { id: interaction.user.id,  allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES"], deny: ["ADD_REACTIONS"] }]});

              interaction.reply({ embeds: [new MessageEmbed()
                  .setDescription(`__Success__ Your ticket was opened in the channel ${ticketChannel} \`${guildDoc.ticketCount}\``)
                  .setColor("RANDOM")],
              ephemeral: true })

              const msg = await ticketChannel.send({ content: `${interaction.user} __Private Ticket__ \`${guildDoc.ticketCount}\``
            })
              const tickDoc = new TSchema({
                guildID: interaction.guild.id,
                userID: interaction.user.id,
                channelID: ticketChannel.id,
                msgID: msg.id,
              });
              await tickDoc.save();
            }

          } else {
            guildDoc.ticketCount += 1;
            await guildDoc.save();
            let everyone = interaction.guild.roles.cache.find((m) => m.name == "@everyone");
            const ticketChannel = await interaction.guild.channels.create(`🎫・support・${guildDoc.ticketCount}`, {
                type: "text",
                parent: PARENTID,
                permissionOverwrites: [{
                    id: everyone.id, deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS"]  },
                  { id: interaction.user.id,  allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES"], deny: ["ADD_REACTIONS"] }]});

            interaction.reply({ embeds: [new MessageEmbed()
                .setDescription(`__Success__ Your ticket was opened in the channel ${ticketChannel} \`${guildDoc.ticketCount}\``)
                .setColor("RANDOM")],
            ephemeral: true })

            const msg = await ticketChannel.send({ content: `${interaction.user} __Private Ticket__ \`${guildDoc.ticketCount}\``
          })

            const tickDoc = new TSchema({
              guildID: interaction.guild.id,
              userID: interaction.user.id,
              channelID: ticketChannel.id,
              msgID: msg.id,
            });
            await tickDoc.save();
          }
        } 
         
      } 
       
    } else {
      return null;
    
    }
  } else {
    return null;
   
  }


}
