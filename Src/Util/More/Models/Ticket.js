const { Schema, model } = require("mongoose")

const ticket = Schema({
    guildID: String,
    userID: String,
    channelID: String,
    msgID: String,
})

module.exports = model("Tickets", ticket)