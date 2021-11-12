const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");
module.exports = {
    config: {
        name: 'ticket-panel',
        description: 'Ticket Panel menu',
    },
    run: async (client, interaction, args) => {
        if(!interaction.member.permissions.has("MANAGE_GUILD")) {
            const embed = new MessageEmbed()
        .setDescription(
          `:x: **|** You dont have permissions for this \`MANAGE_GUILD\``
        )
        .setColor("RED");
    return interaction.reply({ embeds: [embed] });
        }
        const x = `**__Tickets System__**`
        const x1 = `Depending on the service you require use corresponding menu`
        const x2 = `🎫 **Support** \`Information, Help\``

        const embed = new MessageEmbed()
        .setTitle(x)
        .setDescription(x1)
        .setColor("RANDOM")
        .addField(`\u200B`, `${x2}`)
        .setFooter(`Tickets created by 09X18`, interaction.guild.iconURL({ dynamic: true}))
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
      
             }])
         )
         interaction.reply({
             embeds: [embed],
             components: [row]
           })
       
    }
}