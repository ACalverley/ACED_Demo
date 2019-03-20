require('dotenv').config();
const express = require('express'); // Express web server framework
		bodyParser = require('body-parser');
		http = require('http');
		// cors = require('cors');
		cookieParser = require('cookie-parser');
		queryString = require('query-string');
		// request = require('request-promise'); // "Request" library
		base64Img = require('base64-img');
		fs = require('fs');
		request = require('request');

const alias = "https://aced-demo.now.sh";
// Liam's computer
const ipAddress = "192.168.2.28";
const localServerPort = "8001";
// Aidan's computer
// const ipAddress = "10.217.61.29:8001";
const port = "8888";
var app = express();

app.use(express.static(__dirname, { dotfiles: 'allow' } ));
app.use(express.static(__dirname + '/public'))
   .use(bodyParser.raw({type: "application/octet-stream", limit: '50mb'}))
   .use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
   .use(bodyParser.json())
   // .use(cors())
   .use(cookieParser());

app.use('/playlist',require('./public/routes/playlist_router.js'));

app.use('/user', require('./public/routes/user_router.js'));

app.use('/login', require('./public/routes/login_router.js'));

app.get('/home', (req, res) => {
	// console.log(req.query);
	res.render('index.ejs', {playlist_id: req.query.playlist_id, user_id: req.query.user_id});
});

app.get('/test', (req, res) => {
	// request.get('http://' + ipAddress + '/test', (err, res, body) => {
	// 	console.log(body);
	// 	console.log("got response from local server");
	// 	res.end();
	// });

	// var options = {
	//     host: ipAddress,
	//     port: localServerPort,
	//     path: "/test",
	//     method: "GET", 
 //    };

 //    var dataReq = http.request(options, (res) => {
	// 	res.on("data", (data)=> {
	// 		console.log("got a response from local server!");
	// 	});
	// 	res.on("end", () => {
	// 		console.log("data was saved!");
	// 	});
 //    });

 //    dataReq.write("test");
 //    dataReq.end();
 //    res.end();
	request.post(
 		"http://" + ipAddress + ":" + localServerPort + "/test",
 		{ json: {data : "hey here is some data"}},
 		(req, response) => {
			if (response.statusCode == 200){
				console.log(response.body);
			}
 	});

 	res.end();
});

app.get("/data", (req, res) => {
	dirname = './data';
	allData = [];
	fs.readdir(dirname, function(err, filenames) {
	    if (err) {
	    	res.send(err);
	    }
	    filenames.forEach(function(filename) {
	    	// console.log(filename);
	      	content = fs.readFileSync(dirname + "/" + filename);
	        // console.log(content.toString());
	        userData = JSON.parse(content.toString());
	        allData.push(userData);
	    });

	    console.log("finished reading files");
	    res.send(allData);
  	});
});

app.get('/', (req, res) => {
	res.redirect('/login');
});

app.set("view engine", "enginejs");
app.set("views", __dirname + "/public/views");

console.log('Listening on 8888');
app.listen(port);





