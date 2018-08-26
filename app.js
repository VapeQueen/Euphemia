const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');
const config = require('./config.json');
const client = new Commando.Client({
    owner: process.env.BOT_OWNER || config.owner,
    commandPrefix: config.prefix || ';',
    disableEveryone: true,
    unknownCommandResponse: false
});
require('./events/event.js')(client);
client.defaultColor = config.defaultColor;

client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => {
        return new Commando.SQLiteProvider(db)
    })
).catch(console.error);


client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['anime', 'Anime and manga commands'],
        ['bot', 'Pulic bot commands'],
        ['fun', 'Fun commands'],
        ['moderation', 'Moderation commands'],
        ['owner', 'Owner only commands'],
        ['setup', 'Server utility setup commands'],
        ['server', 'Server-specific commands'],
        ['utility', 'Utility commands']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        ping: false,
        help: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));


<<<<<<< HEAD
client.login(process.env.DISCORD_TOKEN || config.token).catch(console.error);
=======
client.login(process.env.BOT_TOKEN || config.token).catch(console.error);
>>>>>>> 067e8e2... Module structure improvements
