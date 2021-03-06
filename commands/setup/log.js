const { Command }	= require('discord.js-commando');
const { RichEmbed }	= require('discord.js');
const path			= require('path');
const fs			= require('fs');
const directoryPath	= path.join(__dirname + '/../../events');
let eventModules;

fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
	if (err) {
		throw `Unable to scan directory:\n${err}`;
	}

	eventModules = files
		.filter(dirent => dirent.isFile() && !dirent.name.startsWith('_'))
		.map(dirent => dirent.name.replace(/\.[^/.]+$/, ''));
});

module.exports =  class extends Command {
	constructor(client) {
		super(client, {
			name: 'log',
			group: 'setup',
			memberName: 'log',
			description: 'Binds log events to channels',
			userPermissions: ['MANAGE_GUILD'],
			examples: [`${client.commandPrefix}log list`, `${client.commandPrefix}log enable event #channel`],
			guildOnly: true
		});
	}

	async run(message) {
		const args = message.content.split(' ').slice(1);
		if (args.length < 1) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle(`See ${message.client.commandPrefix}help log for help`)
			);
		}

		if (args[0] === 'list') {
			let entry;
			const body = eventModules.map(element => {
				entry = message.client.provider.get(message.guild, element, false);	// Optimize this reee
				if (entry && entry.log && entry.log !== undefined) {	// Not sure why this check is necessary
					entry = `<#${entry.log}>`;
				} else {
					entry = '*';
				}

				return `**${element}** ${entry}`;
			});

			return message.channel.send(new RichEmbed()
				.setColor('GREEN')
				.setTitle('Available log events')
				.setDescription(body.join('\n'))
			);
		}

		const channel = message.mentions.channels.first();

		if (!channel) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle('Please mention a channel')
			);
		}

		const eventMatch = args.slice(1).join(' ').match(/[a-z]+|[A-Z]+/);

		if (!eventMatch) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle('Please mention an event')
			);
		}

		const event = eventMatch[0];

		const entry = message.client.provider.get(message.guild, event, false);

		if (!entry) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.addField('Event not found', `Do ${message.guild.commandPrefix}${this.memberName} list to view a list of available events`)
			);
		}

		if (args[0] === 'enable') {
			entry.log = channel.id;		// Not sure what this does

			message.client.provider.set(message.guild, event, entry ||  { log: channel.id });	// Warning: unsafe. Should probably use an enumeration database

			return message.channel.send(new RichEmbed()
				.setColor('GREEN')
				.setDescription(`Enabled logging for event ${event} <#${channel}>`)
			);
		}

		if (args[1] === 'disable') {
			message.client.provider.remove(message.guild, event);

			return message.channel.send(new RichEmbed()
				.setColor('GREEN')
				.setTitle(`Disabled logging for event ${event}`)
			);
		}
	}
};
