function resizeEmoji(emotions) {
	$(document.getElementById("angerEmoji")).animate({fontSize: ((emotions.anger > 0.1) ? 30 + (70 * emotions.anger) : 0)}, 900);
	$(document.getElementById("disgustEmoji")).animate({fontSize: ((emotions.disgust > 0.1) ? 30 + (70 * emotions.disgust) : 0)}, 900);
	$(document.getElementById("happyEmoji")).animate({fontSize: ((emotions.happiness > 0.1) ? 30 + (70 * emotions.happiness) : 0)}, 900);
	$(document.getElementById("neutralEmoji")).animate({fontSize: ((emotions.neutral > 0.1) ? 30 + (70 * emotions.neutral) : 0)}, 900);
	$(document.getElementById("sadEmoji")).animate({fontSize: ((emotions.sadness > 0.1) ? 30 + (70 * emotions.sadness) : 0)}, 900);
	$(document.getElementById("surprisedEmoji")).animate({fontSize: ((emotions.surprise > 0.1) ? 30 + (70 * emotions.surprise) : 0)}, 900);
}
