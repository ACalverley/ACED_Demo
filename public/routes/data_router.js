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

function combineData(sessions, access_token) {
    // console.log(sessions);
    return new Promise(async function(resolve, reject) {
        var data = [];
        for (var k = 0; k < sessions.length; k++){
            var tracks = [];
            for (var j = 0; j < sessions[k].trackURI.length; j++){
                // console.log(sessions[k].trackURI[j].substring(14));
                var getTrackInfo = {
                    url: 'https://api.spotify.com/v1/audio-features/' + sessions[k].trackURI[j].substring(14),
                    headers: {
                      'Authorization': 'Bearer ' + access_token
                    },
                    json: true
                };
                console.log("calling sleep");
                await sleep(1000);

                await rp.get(getTrackInfo, (req, response) => {
                    tracks.push(response.body);
                });

                await sleep(1000);
            
            }
            // manyToOne(tracks, sessions, k);
            data.push(manyToOne(tracks, sessions, k)); 
        }
        resolve(data);
    });
}

router.get('/process', async (req, res) => {
    var access_token = req.query.access_token;

	const directory = './data';

    fs.readdirAsync(directory).then((files) => {
        return Promise.all(files.map(fs.readFileAsync));
    }).then((fileData) => {
        return Promise.all(fileData.map((sessions) => combineData(JSON.parse(sessions), access_token)));
    }).then((allData) => {
        fs.writeFile("./newData/testData_maxScore" + ".txt", JSON.stringify(allData), (err, data) => {
            if (err) console.log(err);
            else console.log("wrote to database");
        }); 
    });

    res.end();
});

function getUserResponse () {
    const directory = './data';

    fs.readdirAsync(directory).then((files) => {
        return Promise.all(files.map(fs.readFileAsync));
    }).then((fileData) => {
        fileData.forEach((sessions) => {
            sessions.forEach((session) => {
                // process data as you wish heres
            })
        })
    });
}

function oneToOneMax (tracks, sessions, k){
    var newSession = { maxHappiness: [],
                       trackData: [] };
    var trackNum = 0;

    // newSession.trackData = [tracks[trackNum]];

    var trackLength = tracks[0].duration_ms;
    var time = 2510;
    var maxHappiness = parseFloat(sessions[k].emotionLog[0].happiness);

    for (var j = 1; j < sessions[k].emotionLog.length; j++){
        time += 2510;
        if (time <= trackLength){
            if (parseFloat(sessions[k].emotionLog[j].happiness) > maxHappiness){
                maxHappiness = parseFloat(sessions[k].emotionLog[j].happiness);
            } 
        }
        else {
            newSession.trackData.push(tracks[trackNum]);
            newSession.avgHappiness.push({ score: maxHappiness });
            maxHappiness = parseFloat(sessions[k].emotionLog[j].happiness);
            time -= trackLength;
            trackNum += 1;
            trackLength = tracks[trackNum].duration_ms;
        }
    } 

    console.log("pushed a session" + k);
    return newSession;
}


function oneToOneAvg (tracks, sessions, k) {
    var newSession = { avgHappiness: [],
                       trackData: [] };
    var trackNum = 0;

    // newSession.trackData = [tracks[trackNum]];

    var trackLength = tracks[0].duration_ms;
    var time = 2510;
    var totalHappiness = parseFloat(sessions[k].emotionLog[0].happiness);
    var counter = 1;

    for (var j = 1; j < sessions[k].emotionLog.length; j++){
        time += 2510;
        if (time <= trackLength){
            totalHappiness += parseFloat(sessions[k].emotionLog[j].happiness);
            counter += 1;
        }
        else {
            console.log(time, k);
            newSession.trackData.push(tracks[trackNum]);
            newSession.avgHappiness.push({ score: totalHappiness/counter });
            totalHappiness = parseFloat(sessions[k].emotionLog[j].happiness);
            counter = 1;
            time -= trackLength;
            trackNum += 1;
            trackLength = tracks[trackNum].duration_ms;
        }
    }   

    console.log("pushed a session" + k);
    return newSession;
}


function manyToOne (tracks, sessions, k) {
    var trackNum = 0;
    sessions[k].trackData = [tracks[trackNum]];
    var trackLength = tracks[0].duration_ms;
    var time = 2510;

    for (var j = 0; j < sessions[k].emotionLog.length - 1; j++){
        time += 2510;
        if (time <= trackLength){
            sessions[k].trackData.push(tracks[trackNum]);
        }
        else {
            time -= trackLength;
            trackNum += 1;
            trackLength = tracks[trackNum].duration_ms;
            sessions[k].trackData.push(tracks[trackNum]);
        }
    }
    
    console.log("pushed a session");
    return sessions[k];
}

// make Promise version of fs.readdir()
fs.readdirAsync = function(dirname) {
    return new Promise(function(resolve, reject) {
        fs.readdir(dirname, function(err, filenames){
            if (err) 
                reject(err); 
            else 
                resolve(filenames);
        });
    });
};

// make Promise version of fs.readFile()
fs.readFileAsync = function(filename) {
    return new Promise(function(resolve, reject) {
        const directory = './data/';
        fs.readFile(directory + filename, function(err, data){
            if (err) 
                reject(err); 
            else
                resolve(data);
        });
    });
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


module.exports = router;
