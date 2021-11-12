const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
} = require("discord.js");
const TSchema = require("../Util/More/Models/Ticket");

module.exports = {
  config: {
    name: "close-ticket",
    description: "Close Ticket",
  },
  run: async (client, interaction, args) => {
    if (!interaction.member.permissions.has("MANAGE_GUILD")) {
      const embed = new MessageEmbed()
        .setDescription(
          `:x: **|** You dont have permissions for this \`MANAGE_GUILD\``
        )
        .setColor("RED");
      interaction.reply({ embeds: [embed] });
    }

    const ticketDoc = await TSchema.findOne({
      channelID: interaction.channel.id,
    });

    if (!ticketDoc) {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription(
              `:x: **|** This channel is not a Ticket`
            )
            .setColor("RED"),
        ],
        ephemeral: true,
      });
    } else {
      const embed = new MessageEmbed()
        .setDescription(`Ticket Panel`)
        .setColor("RANDOM");

      const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("main1")
          .setPlaceholder("Select Menu Tickets")
          .addOptions([
            {
              label: "Close Ticket",
              value: "11",
              description: "Close this Ticket",
            },
          ])
      );

      interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true,
      });

      const filter = (interaction) =>
        interaction.user.id === interaction.user.id;
      if (!filter) return;

      const col = interaction.channel.createMessageComponentCollector({
        filter,
        time: 50000,
      });
      const ro = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("main2")
          .setPlaceholder("Select Menu Tickets")
          .addOptions([
            {
              label: "Close Ticket Confirm",
              value: "22",
              description: "Confirm",
            },
            {
              label: "Close Ticket Cancel",
              value: "33",
              description: "Cancel",
            },
          ])
      );

      col.on("collect", async (menu) => {
        await menu.deferUpdate();

        if (menu.values[0] === "11") {
          interaction.editReply({
            embeds: [embed.setDescription(`Confirmation close`)],
            components: [ro],
            ephemeral: true,
          });
        } else if (menu.values[0] === "22") {
          interaction.editReply({
            embeds: [
              embed.setDescription(`This tickek will be deleted in 5 seconds`),
            ],
            components: [],
            ephemeral: true,
          });
          setTimeout(() => interaction.channel.delete(), 5000);
          await ticketDoc.deleteOne();
        } else if (menu.values[0] === "33") {
          interaction.editReply({
            embeds: [embed.setDescription(`Action Canceled`)],
            ephemeral: true,
            components: [],
          });
        }
      });
    }
  },
};
