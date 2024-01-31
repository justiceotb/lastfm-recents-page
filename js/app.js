/*---------------
 * jQuery Last.FM Plugin by Craig Beaton
 * Forked from jQuery Last.Fm Plugin by Pinceladas da Web
 * Copyright (c) 2024
 * Version: 1.0.0 (30-01-2024)
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * Requires: jQuery v1.9 or later and Handlebars 1.0 or later
---------------*/

var Lastfm = {
	init: function(config) {
		var currentDateObj = new Date();
		var currentDateMs = currentDateObj.getTime();
		var dayInMs = 24 * 60 * 60 * 1000; // 1 day
		var fromTime = parseInt(Date.parse(new Date(currentDateMs - dayInMs).toISOString()) / 1000)

		this.url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user='+config.username+'&from='+fromTime+'&api_key='+config.apikey+'&format=json&limit='+config.limit; 
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
				var thetime = shortTime.format(d) //.toLocaleTimeString('en')

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
	username: 'justiceotb',
	limit: 200,
	apikey: process.env.API_KEY
})

// $(document).ready(function() { /// Wait till page is loaded		
// 	setInterval(timingLoad, 5000); //300
// 	function timingLoad() {
// 		$('#tracks-template').load('index.html #tracks-template', function() {
// 		/// can add another function here
// 		});
// 	}
// }); //// End of Wait till page is loaded