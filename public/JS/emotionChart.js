var dataPoints = 0;
var loggingEmotion = false;
var loggedTime = 0;
var flag = 0;
var apiKey = ['7453875244d44303b8f460f4597d8f29', 'e91caa7877034a3bba07ca16af7003f9'];
var deltaValence = 0, deltaTempo = 0, deltaEnergy = 0;
var totals = { emotion: {
			                "anger": 0,
			                "disgust": 0,
			                "happiness": 0,
			                "neutral": 0,
			                "sadness": 0,
			                "surprise": 0 }
			          	};

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


function screenshot() {
	takeASnap()
	.then(imgData => {
		$.post({
			url: "https://canadacentral.api.cognitive.microsoft.com/face/v1.0/detect?&returnFaceAttributes=emotion",
			contentType: "application/octet-stream",
			headers: {
				'Ocp-Apim-Subscription-Key': apiKey[flag]
			},
			processData: false, 
			data: imgData
		}, function(data, status) {
			// console.log(status);
			if (flag == 0){
				flag = 1;
			} else flag = 0;

			if (data.length > 0){
				emotions = data[0].faceAttributes.emotion;
				
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

				// update Spotify playlist every 15 minutes
				if (loggedTime > 359){
					loggingEmotion = false;
					loggedTime = 0;
					console.log(totals);
					
					updatePlaylist(totals);
				}
				
				// counters
				dataPoints += 1;
				if (loggingEmotion) {
					loggedTime += 1;
				} 
			}
		});

	// for testing
	// .then(() => {
	// 	// timestamp = newTime();	
		
	// 	// for poster screenshot
	// 	var counter = 0;
	// 	config.data.datasets.forEach(function(dataset) {
	// 		dataset.data.push({
	// 			x:secondsPast,
	// 			y:posterData.data[secondsPast][counter]
	// 		});

	// 		counter += 1;
	// 	});


	// 	if (secondsPast < 10){
	// 		window.myLine.update();
	// 	}

	// 	// config.data.datasets.forEach(function(dataset) {
	// 	// 	if (secondsPast > 9){
	// 	// 		dataset.data.shift();
	// 	// 	}

	// 	// 	dataset.data.push({
	// 	// 		x: secondsPast,
	// 	// 		y: Math.random()
	// 	// 	});
	// 	// });

	// 	// if (config.data.datasets[0].data.length == 10 || secondsPast < 10){
	// 	// 	window.myLine.update();
	// 	// }

	// 	// update Spotify playlist
	// 	if (loggedTime > 9){
	// 		loggingEmotion = false;
	// 		updatePlaylist();
	// 	}
		
	// 	// counters
	// 	secondsPast += 1;
	// 	if (loggingEmotion) {
	// 		loggedTime += 1;
	// 		deltaValence += 0.01;
	// 		deltaTempo += 2;
	// 		deltaEnergy += 0.01;
	// 	} 
	});
}

function logEmotion() {
	// updatePlaylist();
	loggingEmotion = true;
}

function updatePlaylist(totals) {
	
	var avgHappy = totals.emotion.happiness/5;
	var avgNeutral = totals.emotion.neutral/5;
	var avgSad = totals.emotion.sadness/5;
	var avgAngry = totals.emotion.anger/5;
	var avgSurprise = totals.emotion.surprise/5;
	var avgDisgust = totals.emotion.disgust/5;
	
	deltaValence = (avgHappy - avgSad - avgAngry).toFixed(2);
	deltaEnergy = (avgHappy + avgSurprise - avgDisgust - avgSad).toFixed(2);
	deltaTempo = ((avgHappy + avgSurprise + avgAngry - avgSad) * 75).toFixed(2);

	$.get({
		url: 'http://localhost:8888/user/updatePlaylist?deltaValence=' + deltaValence
				+ '&deltaTempo=' + deltaTempo + '&deltaEnergy=' + deltaEnergy
	}, function(data, status) {
		if (status == 'success'){
			console.log("reloading page");
			location.reload();
		} else {
			console.log(status);
			console.log("error reloading page");
		}
		
		deltaValence = 0;
		deltaTempo = 0;
		deltaEnergy = 0;

		loggedEmotionTotals = [0,0,0,0,0,0,0,0];
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
	if (navigator.mediaDevices.getUserMedia) {
		var vid = document.querySelector('video');

		navigator.mediaDevices.getUserMedia({ video: true, audio: false })

        //success callback
        .then(localMediaStream => {
        	vid.srcObject = localMediaStream;
        	return vid.play();
        })
        .finally(window.setInterval(screenshot, 2505));

    } else {
    	console.log("getUserMedia not supported");
    }
}

// function newTime() {
// 	var currentTime = new Date();
// 	return (currentTime.getSeconds() - startTime.getSeconds());
// }
