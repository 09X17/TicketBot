const { readdirSync } = require('fs');

module.exports = (client) => {
	let events = readdirSync("./Src/Events/").filter(x => x.endsWith(".js")).map(x => x.split(".")[0]);
	events.forEach(file => {
		client.on(file, require(`../../Events/${file}`).bind(null, client));
        console.log(`[ EVENT ] ${file} Loaded...`);


	});
};