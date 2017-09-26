// *********************************************************
	var Keys = require('./keys.js');
	var app = process.argv[2];
	var appVar = process.argv[3];
	var fs = require("fs");
	var outputText = "";

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
				console.log(outputText);
			} else{
				movieThis("Mr. Nobody");
			}
			break;
		case "do-what-it-says":
			doWhatItSays(appVar);
			break;
		default:
			outputText = "command not found. try again";
			print(outputText);
			break;
	};


// *********************************************************
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

				outputText +="\n--------- Spotify -----------\n";
				outputText +="Artist: " + song.artists[0].name + "\n";
				outputText +="Name: " + song.name + "\n";
				outputText +="Link: " + song.preview_url + "\n";
				outputText +="Album Name: " + song.album.name + "\n";
				outputText +="\n-----------------------------\n";
		}
		else {
			outputText = "Error occurred: " + err;
  	}
		print(outputText);  	
	});
}

function myTweets(){
	var Twit = require('twit');

	var config = require('./twitterKeys')	 
	var T = new Twit(config);
		 
	T.get('search/tweets', { q: 'Pumpkin Pie since:2016-01-01', count: 20 }, function(err, data, response) {
	  for (var i = 0; i < data.statuses.length; i++) {
	  	outputText += "\ntweet "+ i + "=====================\n"
	  	outputText += data.statuses[i].created_at + "\n";
	  	outputText += data.statuses[i].text + "\n";
	  }
		print(outputText);	  
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
	  		outputText = "======= OMDB ==================\n" + 	  	
			  							"Title: " +  movie.Title + "\n" +
											"Year: " +  movie.Year + "\n";

				if (movie.Ratings[0] != null)
					outputText += "IMDB Rating: "+ movie.Ratings[0].Value + "\n";
				if (movie.Ratings[1] != null)		
					outputText += "Rotten Tomatoes Rating: "+ movie.Ratings[1].Value + "\n";
			
				outputText += "Country: " +  movie.Country + "\n";
		 		outputText += "Language: " +  movie.Language + "\n";
				outputText += "Plot: " +  movie.Plot + "\n";
				outputText += "Actors: " +  movie.Actors + "\n";		
				outputText += "=================================";
			} else {
				outputText = "movie not found";
			}
			print(outputText);
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
			default:{
				outputText = app + " not found.";
				print(outputText);
			}
		}  
	})
}

function print(outputText){
	console.log(outputText);
	fs.appendFile("log.txt", outputText, function(err) {

	  // If the code experiences any errors it will log the error to the console.
	  if (err) {
	    return console.log(err);
	  }

	});
}
