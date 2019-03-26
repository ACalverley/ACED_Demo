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


router.use(function timeLog(req, res, next) {
    // console.log('Time: ', Date.now());
    next();
});

router.get('/process', async (req, res) => {
	var user_id = req.query.user_id;
    var access_token = req.query.access_token;
    var refresh_token = req.query.refresh_token;

	const directory = './data';

    var files = fs.readdirSync(directory);
    
    for (var i = 0; i < files.length; i++){
        fs.readFile(directory + "/" + files[i], async (err, rawData) => {
            if (err) console.log(err);
            else {
                console.log("reading file");
                sessions = JSON.parse(rawData);
                console.log(sessions.length);
                
                for (var k = 0; k < sessions.length; k++){
                    for (var j = 0; j < sessions[k].trackURI.length; j++){
                        var getTrackInfo = {
                            url: 'https://api.spotify.com/v1/audio-features/' + sessions[k].trackURI[j].substring(14),
                            headers: {
                              'Authorization': 'Bearer ' + access_token
                            },
                            json: true
                        };

                        var response = await rp.get(getTrackInfo);
                        if (response.err) console.log(response.err);
                        else console.log(response.uri);

                    }
                }
            }

        });
    }   

    // fs.writeFile("./data/UserTrial" + trialNumber + ".txt", JSON.stringify(userData), (err, data) => {
    //     if (err) console.log(err);
    //     else console.log("wrote user trial #" + trialNumber + " to database");
    // });

    res.end();
});


module.exports = router;
