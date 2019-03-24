require('dotenv').config();
const express = require('express'); // Express web server framework
		bodyParser = require('body-parser');
		cors = require('cors');
		cookieParser = require('cookie-parser');
		queryString = require('query-string');
		// request = require('request-promise'); // "Request" library
		request = require('request');
		base64Img = require('base64-img');
		fs = require('fs'); 
		// http = require("http");


// var ipAddress = "192.168.2.28";
// var localServerPort = "8001";
var app = express();

app.use(express.static(__dirname, { dotfiles: 'allow' } ));
app.use(express.static(__dirname + '/public'))
   // .use(bodyParser.raw({type: "application/octet-stream", limit: '50mb'}))
   .use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }))
   .use(bodyParser.json({ limit: '50mb', extended: true }))
   .use(cors())
   .use(cookieParser());

app.use('/playlist',require('./public/routes/playlist_router.js'));

app.use('/user', require('./public/routes/user_router.js'));

app.use('/login', require('./public/routes/login_router.js'));

app.get('/home', (req, res) => {
	// console.log(req.query);
	res.render('index.ejs', {playlist_id: req.query.playlist_id, user_id: req.query.user_id});
});

app.get('/', (req, res) => {
	res.redirect('/login');
});

app.set("view engine", "enginejs");
app.set("views", __dirname + "/public/views");

console.log('Listening on 8888');
app.listen(8888);





