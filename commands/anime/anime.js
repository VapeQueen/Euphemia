const { Command }	= require('discord.js-commando');
const { RichEmbed }	= require('discord.js');
const moment		= require('moment');
const request		= require('request-promise');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'anime',
            group: 'anime',
            memberName: 'anime',
            description: 'Searches anime in AniList database',
            examples: [`${client.commandPrefix}anime Clannad`]
        });
    }

   async run(message) {
       let args = message.content.split(' ');
       if (args.length < 2) {
           return message.channel.send(new RichEmbed()
                .setColor('ORANGE')
                .setTitle('Please enter search terms')
            );
       }
       const query = `query ($search: String) {
        Media(type:ANIME search: $search, sort: POPULARITY_DESC) {
            averageScore
            coverImage { large }
            description
            duration
            endDate { year month day }
            episodes
            format
            genres
            id
            idMal
            nextAiringEpisode { episode timeUntilAiring }
            popularity
            rankings { context rank }
            siteUrl
            source
            status
            startDate { year month day }
            title { userPreferred }
            }
        }`;
        const variables = {
            search: args.slice(1).join(' ')
        }

        return execute(query, variables).then(response => {
            return sendResponse(response, message);
        }).catch(error => {
            sendError(message, 'Not found');
            console.log(error.message);
        });
    }
}

async function execute(query, variables) {
    const options = {
        method: 'POST',
        uri: 'https://graphql.anilist.co',
        body: {
            query: query,
            variables: variables
        },
        json: true
    };

		const variables = {
			search: args.slice(1).join(' ')
		};

		const response = await request({
			method: 'POST',
			uri: 'https://graphql.anilist.co',
			body: {
				query: query,
				variables: variables
			},
			json: true
		});

		// Test this
		if (!response) {
			return message.channel.send(new RichEmbed()
				.setColor('RED')
				.setTitle('Not found')
			);
		}

    return message.channel.send(new RichEmbed()
        .setColor(global.BOT_DEFAULT_COLOR)
        .setTitle(anime.title.userPreferred)
        .setThumbnail(anime.coverImage.large)
        .setDescription(`[AniList](${anime.siteUrl}) | [MyAnimeList](https://myanimelist.net/anime/${anime.idMal})`)
        .addField('Average score', `${anime.averageScore || '-'}%`, true)
        .addField('Ranking', ranking.length > 0? `#${ranking[0].rank}` : 'unknown', true)
        .addField('Format', anime.format || 'unknown', true)
        .addField('Source', anime.source? normalizeConstant(anime.source.split('_').join(' ')) : 'unknown', true)
        .addField('Episodes', anime.episodes || 'unknown', true)
        .addField('Status', normalizeConstant(anime.status) || 'unknown', true)
        .addField('Start', anime.startDate.month? `${('0' + anime.startDate.day).slice(-2) || '-'}.${('0' + anime.startDate.month).slice(-2) || '-'}.${anime.startDate.year || '-'}` : 'unknown', true)
        .addField('End', anime.endDate.month? `${('0' + anime.endDate.day).slice(-2) || '-'}.${('0' + anime.endDate.month).slice(-2) || '-'}.${anime.endDate.year || '-'}` : 'unknown', true)
        .addField('Genres', anime.genres.join('\n'), true)
        .addField(duration? 'Next' : ((anime.status === 'FINISHED') ? 'Aired' : 'Will Air'), duration || moment(`${anime.startDate.year}${('0' + anime.startDate.month).slice(-2)}${('0' + anime.startDate.day).slice(-2)}`, 'YYYYMMDD').fromNow(), true)
        .addField('Description', anime.description? anime.description.length >= 1020? escapeHTML(anime.description.substring(0, 1020)) + '...' : escapeHTML(anime.description) : '*No description provided*', false)
    );
};

    const temp = string.toLowerCase();
    return temp.charAt(0).toUpperCase() + temp.slice(1);
			.addField('Format', _normalizeConstant(anime.format) || 'unknown', true)
			.addField('Source', anime.source ? _normalizeConstant(anime.source) : 'unknown', true)
			.addField('Status', _normalizeConstant(anime.status) || 'unknown', true)
			.addField('Description', anime.description ? anime.description.length >= 1020 ? _escapeHTML(anime.description.substring(0, 1020)) + '...' : _escapeHTML(anime.description) : '*No description provided*', false)
};

    return string.split('<br>').join(' ').split(/<i>|<\/i>/).join('*').split(/<em>|<\/em>/).join('**');
};
function _normalizeConstant(string) {
	const temp = string.toLowerCase().split('_').join(' ');
function _escapeHTML(string) {
	return string.split('<br>').join(' ').split(/<i>|<\/i>/).join('*').split(/<em>|<\/em>/).join('**');
}
