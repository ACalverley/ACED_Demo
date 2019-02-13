// jshint ignore: start
require('dotenv').config();
const express = require('express');
    router = express.Router();
    rp = require('request-promise'); // "Request" library
    cors = require('cors');
    querystring = require('querystring');
    cookieParser = require('cookie-parser');

var access_token, refresh_token, user_id;
var valence = 0.6;
var tempo = 100;
var energy = 0.6;
var topTracks = [], topArtists = [];

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

//////////////////////////////////// ROUTES //////////////////////////////////////////////////////

router.get('/updatePlaylist', async (req, res) => {
    valence = valence + req.query.deltaValence;
    tempo = tempo + req.query.deltaTempo;
    energy = energy + req.query.deltaEnergy;

    console.log("delta valence: " + req.query.deltaValence);
    console.log("delta tempo: " + req.query.deltaTempo);
    console.log("delta energy: " + req.query.deltaEnergy);

    var getRecommendation = {
        url: 'https://api.spotify.com/v1/recommendations',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        qs: {
            limit: 10,
            seed_artists: topArtists.toString(),
            seed_tracks: topTracks.toString(),
            target_valence: valence,
            target_tempo: tempo,
            target_energy: energy
        },
        json: true
    };

    rp.get(getRecommendation, (error, response, body) => {
        var recommendedTracks = [];
        
        if (error) console.log(error)
        else {
            console.log("got updated queue with: " + body.tracks.length + " songs!");

            for (var i = 0; i < body.tracks.length; i++) {
                recommendedTracks.push(body.tracks[i].uri);
                // console.log(body.tracks[i].name);
            }
        }
    
        res.redirect('/playlist/update?' +
                querystring.stringify({
                    access_token: access_token,
                    user_id: user_id,
                    tracks: recommendedTracks
                }));
        
    });
});

// called when /user endpoint is hit
// get users saved albums and look at what genres they like
router.get('/createPlaylist', async (req, res) => {
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

    console.log("getting top tracks");

    rp.get(getTopTracks, (error, response, body) => {
        if (!error){
            for (var i = 0; i < body.items.length; i++){
                topTracks.push(body.items[i].id);
                console.log(body.items[i].name);
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
                    limit: 10,
                    seed_artists: topArtists.toString(),
                    seed_tracks: topTracks.toString(),
                    target_valence: valence,
                    target_tempo: tempo,
                    target_energy: energy
                },
                json: true
            };

            rp.get(getRecommendation, (error, response, body) => {
                var recommendedTracks = [];
                if (error) console.log(error)
                else {
                    // console.log(response);
                    // console.log(body);
                    for (var i = 0; i < body.tracks.length; i++) {
                        recommendedTracks.push(body.tracks[i].uri);
                        // console.log(body.tracks[i].name);
                    }
                }
            
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

module.exports = router;