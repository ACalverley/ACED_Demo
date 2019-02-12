var rate = 5;
var size = 20;
var min = 0; 
var max = 1;  
var random;
var emotions = new Float64Array([0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
window.setInterval(resizeEmoji, 1000);


function resizeEmoji() {
	// if (size > 75) {
	// 	size = 20;
	// } else {
	// 	size = size + rate;
	// }

	
    var sizes = new Int32Array([20, 20, 20, 20, 20, 20]);
    for(i = 0; i < emotions.length; i++){
	  random = Math.random() * (+max - +min) + +min;
	  emotions[i] = random;
	  sizes[i] = sizes[i] + (55 * emotions[i]);
    }



	console.log("EXECUTE!");
	$(document.getElementById("angerEmoji")).animate({fontSize: sizes[0]}, 900);
	$(document.getElementById("disgustEmoji")).animate({fontSize: sizes[1]}, 900);
	$(document.getElementById("happyEmoji")).animate({fontSize: sizes[2]}, 900);
	$(document.getElementById("neutralEmoji")).animate({fontSize: sizes[3]}, 900);
	$(document.getElementById("sadEmoji")).animate({fontSize: sizes[4]}, 900);
	$(document.getElementById("surprisedEmoji")).animate({fontSize: sizes[5]}, 900);
}
