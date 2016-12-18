var audio = document.getElementById('bofangqi');
var musicIndex = 0,
	songData, musicVolume = .3,
	songTime;
d3.json("song.json", function(data) {

	songData = data;
})
window.onload = function() {
	init();
}

function init() {
	audio.src = songData[musicIndex].url;
	audio.volume = musicVolume;
	setTimeout(function() {
		songTime = audio.duration;
	}, 500);
}

function nextSong() {
	audio.src = songData[++musicIndex >= songData.length ? (musicIndex = 0) : musicIndex].url;
	d3.select('.myImage').attr('xlink:href',songData[musicIndex].imageUrl)
	playMusic();
}

function preSong() {
	audio.src = songData[--musicIndex < 0 ? (musicIndex = songData.length - 1) : musicIndex].url;
	playMusic();
}

function addVolum() {
	musicVolume = (musicVolume + 0.05) >= 1 ? 1 : (musicVolume + 0.05);
	audio.volume = musicVolume;
}

function jianVolum() {
	musicVolume = (musicVolume - 0.05) <= 0 ? 0 : (musicVolume - 0.05);
	audio.volume = musicVolume;
}
var muiscInterval, muiscInterval2;

function playMusic() {
	audio.play();
	xuanzhuan();
}

function xuanzhuan() {
	var index,
		pinglv = songTime*100;
	muiscInterval = setInterval(function() {
		index = audio.currentTime*100;
		d3.select('.circleProgress')
			.select('path')
			.attr('d', function(d) {
				return parc.endAngle(Math.PI * 2 / pinglv * index)(d);
			});
		if(index>=pinglv){
			clearInterval(muiscInterval);
			setTimeout(nextSong(),500);
		}
	}, 10);
	muiscInterval2 = setInterval(function() {
		createRect();
	}, 1000);
}

function stopMusic() {
	audio.pause();
	clearInterval(muiscInterval);
	clearInterval(muiscInterval2);
	d3.selectAll(".myRect").selectAll('rect').transition()
		.duration(700)
		.attr('height', 0);
}