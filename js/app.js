/*---------------
 * Page loading script by Craig Beaton
 * Copyright (c) 2024
 * Version: 2.0.0 (28-06-2026)
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
---------------*/

var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/') + 1);

if (filename === '' || filename === 'index.html') {
    buildHistoryPage();
}

if (filename === 'previous.html') {
    const params = new URLSearchParams(window.location.search);
    var description = params.get('desc');
    if (description === '') {
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const timestamp = params.get('start');
        var parsedtime = new Date(Number(timestamp));
        var month = months[parsedtime.getMonth()];
        var year = parsedtime.getFullYear();
        document.getElementById('sub-heading').innerHTML = month + " " + year;
    } else {
        document.getElementById('sub-heading').innerHTML = description;
    }

    var eventType = params.get('eventType') || 'BYO Vinyl';
    document.getElementById('event-type').textContent = eventType;
    document.getElementById('main-heading').textContent = eventType.toUpperCase() + ' PLAYLIST';

    var spotify = params.get('spotify');
    if (spotify === '') {
        document.getElementById('spotify-button-img').src = "img/spotify-button-coming-soon.png";
    } else {
        document.getElementById('spotify-button-link').href = "https://open.spotify.com/playlist/" + spotify;
    }
    var youtube = params.get('youtube');
    if (youtube === '') {
        document.getElementById('youtube-button-img').src = "img/youtube-button-coming-soon.png";
    } else {
        document.getElementById('youtube-button-link').href = "https://www.youtube.com/playlist?list=" + youtube;
    }
}

function buildHistoryPage() {
    var BASE_URL = 'https://lastfmretriever.azurewebsites.net/api/';

    // Check for a live session
    $.getJSON(BASE_URL + 'getcurrenttrackshttptrigger', function(data) {
        var tracks = data.recenttracks && data.recenttracks.track;
        if (!tracks || !tracks.length) return;
        var latest = tracks[0];
        var isLive = false;
        if (latest['@attr'] && latest['@attr'].nowplaying === 'true') {
            isLive = true;
        } else if (latest.date && latest.date.uts) {
            var ageMinutes = (Date.now() / 1000 - parseInt(latest.date.uts, 10)) / 60;
            isLive = ageMinutes < 30;
        }
        if (isLive) {
            document.getElementById('live-banner').style.display = '';
        }
    });

    // Build session history list
    $.getJSON('json/menu.json', function(result) {
        var items = result.menu.filter(function(i) { return !i.hidden; }).slice().reverse(); // newest first
        var historyEl = document.getElementById('history-list');
        var currentYear = null;

        $.each(items, function() {
            var item = this;
            var year = new Date(Number(item.start)).getFullYear();

            if (year !== currentYear) {
                currentYear = year;
                var yearHeading = document.createElement('h2');
                yearHeading.className = 'history-year';
                yearHeading.textContent = year;
                historyEl.appendChild(yearHeading);
            }

            var label = item.desc !== '' ? item.desc : item.title;
            var eventType = item.eventType || 'BYO Vinyl';
            var href = 'previous.html?start=' + item.start +
                       '&spotify=' + item.spotify +
                       '&youtube=' + item.youtube +
                       '&desc=' + encodeURIComponent(item.desc) +
                       '&eventType=' + encodeURIComponent(eventType);

            var spotifyHref = item.spotify !== ''
                ? 'https://open.spotify.com/playlist/' + item.spotify : '';
            var youtubeHref = item.youtube !== ''
                ? 'https://www.youtube.com/playlist?list=' + item.youtube : '';

            var card = document.createElement('div');
            card.className = 'history-item';
            card.innerHTML =
                '<div class="history-title-group">' +
                '<span class="event-type-badge">' + eventType + '</span>' +
                '<a class="history-title" href="' + href + '">' + label + '</a>' +
                '</div>' +
                '<div class="history-links">' +
                (spotifyHref ? '<a href="' + spotifyHref + '" target="_blank"><img src="img/spotify-button.png" alt="Spotify" class="history-btn-img" /></a>' : '') +
                (youtubeHref ? '<a href="' + youtubeHref + '" target="_blank"><img src="img/youtube-button.png" alt="YouTube" class="history-btn-img" /></a>' : '') +
                '<a class="history-view" href="' + href + '">View playlist &rsaquo;</a>' +
                '</div>';
            historyEl.appendChild(card);
        });
    });
}
