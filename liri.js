require("dotenv").config();

let request = require('request');
let rp = require('request-promise');
let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let moment = require('moment');
let fs = require("fs-extra");
let keys = require("./keys");

let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

let input = process.argv;
let command = input[2];
let trackName = input.slice(3).join(" ");
let movieName = input.slice(3).join(" ");

switch (command) {
    case "my-tweets":
        getTweets();
        break;

    case "spotify-this-song":
        searchSpotify();
        break;

    case "movie-this":
        searchMovie();
        break;

    case "do-what-it-says":
        random();
        break;
}



function random() {
    fs.readFile('random.txt', 'utf8').then(data => {
            let randomTask = data.split(",");

            switch (randomTask[0]) {
                case "my-tweets":
                    getTweets();
                    break;
                case "spotify-this-song":
                    trackName = randomTask[1];
                    searchSpotify();
                    break;
                case "movie-this":
                    movieName = randomTask[1];
                    searchMovie();
                    break;
            }
        })
}


