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


function searchSpotify() {

    if (!trackName) {
        trackName = "ace of base the sign";
    }
    spotify.search({ type: 'track', query: trackName, limit: 1 }).then(response => {

            if (JSON.stringify(response.tracks.items[0])) {
                let trackObj = response.tracks.items[0];
                console.log("\nSpotify Song Information:\n" + "-".repeat(25) + "\n");
                console.log("Artist(s):\n" + "-".repeat(10));
                trackObj.artists.forEach(function (artist) {
                console.log(artist.name);
                });
                console.log("\nSong Title:\n" + "-".repeat(11) + "\n" + trackObj.name);

                if (trackObj.preview_url !== null) {
                    console.log("\nPreview Link:\n" + "-".repeat(13) + "\n" + trackObj.preview_url);
                }
                console.log("\nAlbum Title:\n" + "-".repeat(12) + "\n" + trackObj.album.name);
            }
        })
}

function searchMovie() {
    let Url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    if (!movieName) {
        movieName = "mr nobody";
    }

rp(Url).then(response => {
            let movieObj = JSON.parse(response);

            if (movieObj.Error === undefined) {
                console.log("\nHere's a summary of the movie you searched for:\n" + "-".repeat(47));
                console.log("\nTitle:\n" + "-".repeat(6) + "\n" + movieObj.Title);
                console.log("\nRelease Year:\n" + "-".repeat(13) + "\n" + movieObj.Year);

                if (movieObj.Ratings[0]) {
                    console.log("\n" + movieObj.Ratings[0].Source + " Rating:\n" + "-".repeat(31) + "\n" + movieObj.Ratings[0].Value);
                }
                if (movieObj.Ratings[1]) {
                    console.log("\n" + movieObj.Ratings[1].Source + " Rating:\n" + "-".repeat(23) + "\n" + movieObj.Ratings[1].Value);
                }
                console.log("\nCountry of Origin:\n" + "-".repeat(18) + "\n" + movieObj.Country);
                console.log("\nLanguage:\n" + "-".repeat(9) + "\n" + movieObj.Language);
                console.log("\nPlot Summary:\n" + "-".repeat(13) + "\n" + movieObj.Plot);
                console.log("\nStarring:\n" + "-".repeat(9) + "\n" + movieObj.Actors);
                }
            })
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

function getTweets() {
    let params = { screen_name: 'BigAdain', count: 20, tweet_mode: 'extended' };

    client.get('statuses/user_timeline/', params).then(tweets => {
        let counter = tweets.length;
        console.log("\nThe last " + counter + " tweets from " + tweets[0].user.name + " in ascending order:\n" + "-".repeat(60));

        tweets.forEach(function (tweet) {
            console.log("\nTweet #" + counter + "\n" + "-".repeat(10));
            console.log(moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').format('X') + "\n");
            counter--;
        });
    })
}
