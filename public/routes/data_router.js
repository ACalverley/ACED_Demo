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
    
    // for (var i = 0; i < files.length; i++){
        fs.readFile(directory + "/" + files[1], async (err, rawData) => {
            if (err) console.log(err);
            else {
                console.log("reading file");
                // this right here is all the text file data!
                sessions = JSON.parse(rawData);
                // console.log(sessions.length);
                
                for (var k = 0; k < sessions.length; k++){
                    for (var j = 0; j < sessions[k].trackURI.length; j++){
                        // console.log(sessions[k].trackURI[j].substring(14));
                        var getTrackInfo = {
                            url: 'https://api.spotify.com/v1/audio-features/' + sessions[k].trackURI[j].substring(14),
                            headers: {
                              'Authorization': 'Bearer ' + access_token
                            },
                            json: true
                        };

                        await rp.get(getTrackInfo, (req, response) => {
                            console.log(response.body.uri);
                        });

                    }
                }
            }
        });
    // }   

    // fs.writeFile("./data/UserTrial" + trialNumber + ".txt", JSON.stringify(userData), (err, data) => {
    //     if (err) console.log(err);
    //     else console.log("wrote user trial #" + trialNumber + " to database");
    // });

    res.end();
});


module.exports = router;
