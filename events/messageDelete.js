const { RichEmbed } = require('discord.js');
const moment = require('moment');

module.exports = message => {
    let entry = message.client.provider.get(message.guild, 'messageDelete', false);
    if (entry && entry.log) {
        if (message.content) {
            if (message.content.length >= 1020) {
                message.content = message.content.substring(0, 1020) + '...';
            }
            return message.guild.channels.find(val => val.id === entry.log).send(new RichEmbed()
                .setColor('DARK_PURPLE')
                .setTitle(`🗑 Message deleted in #${message.channel.name}`)
                .setDescription(`${message.member.toString()} \`${message.author.id}\``)
                .addField('Content', message.content, false)
                .addField('ID', message.id, false)
                .setTimestamp(moment().toISOString())
            );
        }
    }
};