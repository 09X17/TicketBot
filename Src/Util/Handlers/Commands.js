const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Commands");
table.setHeading("Command", "Status", "Dir", "Ping");

module.exports = async (client) => {

    readdirSync("./Src/Commands").forEach((dir) => {
      const commands = readdirSync(`./Src/Commands/${dir}/`).filter((file) =>
        file.endsWith(".js")
      );

      for (let file of commands) {
        let pull = require(`../../Commands/${dir}/${file}`);
        if (pull.name) {
          client.commands.set(pull.name, pull);
          table.addRow(file, "✅ Succes!", dir, Date.now() );
        } else {
          table.addRow(file, `❌ Error!`, dir,  Date.now() );
          continue;
        }
      }
    });
   console.log(table.toString())
    
  };