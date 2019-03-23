const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            group: 'moderation',
            memberName: 'stop',
            description: 'Denies message sending perms for @everyone',
            userPermissions: ['MANAGE_ROLES'],
            examples: [`${client.commandPrefix}stop on`, `${client.commandPrefix}stop off`],
            guildOnly: true
        });
    }

   async run(message) {
       const self = message.member.highestRole;
       const everyone = message.guild.roles.get(message.guild.id);
       if (message.content.split(' ')[1] === 'off') {
        } else {
        }
    }
			await message.channel.overwritePermissions(everyone, { 'SEND_MESSAGES': true });
			return message.channel.send(new RichEmbed()
				.setColor('GREEN')
				.setTitle('Channel unlocked')
		const channel = await message.channel.overwritePermissions(everyone, { 'SEND_MESSAGES': false }, 'Euphemia stop command');
		await channel.overwritePermissions(message.member.roles.filter(role => role.hasPermission('MANAGE_GUILD')).first() || message.author, { 'SEND_MESSAGES': true }, 'Euphemia stop command');
};
