/*---------------
 * jQuery Last.FM Plugin by Craig Beaton
 * Forked from Lastfm Recent Tracks by Pinceladas da Web https://github.com/pinceladasdaweb/Lastfm-Recent-Tracks
 * Copyright (c) 2024
 * Version: 1.0.0 (30-01-2024)
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * Requires: jQuery v1.9 or later and Handlebars 1.0 or later
---------------*/

var Lastfm = {
	init: function(config) {
		this.url = 'https://lastfmretriever.azurewebsites.net/api/gettrackshttptrigger'
		this.template = config.template;
		this.container = config.container;
		this.fetch();
	},
	attachTemplate: function() {
		var template = Handlebars.compile(this.template);

		this.container.empty().append(template(this.tracks));
	},
	fetch: function() {
		var self = this;

		$.getJSON(this.url, function(data) {
			var feed = data.recenttracks.track;

			self.tracks = $.map(feed, function(track) {
				var d = new Date(track.date['uts'] * 1000)
				const shortTime = new Intl.DateTimeFormat("en", {
					timeStyle: "short",
				  });
				var thetime = shortTime.format(d); 

				return {
					image: track.image[2]['#text'],
					song: track.name,
					artist: track.artist['#text'],
					album: track.album['#text'],
					link: track.url,
					time: thetime
				}
			});
			self.attachTemplate();
		});
	}
}

Lastfm.init({
	template: $('#tracks-template').html(),
	container: $('.container'),
})
