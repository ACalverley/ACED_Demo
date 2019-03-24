var dataPoints = 0;
var loggingEmotion = false;
var loggedTime = 0;
var flag = 0;
// var apiKey = ['7453875244d44303b8f460f4597d8f29', 'e91caa7877034a3bba07ca16af7003f9'];
var apiKey = ['1dcd07f7e3504e05b35d1639d3baf749', '44887a0b25784feba60e6f6e41d9a944'];
var deltaValence = 0, deltaTempo = 0, deltaEnergy = 0;
var totals = { emotion: {
			                "anger": 0,
			                "disgust": 0,
			                "happiness": 0,
			                "neutral": 0,
			                "sadness": 0,
			                "surprise": 0 }
			          	};
var numDataPoints = 360;
var emotionLog = [];

navigator.mediaDevices.getUserMedia = (navigator.mediaDevices.getUserMedia ||
	navigator.mediaDevices.webkitGetUserMedia ||
	navigator.mediaDevices.mozGetUserMedia ||
	navigator.mediaDevices.msGetUserMedia);

var posterData = {
	data:[
       [0.05, 0.05, 0.8, 0.0, 0.05, 0.05],
       [0.1, 0.0, 0.7, 0.1, 0.05, 0.05],
       [0.5, 0.0, 0.4, 0.05, 0.0, 0.05],
       [0.9, 0.0, 0.05, 0.0, 0.0, 0.05],
       [0.3, 0.4, 0.2, 0.05, 0.05, 0.0],
       [0.1, 0.7, 0.05, 0.15, 0.0, 0.0],
       [0.0, 0.9, 0.0, 0.1, 0.0, 0.0],
       [0.2, 0.4, 0.2, 0.2, 0.0, 0.0],
       [0.0, 0.2, 0.1, 0.5, 0.2, 0.0],
       [0.0, 0.2, 0.1, 0.6, 0.09, 0.01]
   ]
};

var config = {
	type: 'line',
	data: {
		datasets: [
		{
			label: 'Happiness',
			backgroundColor: '#f2d202',
			borderColor: '#f2d202',
			fill: false,
			data: []
		},
		{
			label: 'Sadness',
			backgroundColor: 'rgba(44, 130, 201, 1)',
			borderColor: 'rgba(44, 130, 201, 1)',
			fill: false,
			data: []
		},
		{
			label: 'Neutral',
			backgroundColor: 'rgba(189, 195, 199, 1)',
			borderColor: 'rgba(189, 195, 199, 1)',
			fill: false,
			data: []
		},
		{
			label: 'Anger',
			backgroundColor: 'rgb(237, 28, 28)',
			borderColor: 'rgb(237, 28, 28)',
			fill: false,
			data: [],
		}, 
		{
			label: 'Disgust',
			backgroundColor: 'rgba(30, 130, 76, 1)',
			borderColor: 'rgba(30, 130, 76, 1)',
			fill: false,
			data: []
		}, 
		{
			label: 'Surprise',
			backgroundColor: 'rgba(255, 105, 180, 1)',
			borderColor: 'rgba(255, 105, 180, 1)',
			fill: false,
			data: []
		}
		// {
		// 	label: 'Contempt',
		// 	backgroundColor: 'rgba(208,99,68, 1)',
		// 	borderColor: 'rgba(208,99,68, 1)',
		// 	fill: false,
		// 	data: []
		// }, 
		// {
		// 	label: 'Fear',
		// 	backgroundColor: 'rgba(0, 0, 0, 1)',
		// 	borderColor: 'rgba(0, 0, 0, 1)',
		// 	fill: false,
		// 	data: []
		// }, 
		]
	},
	options: {
		responsive: true,
		title: {
			display: true,
			text: 'Emotional State Data',
			fontColor: 'rgba(255,255,255,0.8)',
			fontSize: 16
			// fontSize: 24,

		},
		legend: {
			position: 'bottom',
			labels: {
				fontColor: 'rgba(255,255,255,0.8)',
				padding: 20,
				boxWidth: 20,
				// fontSize: 24
			}
		},
		scales: {
			xAxes: [{
				type: 'time',
				distribution: 'series',
				bounds: 'data',
				display: true,
				gridLines: {
					color: 'rgba(255,255,255,0)'
				},
				ticks: {
					display: false,
				},
				scaleLabel: {
					display: true,
					labelString: 'Timepoint (s)',
					fontColor: 'rgba(255,255,255,0.8)',
					fontSize: 14
					// fontSize: 24
				}
			}],
			yAxes: [{
				gridLines: {
					color: 'rgba(255,255,255,0.5)'
					// color: 'black'
				},
				display: true,
				ticks: {
					beginAtZero: true,
					fontColor: 'rgba(255,255,255,0.8)'
				},
				scaleLabel: {
					display: true,
					labelString: 'Confidence Score',
					fontColor: 'rgba(255,255,255,0.8)',
					fontSize: 14
					// fontSize: 24
				}
			}]
		}
	}
};


window.onload = function() {
	var ctx = document.getElementById('emotionChart').getContext('2d');
	window.myLine = new Chart(ctx, config);
	// Chart.defaults.global.defaultFontColor = 'black';
};

function endDemo() {
	$("#thankyou").css("visibility", "visible");
	document.getElementById("beginDemo").disabled = true;
	document.getElementById("submitResponse").disabled = true;

	$.get('http://localhost:8888/user/endDemo');
}

