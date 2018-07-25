const { RichEmbed } = require('discord.js');

module.exports = error => {
    console.log(error);
    this.client.owners.forEach(owner => {
        owner.send(new RichEmbed()
            .setColor('RED')
            .setTitle(`A websocket error occured`)
            .addField('Error message', error.message)
            .addField('File name?', error.fileName || '-')
            .addField('Line number?'. error.lineNumber || '-')
        );
    })
}