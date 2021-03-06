const { Command }	= require('discord.js-commando');
const { RichEmbed }	= require('discord.js');
const EuphemiaEmbed	= require('../../util/EuphemiaEmbed.js');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'goodbye',
			group: 'setup',
			memberName: 'goodbye',
			description: 'Sets up goodbye message.',
			details: 'Takes a JSON String as an argument.\n`%MENTION%` -> mentions user;\n`%NAME%` -> user name and discriminator without tagging;\n$MEMBER_COUNT$ -> guild member count;\n$AVATAR$ -> avatar URL',
			examples: [
				`JSON\n${client.commandPrefix}goodbye {\n\t"content":"%MENTION% has left the server",\n\t"image":"http://image-link.com"\n}`
			],
			userPermissions: ['MANAGE_GUILD'],
			guildOnly: true
		});
	}

	async run(message) {
		if (!message.content.includes(' ')) {
			const oldValue = await this.client.provider.remove(message.guild, 'guildMemberRemove');
			if (oldValue) {
				return message.channel.send(new RichEmbed()
					.setColor('RED')
					.setTitle('Removed and disabled goodbye message for this guild')
				);
			} else {
				return message.channel.send(new RichEmbed()
					.setColor('RED')
					.setTitle('Please specify a goodbye message, or channel')
				);
			}
		}

		const argument = message.content.split(' ').splice(1).join(' ');
		if (message.mentions.channels.size) {
			const object = this.client.provider.get(message.guild, 'guildMemberRemove', false);
			if (object) {
				object.channel = message.mentions.channels.first().id;
				this.client.provider.set(message.guild, 'guildMemberRemove', object);
				return message.channel.send(new RichEmbed()
					.setColor('GREEN')
					.setTitle(`Goodbye channel set to #${message.guild.channels.find(val => val.id === object.channel).name}`));
			} else {
				this.client.provider.set(message.guild, 'guildMemberRemove', { message: null, channel: message.mentions.channels.array()[0].id });
				message.channel.send(new RichEmbed()
					.setColor('GREEN')
					.setTitle(`Goodbye channel set to #${message.mentions.channels.array()[0].name}`));
				return message.channel.send(new RichEmbed()
					.setColor('RED')
					.setTitle(`Warning: No Welcome message set. Do ${this.client.commandPrefix}goodbye { JSON } to set the channel`)
				);
			}
		}

		if (argument.startsWith('{')) {
			const entry = this.client.provider.get(message.guild, 'guildMemberRemove', false);
			if (entry) {
				if (!entry.channel) {
					message.channel.send(new RichEmbed()
						.setColor('RED')
						.setTitle(`Warning: No Goodbye channel set. Do ${this.client.commandPrefix}goodbye #channel to set the channel`)
					);
				}

				const embed = EuphemiaEmbed.build(argument);
				if (embed) {
					entry.message = argument;
					this.client.provider.set(message.guild, 'guildMemberRemove', entry);
					message.channel.send(new RichEmbed()
						.setColor('GREEN')
						.setTitle('Goodbye message set')
					);
					return message.channel.send([embed.content], embed);
				} else {
					return message.channel.send(new RichEmbed()
						.setColor('RED')
						.setTitle('Please check your input')
					);
				}
			} else {
				const embed = EuphemiaEmbed.build(argument);
				if (embed) {
					this.client.provider.set(message.guild, 'guildMemberRemove', { message: argument, channel: null });
					message.channel.send(new RichEmbed()
						.setColor('GREEN')
						.setTitle('Goodbye message set')
					);

					return message.channel.send([embed.content], embed);
				} else {
					return message.channel.send(new RichEmbed()
						.setColor('RED')
						.setTitle('Please check your input')
					);
				}
			}
		}

		return message.channel.send(new RichEmbed()
			.setColor('RED')
			.setTitle(`See ${this.client.commandPrefix}help goodbye for help`)
		);
	}
};
