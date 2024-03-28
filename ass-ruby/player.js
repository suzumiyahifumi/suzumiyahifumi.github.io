'use strict';
var TEST_VIDEO_FILE = './test.mp4';
var TEST_ASS_FILE = 'https://raw.githubusercontent.com/Aegisub/Aegisub/master/docs/specs/ass-format-tests.ass';
var $ = function (s) { return document.querySelectorAll(s) };
var courl = (
	(window.URL && window.URL.createObjectURL) ||
	(window.webkitURL && window.webkitURL.createObjectURL) ||
	window.createObjectURL ||
	window.createBlobURL
);
var ass;
var content = '';
var video = document.createElement('video');
video.controls = true;
var videoReady = false,
	ASSReady = false;
var dropVideo = $('#drop-video')[0],
	dropASS = $('#drop-ASS')[0];
dropVideo.ondragleave = dropASS.ondragleave = function () { this.style.borderColor = '#ccc'; };
dropVideo.ondragover = dropASS.ondragover = function (e) {
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
	this.style.borderColor = '#888';
};
dropVideo.ondrop = function (e) {
	e.preventDefault();
	this.style.borderColor = '#ccc';
	video.src = courl(e.dataTransfer.files[0]);
};
$('#drop-video input')[0].onchange = function () {
	video.src = courl(this.files[0]);
};
dropASS.ondrop = function (e) {
	e.preventDefault();
	this.style.borderColor = '#ccc';
	loadASS(e.dataTransfer.files[0]);
};
$('#drop-ASS input')[0].onchange = function () {
	loadASS(this.files[0]);
};
$('#init-video')[0].onclick = function () {
	this.disabled = true;
	video.src = TEST_VIDEO_FILE;
};
$('#init-ass')[0].onclick = function () {
	var that = this;
	this.disabled = true;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', TEST_ASS_FILE, true);
	xhr.send(null);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				assOnLoaded(xhr.responseText);
			} else {
				showMessage('error', 'failed to fetch test file.');
				that.disabled = false;
			}
		}
	}
};
video.onloadedmetadata = function () {
	videoReady = true;
	$('#init-video')[0].disabled = true;
	showMessage('success', 'video is loaded.');
	dropVideo.style.display = 'none';
	$('#demo')[0].insertBefore(video, dropVideo);
	if (videoReady && ASSReady) init();
};
video.onerror = function (e) {
	videoReady = false;
	$('#init-video')[0].disabled = false;
	showMessage('error', 'failed to load video.');
};
$('#controls-resize')[0].onclick = function () {
	if (video.clientWidth === 960) {
		video.style.width = '640px';
		video.style.height = '360px';
		$('#info')[0].style.display = 'inline-block';
	} else {
		video.style.width = '960px';
		video.style.height = '540px';
		$('#info')[0].style.display = 'none';
	}
	ass.resize();
};
$('#controls-show')[0].onclick = function () {
	ass.show();
};
$('#controls-hide')[0].onclick = function () {
	ass.hide();
};
$('#controls-destroy')[0].onclick = function () {
	ass.destroy();
};
var $rs = Array.prototype.slice.apply($('input[name="resampling"]'));
$rs.forEach(function ($r) {
	$r.onclick = function () {
		ass.resampling = this.id.match(/resampling-(.*)/)[1];
	};
});

var loadASS = function (file) {
	var reader = new FileReader(file);
	let txt = /\.txt$/i.test(file.name);
	let result = undefined;
	if (!/\.ass$/i.test(file.name)) {
		showMessage('error', 'only supports ASS format.');
		if (!txt) {
			return;
		}
	}
	reader.readAsText(file);
	reader.onload = function (ev) {
		if (/\.txt$/i.test(file.name)) {
			result = loadTxt(ev.target.result);

			console.log("[[result]]", result);
		}

		assOnLoaded(result || ev.target.result);

		loadFile2Code((result != undefined) ? {
			name: file.name.replace(".txt", ".ass"),
			text: async function () {
				return this._text;
			},
			_text: result
		} : file);
	};
};

var loadTxt = function (data) {
	content = data;
	showMessage('success', 'TXT file is loaded.');
	console.log("[[txt data]]", data);
	
	// 要添加的前綴字串
	let prefix = "Dialogue: 0,0:00:00.00,0:00:00.00,Default,,0000,0000,0000,,";

	// 使用正規表達式替換每一行的開頭
	let modifiedText = `[Script Info]
PlayResX: null
PlayResY: null
Collisions: Normal

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${data.replace(/^/gm, prefix)}`;
	content = modifiedText;
	return modifiedText;
};

var assOnLoaded = function (data) {
	content = data;
	showMessage('success', 'ASS file is loaded.');
	$('#init-ass')[0].disabled = true;
	$('#drop-ASS .drop-text')[0].innerHTML = 'ASS file is loaded';
	dropASS.style.border = '10px solid #ccc';
	ASSReady = true;
	if (videoReady && ASSReady) init();
};
var init = function () {
	ass = new ASS(content, video);
	dropASS.style.display = 'none';
	$('#controls-resize')[0].disabled = false;
	$('#controls-show')[0].disabled = false;
	$('#controls-hide')[0].disabled = false;
	$('#controls-destroy')[0].disabled = false;
	var info = document.createElement('div'),
		dl = document.createElement('dl'),
		dt = document.createElement('dt');
	info.id = 'info';
	dt.textContent = '[Script Info]';
	dl.appendChild(dt);
	for (var i in ass.info) {
		var dd = document.createElement('dd');
		dd.innerHTML = i + ': <strong>' + ass.info[i] + '</strong>';
		dl.appendChild(dd);
	}
	info.appendChild(dl);
	$('#demo')[0].appendChild(info);
};
var messageNode = $('#message')[0];
var showMessage = function (type, msg) {
	messageNode.textContent = msg;
	messageNode.className = type + ' transition';
	messageNode.style.opacity = 0;
	messageNode.addEventListener('transitionend', function () {
		messageNode.textContent = '';
		messageNode.className = '';
		messageNode.style.opacity = 1;
	});
};
document.onkeypress = function (e) {
	if (!ass.video) return;
	var key = e.keyCode || e.which,
		aen = document.activeElement.nodeName.toLowerCase();
	if (aen === 'textarea' || aen === 'input') return;
	if (key === 32) {
		e.preventDefault();
		video.paused ? video.play() : video.pause();
	}
};