function screenshot() {
	takeASnap()
	.then(imgData => {
		// counters
		dataPoints += 1;
		
		if (loggingEmotion) {
			$.post({
				url: "https://canadacentral.api.cognitive.microsoft.com/face/v1.0/detect?&returnFaceAttributes=emotion",
				contentType: "application/octet-stream",
				headers: {
					'Ocp-Apim-Subscription-Key': apiKey[flag]
				},
				processData: false, 
				data: imgData
			}, function(data, status) {
				console.log(status);
				if (flag == 0){
					flag = 1;
				} else flag = 0;

				console.log(data);

				if (data.length > 0){
					emotions = data[0].faceAttributes.emotion;

					emotionLog.push(emotions);
					
					// resizeEmoji(emotions);

					if (dataPoints > 9) { 
						config.data.datasets.forEach(function(dataset) {
							dataset.data.shift();
						});
					}
					
					config.data.datasets[0].data.push({
						x: dataPoints,
						y: parseFloat(emotions.happiness)
					});
					totals.emotion.happiness += emotions.happiness;

					// config.data.datasets[1].data.push({
					// 	x: timestamp,
					// 	y: parseFloat(emotions.contempt) * 100
					// });

					config.data.datasets[1].data.push({
						x: dataPoints,
						y: parseFloat(emotions.sadness)
					});
					totals.emotion.sadness += emotions.sadness;

					// config.data.datasets[3].data.push({
					// 	x: timestamp,
					// 	y: parseFloat(emotions.fear) * 100
					// });

					config.data.datasets[2].data.push({
						x: dataPoints,
						y: parseFloat(emotions.neutral)
					});
					totals.emotion.neutral += emotions.neutral;

					config.data.datasets[3].data.push({
						x: dataPoints,
						y: parseFloat(emotions.anger) 
					});
					totals.emotion.anger += emotions.anger;

					config.data.datasets[4].data.push({
						x: dataPoints,
						y: parseFloat(emotions.disgust)
					});
					totals.emotion.disgust += emotions.disgust;

					config.data.datasets[5].data.push({
						x: dataPoints,
						y: parseFloat(emotions.surprise)
					});
					totals.emotion.surprise += emotions.surprise;


					if (config.data.datasets[0].data.length == 10 || dataPoints < 10){
						window.myLine.update();
					}
				}
				// update Spotify playlist every 15 minutes
				if (loggedTime > numDataPoints){
					loggingEmotion = false;
					loggedTime = 0;
					console.log("calling updatePlaylist()");
					updatePlaylist();
				}
			});

			loggedTime += 1;
		} 
	});
}

function logEmotion() {
	loggingEmotion = true;
}

function logUserResponse() {
	$("#confirmSubmit").css("visibility", "visible");
	document.getElementById("submitResponse").disabled = true;

	var happinessValue = 0, sadnessValue = 0, neutralValue = 0;

	try {
		var happy = document.getElementById("happy").value;
		happinessValue = document.querySelector("#happiness option[value='"+happy+"']").dataset.value;
		
		var sad = document.getElementById("sad").value;
		sadnessValue = document.querySelector("#sadness option[value='"+sad+"']").dataset.value;
		
		var neutral = document.getElementById("neutral").value;
		neutralValue = document.querySelector("#neutrality option[value='"+neutral+"']").dataset.value;

	} catch (err) {
		happinessValue = 0;
		sadnessValue = 0;
		neutralValue = 0;
	}

	var userResponse = {
							"happiness": happinessValue,
							"neutral": neutralValue,
							"sadness": sadnessValue
						};

	$.post('http://localhost:8888/user/logUserResponse', 
		{ userResponse: userResponse }, 
		function(data, status) {
		if (status == 'success'){
			console.log("sent user response");
		} else {
			console.log(status);
			console.log("error sending user response");
		}
	});


	// updatePlaylist(userResponse);
}

function updatePlaylist() {

	// emotionLog = [];
	// for (var i = 0; i < 360; i++){
	// 	emotionLog.push({ anger: '0',
	// 				       contempt: '0',
	// 				       disgust: '0',
	// 				       fear: '0',
	// 				       happiness: '0',
	// 				       neutral: '0.993',
	// 				       sadness: '0.007',
	// 				       surprise: '0' });
	// }

	$.post('http://localhost:8888/user/updateParameters', 
		{	totals: totals.emotion,
			emotionLog: emotionLog,
			dataPoints: numDataPoints }, 
		function(data, status) {
		if (status == 'success'){
			console.log("updating playlist");
			setTimeout(
			  function() 
			  {
			    location.reload();
			  }, 15000);
			
			// uncessary due to page reload
			// totals = { emotion: {
			//                 "anger": 0,
			//                 "disgust": 0,
			//                 "happiness": 0,
			//                 "neutral": 0,
			//                 "sadness": 0,
			//                 "surprise": 0 }
			//           	};
			// emotionLog = [];
		} else {
			console.log(status);
			console.log("error updating playlist");
		}
	});
}

function takeASnap() {
	const canvas = document.createElement('canvas'); // create a canvas
    const ctx = canvas.getContext('2d'); // get its context
    canvas.width = vid.videoWidth; // set its size to the one of the video
    canvas.height = vid.videoHeight;
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height); // the video

    return new Promise((resolve, reject) => {
    	canvas.toBlob(resolve, 'img/jpeg', 0.5);
    });
}

function startWebcam() {
	document.getElementById("beginDemo").disabled = true;
	$("#confirmSubmit").css("visibility", "hidden");

	if (navigator.mediaDevices.getUserMedia) {
		var vid = document.querySelector('video');

		navigator.mediaDevices.getUserMedia({ video: true, audio: false })

        //success callback
        .then(localMediaStream => {
        	vid.srcObject = localMediaStream;
        	return vid.play();
        })
        .then(window.setInterval(screenshot, 2505))
        .finally(() => {
        	sessionData = [];
        	logEmotion();
        });
		
    } else {
    	console.log("getUserMedia not supported");
    }
}
