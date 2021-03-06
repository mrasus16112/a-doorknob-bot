const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// load command files
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.data.name, command);
}
client.once('ready', () => {
	console.log('Ready!');
	client.user.setStatus('idle');
	const express = require('express');
	const app = express();
	const port = 443;

	app.get('/', (req, res) => {
  	res.send('there is actually nothing here');
	});

	app.listen(port, () => {
		console.log(`Server ready!`);	client.user.setActivity(`${commandFiles.length} commands so far || currently in ${client.guilds.cache.size} servers`);
	});
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

		const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.run(interaction, client);
	} catch (error) {
		if (error.message != 'user ran the error command') console.error(error);
		await interaction.reply({ content: error.toString(), ephemeral: true });
	}
});


// Login
client.login(process.env.token);