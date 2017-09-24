var Keys = require('./keys.js');
var app = process.argv[2];
var appVar = process.argv[3];

switch (app){
	case "my-tweets":
		myTweets(appVar);
		break;
	case "spotify-this-song":
		spotifyThisSong(appVar);
		break;
	case "movie-this":
		movieThis(appVar);
		break;
	case "do-what-it-says":
		doWhatItSays(appVar);
		break;
	default:
		console.log("command not found. try again");
}


function spotifyThisSong(song){
	var Spotify = require('node-spotify-api');
	 
	var spotify = new Spotify({
	  id: Keys.spotifyKeys.client_ID,
	  secret: Keys.spotifyKeys.client_secret,
	});

	spotify.search({ type: 'track', query: song }, function(err, data) {
	  if (!err) { 
			var song = data.tracks.items[0];

				console.log("/n--------- Spotify -----------/n");
				console.log("Artist: " + song.artists[0].name);
				console.log("Name: " + song.name);
				console.log("Link: " + song.preview_url);
				console.log("Album Name: " + song.album.name);
				console.log("/n-----------------------------/n");
		}
		else {
			return console.log('Error occurred: ' + err);
  	}
	});
}
