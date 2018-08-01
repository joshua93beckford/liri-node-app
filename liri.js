require("dotenv").config();
const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
var request = require('request');
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

process.argv.shift();
process.argv.shift();

if (process.argv[0] == 'my-tweets') {
    twitter();
}
else if (process.argv[0] == 'spotify-this-song') {
    var song = "";
    for (var i = 1; i < process.argv.length; i++) {
        song += process.argv[i] + " ";
    }
    if (song != "") spot(song);
    else spot("Ace Of Base");
}
else if (process.argv[0] == 'movie-this') {

    var movie = "";

    for (var i = 1; i < process.argv.length; i++) {
        movie += process.argv[i] + " ";
    }

    if (movie != "") omdb(movie);
    else omdb("Mr. Nobody");
}
else if (process.argv[0] == 'do-what-it-says') {

    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        console.log(dataArr);
        // We will then re-display the content as an array for later use.
        if (dataArr[0] == 'my-tweets') {
            twitter();
        }
        else if (dataArr[0] == 'spotify-this-song') {

            song = dataArr[1].slice(1, -1);
            spot(song);

        }
        else if (dataArr[0] == 'movie-this') {
            omdb(dataArr[1]);
        }
        else {
            console.log("File is corrupted");
        }
    });
}
else {

    console.log("Please enter my-tweets, spotify-this-song [song name], movie-this [movie-name], or do-what-it-says")

}

function twitter() {
    var params = { screen_name: 'aboozarmojdeh' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            if (tweets.length <= 20) {
                for (var i = tweets.length - 1; i >= 0; i--) {
                    console.log("Tweet #" + parseInt(tweets.length - i) + " " + tweets[i].text);
                }
            }
            else {
                for (var i = tweets.length - 1; i >= tweets.length - 20; i--) {
                    console.log("Tweet #" + parseInt(tweets.length - i) + " " + tweets[i].text);
                }
            }
        }
        else {
            console.log(error);
        }
    });
}

function spot(song) {
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (var i = 0; i < data.tracks.items.length; i++) {


            console.log(data.tracks.items[i].name);

            for (var j = 0; j < data.tracks.items[0].album.artists.length; j++) {
                console.log("Artist #" + parseInt(j + 1) + " " + data.tracks.items[i].album.artists[j].name);
            }
            console.log(data.tracks.items[i].album.name);
            console.log(data.tracks.items[i].album.external_urls.spotify);
        }
    });
}

function omdb(movie) {
    var url = encodeURI("http://www.omdbapi.com/?t=" + movie + "&apikey=trilogy");

    request(url, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Language: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
        else {
            console.log(error)
        }
    });
}