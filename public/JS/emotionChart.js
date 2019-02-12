var secondsPast = 0;
var loggingEmotion = false;
var loggedTime = 0;
var deltaValence = 0, deltaTempo = 0, deltaEnergy = 0;

navigator.mediaDevices.getUserMedia = (navigator.mediaDevices.getUserMedia ||
	navigator.mediaDevices.webkitGetUserMedia ||
	navigator.mediaDevices.mozGetUserMedia ||
	navigator.mediaDevices.msGetUserMedia);

var config = {
	type: 'line',
	data: {
		datasets: [
		{
			label: 'Happiness',
			backgroundColor: 'rgba(240, 255, 0, 1)',
			borderColor: 'rgba(240, 255, 0, 1)',
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
		},
		legend: {
			position: 'bottom',
			labels: {
				fontColor: 'rgba(255,255,255,0.8)',
				padding: 20,
				boxWidth: 20
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
				}
			}],
			yAxes: [{
				gridLines: {
					color: 'rgba(255,255,255,0.5)'
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
				}
			}]
		}
	}
};


window.onload = function() {
	var ctx = document.getElementById('emotionChart').getContext('2d');
	window.myLine = new Chart(ctx, config);
};


function screenshot() {
	takeASnap()
	// .then(imgData => {
	// 	$.post({
	// 		url: "https://canadacentral.api.cognitive.microsoft.com/face/v1.0/detect?&returnFaceAttributes=emotion",
	// 		contentType: "application/octet-stream",
	// 		headers: {
	// 			'Ocp-Apim-Subscription-Key': '4c04468a743c4afb8784828df37ecf38'
	// 		},
	// 		processData: false,
	// 		data: imgData
	// 	}, function(data) {
	// 		if (data.length > 0){
	// 			emotions = data[0].faceAttributes.emotion;
			
	// 			// config.data.datasets.forEach(function(dataset) {
	// 			// 	x: newDateString(config.data.datasets[0].data.length + 2),
	// 			// 	y: randomScalingFactor()
	// 			// });
	// 			timestamp = newTime();

	// 			config.data.datasets[0].data.push({
	// 				x: timestamp,
	// 				y: parseFloat(emotions.happiness) * 100
	// 			});
	// 			// config.data.datasets[1].data.push({
	// 			// 	x: timestamp,
	// 			// 	y: parseFloat(emotions.contempt) * 100
	// 			// });
	// 			config.data.datasets[1].data.push({
	// 				x: timestamp,
	// 				y: parseFloat(emotions.sadness) * 100
	// 			});
	// 			// config.data.datasets[3].data.push({
	// 			// 	x: timestamp,
	// 			// 	y: parseFloat(emotions.fear) * 100
	// 			// });
	// 			config.data.datasets[2].data.push({
	// 				x: timestamp,
	// 				y: parseFloat(emotions.neutral) * 100
	// 			});
	// 			config.data.datasets[3].data.push({
	// 				x: timestamp,
	// 				y: parseFloat(emotions.anger) * 100
	// 			});
	// 			config.data.datasets[4].data.push({
	// 				x: timestamp,
	// 				y: parseFloat(emotions.disgust) * 100
	// 			});
	// 			config.data.datasets[5].data.push({
	// 				x: timestamp,
	// 				y: parseFloat(emotions.surprise) * 100
	// 			});

	// 			window.myLine.update();
	// 		}
	// });

	// for testing
	.then(() => {
		// timestamp = newTime();	
		config.data.datasets.forEach(function(dataset) {
			if (secondsPast > 9){
				dataset.data.shift();
			}

			dataset.data.push({
				x: secondsPast,
				y: Math.random()
			});
		});

		if (config.data.datasets[0].data.length == 10 || secondsPast < 10){
			window.myLine.update();
		}

		// update Spotify playlist
		if (loggedTime > 9){
			loggingEmotion = false;
			updatePlaylist();
		}
		
		// counters
		secondsPast += 1;
		if (loggingEmotion) {
			loggedTime += 1;
			deltaValence += 0.01;
			deltaTempo += 2;
			deltaEnergy += 0.01;
		} 
	});
}

function logEmotion() {
	updatePlaylist();
	// loggingEmotion = true;
	// deltaValence = 0;
	// deltaTempo = 0;
	// deltaEnergy = 0;
}

function updatePlaylist() {
	$.get({
		url: 'http://localhost:8888/user/updatePlaylist?deltaValence=' + deltaValence
				+ '&deltaTempo=' + deltaTempo + '&deltaEnergy=' + deltaEnergy
	}, function(error, response, body) {
		if (!error){
			location.reload();
		}
		
		deltaValence = 0;
		deltaTempo = 0;
		deltaEnergy = 0;
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
        .finally(window.setInterval(screenshot, 1000));

    } else {
    	console.log("getUserMedia not supported");
    }
}

// function newTime() {
// 	var currentTime = new Date();
// 	return (currentTime.getSeconds() - startTime.getSeconds());
// }
