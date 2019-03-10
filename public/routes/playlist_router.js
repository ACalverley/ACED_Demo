/**
 * This is the router file that allows the system to
 * create a playlsit and add tracks to that playlist
 * for the web app to play
 */
require('dotenv').config();
const express = require('express'),
    router = express.Router();
    request = require('request'),
    rp = require('request-promise'); // "Request" library
    cors = require('cors');
    querystring = require('querystring');
    cookieParser = require('cookie-parser');

var playlistID, userID;

router.use(function timeLog(req, res, next) {
    //   console.log('Time: ', Date.now());
    next();
});

router.get('/play', (req, res) => {
    var playPlaylist = {
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: {
            'Authorization': 'Bearer ' + req.query.access_token,
            'Content-Type': 'application/json'
        },
        body : {
            'context_uri': 'spotify:playlist:' + playlistID
        },
        json: true
    };

    rp.put(playPlaylist);
});

router.get('/update', (req, res) => {
    trackURIs = req.query.tracks;

    // console.log("inside update playlist route");
    var updatePlaylist = {
        url: 'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks',
        headers: {
            'Authorization': 'Bearer ' + req.query.access_token,
            'Content-Type': 'application/json'
        },
        body: {
            'uris': trackURIs
        },
        json: true,
    };

    rp.put(updatePlaylist, (err, response, body) => {
        if (response.statusCode != 201) console.log(response.statusCode);
        else {
            // console.log("Redirecting back to home page");

            res.redirect("/home?" + 
                querystring.stringify({
                    playlist_id: playlistID,
                    user_id: userID
                }));
        }
    });
});

// creates a playlist for the user
router.get('/create', (req, res) => {
    trackURIs = req.query.tracks;
    userID = req.query.user_id;

    // console.log("inside create playlist route");
    var createPlaylist = {
        url: 'https://api.spotify.com/v1/users/' + req.query.user_id + '/playlists',
        headers: {
            'Authorization': 'Bearer ' + req.query.access_token,
            'Content-Type': 'application/json'
        },
        body: {
            'name': 'Sunshine and Rainbows',
            'public': true,
            'description': 'A new ACED playlist'
        },
        json: true,
    };

    rp.post(createPlaylist, (err, response, body) => {
        if (response.statusCode != 201) console.log(response.statusCode);
        else {
            console.log("successfully created a playlist");
            playlistID = body.id;
            // console.log(trackURIs);

            //add songs to playlist
            var addSong = {
                url: 'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks',
                headers: {
                    'Authorization': 'Bearer ' + req.query.access_token,
                    'Content-Type': 'application/json'
                },
                body: {
                    'uris': trackURIs
                },
                json: true,
            };

            rp.post(addSong, (err, addSongRes) => {
                if (err) console.log(err);
                else {
                    // console.log("Redirecting back to home page");

                    res.redirect("/home?" + 
                        querystring.stringify({
                            playlist_id: playlistID,
                            user_id: userID
                        }));
                }
            });
        }
    });

});


module.exports = router;