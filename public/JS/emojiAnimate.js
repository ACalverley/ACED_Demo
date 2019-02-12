var rate = 2;
var size = 40;
window.setInterval(resizeEmoji, 1500);

function resizeEmoji() {
	if (size > 60) {
		size = 40;
	} else {
		size = size + rate;
	}

	console.log("EXECUTE!");
	$(document.getElementById("angerEmoji")).animate({fontSize: size}, 1000);
	$(document.getElementById("disgustEmoji")).animate({fontSize: size}, 1000);
	$(document.getElementById("happyEmoji")).animate({fontSize: size}, 1000);
	$(document.getElementById("neutralEmoji")).animate({fontSize: size}, 1000);
	$(document.getElementById("sadEmoji")).animate({fontSize: size}, 1000);
	$(document.getElementById("surprisedEmoji")).animate({fontSize: size}, 1000);
}
