const fs = require("fs");

module.exports = async (client) => {
  console.log(
    `[ client ] Connected ${client.user.tag} | ${client.guilds.cache.size} Guild | ${client.users.cache.size} Users`
  );

  const Files = fs.readdirSync("./Src/CommandsSlash").filter((file) => file.endsWith(".js"))

  for (const file of Files) {
    const Slash = require(`../CommandsSlash/${file}`);

    let cmd;
    if (Slash.config.options) {
      cmd = {
        name: Slash.config.name,
        description: Slash.config.description,
        options: Slash.config.options
      }

    } else {
       cmd = { 
        name: Slash.config.name,
        description: Slash.config.description,
       }
    }

    try {
        await client.application?.commands.create(cmd)
        client.interactions.set(Slash.config.name, Slash)
        console.log(`[ SLASH ] ${Slash.config.name} Success!`)
      } catch (err) {
        console.log(`[ SLASH ] ${Slash.config.name} Error! ${err.stack}`)
      }

  }
};
