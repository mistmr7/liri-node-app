// require the .env file to get our keys
require("dotenv").config()

// use keys js file to link to .env and hide the keys
var keys = require('./keys')

// require needed node api's
var Spotify = require('node-spotify-api')
var Request = require('request')
var Twitter = require('twitter')
var fs = require('fs')
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// set arguments for the command line for searches (command call and movie name, song name, etc.)
let api = process.argv[2]
let arg = process.argv[3]


//function used to call the twitter api
//still waiting for api and secret, will update code when this is sent to me
let runTwitter = (response) => {
    client.get()
}

// function used to call the spotify api
let runSpotify = (arg) => {
    // search spotify's api by track, querying the argument from the command line and allowing 20 responses.
    spotify.search({ type: 'track', query: arg, limit: 20 }, function(err, response) {
        if (err) {
            console.log(err)
            runSpotify('The Sign')
        }
        console.log('')
        
        for (i = 0; i < 20; i++){
            let data = response.tracks.items[i]
            let musicians = []

            // printing out all of the artists on a track
            for (j=0; j < response.tracks.items[i].artists.length; j++){
                musicians.push(JSON.stringify(data.artists[j].name));
            }

            // querying the data and pulling the necessary information from the response object
            console.log('Artist(s): ' + musicians)
            console.log('Song: ' + JSON.stringify(data.name, null, 2))
            console.log('url: ' + JSON.stringify(data.external_urls.spotify, null, 2))
            console.log('Album: ' + JSON.stringify(data.album.name, null, 2))
            console.log('')
        }
    });
}

// Function used to call the omdb api
let runMovie = (response) => {

    // request data from the omdb api and search by the argument stated on the command line of movie name
    Request(`http://www.omdbapi.com/?t=${arg}&plot=short&apikey=trilogy`, (err, response) => {
        if (!err && response.statusCode === 200) {
            // parse the object into the correct notation
            let data = JSON.parse(response.body)

            // Log all of the necessary information from the object
            console.log('Title: ' + data.Title)
            console.log('Release Year: ' + data.Year)
            console.log('IMDB Rating: ' + data.imdbRating)
            console.log('Rotten Tomatoes Rating: ' + data.Ratings[1].Value)
            console.log('Country: ' + data.Country)
            console.log('Language: ' + data.Language)
            console.log('Plot: ' + data.Plot)
            console.log('Actors: ' + data.Actors)
        }
    })
}

// Search the random text file
let runWhatItSays = (response) => {
    fs.readFile('random.txt', 'utf8', (err, response) =>{
        if (err) console.log(err)

        //split the data string into an array by the comma so that we can use both of the items in our search
        const dataArr = response.split(',')
        
        // set the resulting text to the node command line arguments
        let api = dataArr[0]
        let arg = dataArr[1]
        
        functionFinder(api, arg)
    })
}

let functionFinder = function(api, arg) {
    if (api === 'my-tweets') {
        runTwitter()
    } else if (api === 'spotify-this-song') {
        runSpotify(arg)
    } else if (api === 'movie-this') {
        runMovie()
    } else if (api === 'do-what-it-says') {
        runWhatItSays()
    }
}

functionFinder(api, arg)