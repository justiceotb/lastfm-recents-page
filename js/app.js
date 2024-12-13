/*---------------
 * Page loading script by Craig Beaton
 * Copyright (c) 2024
 * Version: 1.0.0 (06-05-2024)
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
---------------*/

var menu_options = "";
$.getJSON(
    "json/menu.json", 
    function(result) {
        var ul = document.getElementById("menu-list");
        $.each(result.menu, function(file) {
        var li = document.createElement("li");
        var a = document.createElement('a'); 
        var link = document.createTextNode(this.title);  
        a.appendChild(link); 
        a.title = this.title; 
        a.href = 'previous.html?start=' + this.start + '&spotify=' + this.spotify + '&youtube=' + this.youtube; 
        document.body.appendChild(a); 
        li.appendChild(a);
        ul.appendChild(li);
        }
    );
    }
);

var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/')+1);
if (filename == 'previous.html') {
    var description = params.get('desc');
    if (description == '') {
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const params = new URLSearchParams(window.location.search);
        const timestamp = params.get('start');
        var parsedtime = new Date(Number(timestamp));
        var month = months[parsedtime.getMonth()];
        var year = parsedtime.getFullYear();
        document.getElementById('sub-heading').innerHTML = month + " " + year;
    } else {
        document.getElementById('sub-heading').innerHTML = description;
    }

    var spotify = params.get('spotify');
    if (spotify == '') {
        document.getElementById('spotify-button-img').src = "img/spotify-button-coming-soon.png"
    } else {
        document.getElementById('spotify-button-link').href = "https://open.spotify.com/playlist/" + spotify;
    }
    var youtube = params.get('youtube');
    if (youtube == '') {
        document.getElementById('youtube-button-img').src = "img/youtube-button-coming-soon.png"
    } else {
        document.getElementById('youtube-button-link').href = "https://www.youtube.com/playlist?list=" + youtube;
    }
}