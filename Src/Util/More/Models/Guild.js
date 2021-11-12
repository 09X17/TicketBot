const { Schema, model } = require("mongoose")

const guild = new Schema({
  guildID: String,
  ticketCount: Number,
})

module.exports = model("Guild", guild)