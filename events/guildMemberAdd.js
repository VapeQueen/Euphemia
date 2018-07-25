const { RichEmbed } = require('discord.js');
const moment = require('moment');

module.exports = member => {
    let entry = member.client.provider.get(member.guild, 'guildMemberAdd', false);
    if (entry.message && entry.channel) {
        let message = entry.message;
        message = JSON.parse(message.replace('$MENTION$', member.toString()).replace('$NAME$', member.user.tag).replace('$MEMBER_COUNT$', member.guild.memberCount).replace('$AVATAR$', member.user.avatarURL || member.guild.iconURL));
        member.guild.channels.find(val => val.id === entry.channel).send(message.content, new RichEmbed(message));
    }
    if (entry.log) {
        let channel = member.guild.channels.find(val => val.id === entry.log);
        channel.send(new RichEmbed()
            .setColor('BLUE')
            .setTitle(`✅ User joined`)
            .setThumbnail(member.user.avatarURL)
            .setDescription(`${member.toString()} \`${member.user.tag}\``)
            .addField('ID', member.id, false)
            .addField('Joined server', moment(member.joinedAt).format('DD.MM.YYYY HH.MM.SS'), true)
            .addField('Joined Discord', moment(member.user.createdAt).format('DD.MM.YYYY HH.MM.SS'), false)
            .setTimestamp(member.joinedAt)
        );
        let accountAge = moment().diff(moment(member.user.createdAt), 'days');
        if (accountAge <= 30) {
            channel.send(new RichEmbed()
                .setColor('DARK_RED')
                .setDescription(`**WARNING** User ${member.toString()}'s account is less than ${++accountAge} days old**`)
            )
        }
    }
    if (entry.automute) {
        let mutedRole = member.client.provider.get(member.guild, 'mutedRole', false);
        if (!mutedRole) {
            member.guild.createRole({
                name: `${member.client.username}-mute`,
                position: member.guild.me.highestRole.position - 1,
                permissions: 104322113
            }).then(role => {
                if (entry.log) {
                member.guild.channels.find(val => val.id === entry.log).send(new RichEmbed()
                    .setColor('BLUE')
                    .setTitle(`Created new role ${role.name}`))
                    member.client.provider.set(member.guild, 'mutedRole', role.id);
                    member.addRole(role);
                }});
        } else {
            member.addRole(mutedRole);
        }
    }
}