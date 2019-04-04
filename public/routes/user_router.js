// jshint ignore: start
require('dotenv').config();
const express = require('express');
    fs = require('fs');
    router = express.Router();
    rp = require('request-promise'); // "Request" library
    cors = require('cors');
    querystring = require('querystring');
    cookieParser = require('cookie-parser');
    request = require('request');

const client_id = process.env.CLIENT_ID; // Your client id 
const client_secret = process.env.CLIENT_SECRET; // Your secret

// var ipAddress = "10.217.114.118";
var ipAddress = "192.168.2.28";
var localServerPort = "8001";

var sessionData = {};
var userData = [];

var valence = 0.5;
var tempo = 100;
var energy = 0.6;
var access_token, refresh_token, user_id;
var topTracks = [], topArtists = [], recommendedTracks = [];

router.use(function timeLog(req, res, next) {
    // console.log('Time: ', Date.now());
    next();
});

//////////////////////////////////// ROUTES //////////////////////////////////////////////////////
router.get('/endDemo', (req, res) => {
    console.log("demo ended");

    // request.post(
    //     "http://" + ipAddress + ":" + localServerPort + "/writeData",
    //     { json: { userData : userData }},
    //     (req, response) => {
    //         if (response.statusCode == 200){
    //             console.log(response.body);
    //         }
    // });

    const directory = './data';

    var trialNumber = fs.readdirSync(directory).length + 1;
    fs.writeFile("./data/UserTrial" + trialNumber + ".txt", JSON.stringify(userData), (err, data) => {
        if (err) console.log(err);
        else console.log("wrote user trial #" + trialNumber + " to database");
    });

    res.end();
});

router.post('/logUserResponse', (req, res) => {
    console.log("logging user response");
    userData[userData.length - 1].userResponse = req.body.userResponse;
    // userData[userData.length - 1].valence = valence;

    res.end();
});

router.post('/updateParameters', (req, res) => {
    console.log("updating parameters and logging emotions");
    // console.log(req.body);

    sessionData = {};
    
    sessionData.currentParams = { valence : valence,
                                  tempo : tempo,
                                  energy : energy };
    sessionData.totals = req.body.totals;
    sessionData.emotionLog = req.body.emotionLog;
    sessionData.dataPoints = req.body.dataPoints;
    sessionData.trackURI = recommendedTracks;

    userData.push(sessionData);

    console.log(sessionData);

    res.redirect('updatePlaylist');
});

router.get('/updatePlaylist', async (req, res) => {
    console.log("updating playlist");

    if (sessionData.totals.happiness/sessionData.emotionLog.length > 0.10) {
        tempo += 5;
    } else if (sessionData.totals.happiness > sessionData.totals.sadness){
        valence += 0.05;
        tempo += 5;
    } else {
        valence += 0.15;
        energy += 0.1;
    }

    if (sessionData.totals.neutral/sessionData.emotionLog.length > 0.90) {
        valence += 0.05;
        tempo += 10;
        energy += 0.1;
    }

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    rp.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            access_token = body.access_token;

            var getRecommendation = {
                url: 'https://api.spotify.com/v1/recommendations',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                qs: {
                    limit: 20,
                    seed_artists: topArtists.toString(),
                    seed_tracks: topTracks.toString(),
                    target_valence: valence,
                    target_tempo: tempo,
                    target_energy: energy
                },
                json: true
            };

            rp.get(getRecommendation, (req, response) => {
                recommendedTracks = [];
                
                if (response.statusCode == 200) {
                    // console.log(response);
                    console.log("Got updated queue:");

                    for (var i = 0; i < response.body.tracks.length; i++) {
                        recommendedTracks.push(response.body.tracks[i].uri);
                        // console.log(response.body.tracks[i].name);
                    }
                }
                else {
                    console.log("Failed to get updated recommendations");
                }

                console.log("");
            
                res.redirect('/playlist/update?' +
                        querystring.stringify({
                            access_token: access_token,
                            user_id: user_id,
                            tracks: recommendedTracks
                        }));
                
            });
        }
    });
});

// called when /user endpoint is hit
// get users saved albums and look at what genres they like
router.get('/createPlaylist', async (req, res) => {
    userData = [];

    user_id = req.query.user_id;
    access_token = req.query.access_token;
    refresh_token = req.query.refresh_token;

    var getTopTracks = {
        url: 'https://api.spotify.com/v1/me/top/tracks',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        qs: {
            limit: '3'
        },
        json: true
    };
    
    var getTopArtists = {
        url: 'https://api.spotify.com/v1/me/top/artists',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        qs: {
            limit: '2'
        },
        json: true
    };
    
    topTracks = [], topArtists = [], recommendedTracks = [];

    rp.get(getTopTracks, (error, response, body) => {
        console.log(response.statusCode);
        if (!error){
            for (var i = 0; i < body.items.length; i++){
                topTracks.push(body.items[i].id);
                // console.log(body.items[i].name);
            }
        }

        rp.get(getTopArtists, (error, response, body) => {
            if (!error){
                for (var i = 0; i < body.items.length; i++){
                    topArtists.push(body.items[i].id);
                    // console.log(body.items[i].name);
                }
            }

            // console.log(topArtists);
            // console.log(topTracks);

            var getRecommendation = {
                url: 'https://api.spotify.com/v1/recommendations',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                qs: {
                    limit: 25,
                    seed_artists: topArtists.toString(),
                    seed_tracks: topTracks.toString(),
                    target_valence: valence,
                    target_tempo: tempo,
                    target_energy: energy
                },
                json: true
            };

            rp.get(getRecommendation, (req, response) => {
                console.log("getting recommendations");
                
                if (response.statusCode == 200) {
                    // console.log(response);
                    console.log("Got recommendations!");

                    for (var i = 0; i < response.body.tracks.length; i++) {
                        recommendedTracks.push(response.body.tracks[i].uri);
                        // console.log(response.body.tracks[i]);
                    }

                    sessionData.trackURI = recommendedTracks;
                }
                else console.log("Didn't get recommendations!");
                    
                res.redirect('/playlist/create?' +
                        querystring.stringify({
                            access_token: access_token,
                            user_id: user_id,
                            tracks: recommendedTracks
                        }));
                
            });
        });
    });
});

router.get('/startPlaylist', (req, res) => {
    res.redirect('/playlist/play?' +
                querystring.stringify({
                    access_token: access_token,
                }));
});

router.get('/pausePlaylist', (req, res) => {

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    rp.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            access_token = body.access_token;
            var pausePlaylist = {
                url: 'https://api.spotify.com/v1/me/player/pause',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                },
                json: true
            };

            rp.put(pausePlaylist);
        };
    });
});

module.exports = router;