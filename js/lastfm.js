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
		var base_url = 'https://lastfmretriever.azurewebsites.net/api/'
		var process = document.getElementById("lastfm_js").getAttribute("data-process");
		if (typeof process === "undefined" ) {
			trigger = 'getcurrenttrackshttptrigger';
		}
		else if (process == '1') {		
			const urlParams = new URLSearchParams(window.location.search);
			const start = urlParams.get('start');
			trigger = 'getprevioustrackshttptrigger?start=' + start;
		} else {
			trigger = 'getcurrenttrackshttptrigger';
		}

		this.url = base_url + trigger
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

setInterval(function() {
    Lastfm.fetch();
}, 180000); // 180,000 ms = 3 minutes
