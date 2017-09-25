var Keys = require('./keys.js');
var app = process.argv[2];
var appVar = process.argv[3];

switch (app){
	case "my-tweets":
		myTweets();
		break;
	case "spotify-this-song":
		spotifyThisSong(appVar);
		break;
	case "movie-this":
		if (appVar){
			movieThis(appVar);
		} else
			movieThis("Mr. Nobody");
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

	var objQuery = null;
	if (song==null){
		song = "The Sign"
	}

	spotify.search({ type: 'track', query: song }, function(err, data) {
	  if (!err) { 
			if (song == "The Sign")
				song = data.tracks.items[5];
			else
				song = data.tracks.items[0];

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

function myTweets(){
	var Twitter = require('twitter');
	 
	var client = new Twitter({
	  consumer_key: Keys.twitterKeys.consumer_key,
	  consumer_secret: Keys.twitterKeys.consumer_secret,
	  access_token_key: Keys.twitterKeys.access_token_key,
	  access_token_secret: Keys.twitterKeys.access_token_key
	});
	 
	var params = {screen_name: 'nodejs'};

	client.stream('statuses/filter', {track: 'twitter'},  function(stream) {
	  stream.on('data', function(tweet) {
	    console.log(tweet.text);
	  });

	  stream.on('error', function(error) {
	    console.log(error);
	  });
	});
}

function movieThis(aMovie){
	var requestUrl = "";	

	if (aMovie=="Mr. Nobody"){
		requestUrl = "http://www.omdbapi.com/?apikey=40e9cece&i=tt0485947";
	} else
		requestUrl = "http://www.omdbapi.com/?apikey=40e9cece&t=" + aMovie;	

	var request = require('request');

	request(requestUrl, function (error, response, body) {
	  if (error){
	  	console.log('error:', error); // Print the error if one occurred
		} 
		else {
	  	var movie = JSON.parse(body);
	  	if (movie.Title != null){
				console.log('======= OMDB ==================');	  	
			  console.log('Title: ', movie.Title);
				console.log('Year: ', movie.Year);

				if (movie.Ratings[0] != null)
					console.log('IMDB Rating: ', movie.Ratings[0].Value);
				if (movie.Ratings[1] != null)		
					console.log('Rotten Tomatoes Rating: ', movie.Ratings[1].Value);
			
				console.log('Country: ', movie.Country);
		 		console.log('Language: ', movie.Language);
				console.log('Plot: ', movie.Plot);
				console.log('Actors: ', movie.Actors);		
				console.log('=================================');
			} else
				console.log ("movie not found");
		}
	});
}

function doWhatItSays(){

var fs = require("fs");

fs.readFile("random.txt", "utf8", function(error, data) {
  // If the code experiences any errors it will log the error to the console.
  if (error) {
    return console.log(error);
  }

  var dataArr = data.split(" ");

	var app = dataArr[0];
	var appVar = dataArr[1];

	switch (app){
		case "my-tweets":
			myTweets();
			break;
		case "spotify-this-song":
			spotifyThisSong(appVar);
			break;
		case "movie-this":
			if (appVar){
				movieThis(appVar);
			} else
				movieThis("Mr. Nobody");
			break;
		default:
			console.log(app + " not found.");
	}  
})

}