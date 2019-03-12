require('dotenv').config();
const express = require('express'); // Express web server framework
		bodyParser = require('body-parser');
		// cors = require('cors');
		cookieParser = require('cookie-parser');
		queryString = require('query-string');
		request = require('request-promise'); // "Request" library
		base64Img = require('base64-img');
		fs = require('fs');

const alias = "https://aced-demo.now.sh";
const ipAddress = "192.168.2.28";
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

app.post('/writeData', (req, res) => {
    console.log("writing user data");

    console.log(req.body);
    
    // fs.writeFile("./data/UserTrial" + trialNumber + ".txt", JSON.stringify(req.body.userData), (err, data) => {
    //     if (err) console.log(err);
    //     else {
    //         console.log("wrote user trial #" + trialNumber + " to database");
    //         trialNumber += 1;
    //     }
    // });

    res.send("its working!");
});

app.get("/readData", (req, res) => {
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
app.listen(port, ipAddress);




