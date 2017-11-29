var localstorage = false;
var video = document.createElement('video');

const scroll = document.createElement("div");
scroll.style.visibility = "hidden";
scroll.style.width = "100px";
scroll.style.height = "100px";
scroll.style.msOverflowStyle = "scrollbar";

document.body.appendChild(scroll);

const scrollX = scroll.offsetWidth,
	scrollY = scroll.offsetHeight;

scroll.style.overflow = "scroll";

const content = document.createElement("div");
content.style.width = "100%";
content.style.height = "100%";
scroll.appendChild(content);        

const scrollbar = {
	x: content.offsetWidth - scrollX,
	y: content.offsetHeight - scrollY,
}

scroll.parentNode.removeChild(scroll);

try {
	if (typeof window.localStorage == "object") {
		window.localStorage.test = "1";
		localstorage = true;
	}
} 
catch (exception) {
	// Do Nothing
}

var isSafari = /Safari/.exec(navigator.userAgent) && !/Chrome/.exec(navigator.userAgent);
var safariVersionParts = /(\d+\.\d+) Safari/.exec(navigator.userAgent);
var safariVersion = safariVersionParts ? Number(safariVersionParts[1]) : 999;

var parseIpadVersion = function(UA) {
	var e = /Version\/(\d\.\d)/.exec(UA);
	
	if (e && e.length > 1) {
		return parseFloat(e[1], 10);
	}

	return 0;
};


function getInternetExplorerVersion(minimum) {
	var rv = -1;

	if (navigator.appName === 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent,
			re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
		if (re.exec(ua) !== null) {
			rv = parseFloat(RegExp.$1);
		}
	}

	return rv;
}

function supports3d () {
	var v = getInternetExplorerVersion();
	return v > -1 ? v > 9 : true;
}
var b = {};
var ua = navigator.userAgent.toLowerCase();
var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
	/(safari)[ \/]([\w.]+)/.exec(ua) ||
	/(webkit)[ \/]([\w.]+)/.exec(ua) ||
	/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
	/(msie) ([\w.]+)/.exec(ua) ||
	ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

if (match[1]) {
	b[match[1]] = true;
	b.version = match[2] || "0";
}

var UA = navigator.userAgent;
var IS_IE = b.msie || /Trident\/7/.test(UA);
var IS_IPAD = /iPad|MeeGo/.test(UA) && !/CriOS/.test(UA);
var IS_IPAD_CHROME = /iPad/.test(UA) && /CriOS/.test(UA);
var IS_IPHONE = /iP(hone|od)/i.test(UA) && !/iPad/.test(UA) && !/IEMobile/i.test(UA);
var IS_ANDROID = /Android/.test(UA) && !/Firefox/.test(UA);
var IS_ANDROID_FIREFOX = /Android/.test(UA) && /Firefox/.test(UA);
var IS_PLAYSTATION = /PLAYSTATION/i.test(UA);
var IS_XBOX = /Xbox/i.test(UA);
var IS_SILK = /Silk/.test(UA);
var IS_WP = /IEMobile/.test(UA);
var WP_VER = IS_WP ? parseFloat(/Windows\ Phone\ (\d+\.\d+)/.exec(UA)[1], 10) : 0;
var IE_MOBILE_VER = IS_WP ? parseFloat(/IEMobile\/(\d+\.\d+)/.exec(UA)[1], 10) : 0;
var IPAD_VER = IS_IPAD ? parseIpadVersion(UA) : 0;
var ANDROID_VER = IS_ANDROID ? parseFloat(/Android\ (\d\.\d)/.exec(UA)[1], 10) : 0;
var flashVideo = false;
var playVideo = false;
var animation = false;

// flashVideo
try {
	var plugin = navigator.plugins["Shockwave Flash"];
	var ver = IS_IE ? new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable('$version') : plugin.description;

	if (!IS_IE && !plugin[0].enabledPlugin) 
		flashVideo = false;
	else {
		ver = ver.split(/\D+/);
		
		if (ver.length && !ver[0]) 
			ver = ver.slice(1);

		flashVideo = ver[0] > 9 || ver[0] == 9 && ver[3] >= 115;
	}

} 
catch (e) {
	// Do nothing
}

try {
	playVideo = !!video.canPlayType;

	if (playVideo) 
		video.canPlayType('video/mp4');
} 
catch (e) {
	playVideo = false;
}

// animation
var vendors = ['','Webkit','Moz','O','ms','Khtml'];
var el = document.createElement('p');

for (var i = 0; i < vendors.length; i++) {
	if (typeof el.style[vendors[i] + 'AnimationName'] !== 'undefined') {
		animation = true;
		break;
	}
}

	
export default {
	localstorage: localstorage,
	isSafari: isSafari,
	safariVersion: safariVersion,

	flashVideo: flashVideo,
	playVideo: playVideo,
	video: video,
	animation: animation,
	hlsjs: !(IS_IE &&  b.version < 12),
	transform3d: supports3d(),
	browser: b,
	subtitles: !!video.addTextTrack,
	fullscreen: (typeof document.webkitCancelFullScreen == 'function' && !/Mac OS X 10_5.+Version\/5\.0\.\d Safari/.test(UA) && !IS_PLAYSTATION) ||
			document.mozFullScreenEnabled ||
			typeof document.exitFullscreen == 'function' ||
			typeof document.msExitFullscreen == 'function',
	inlineBlock: !(IS_IE && b.version < 8),
	touch: ('ontouchstart' in window),
	dataload: !IS_IPAD && !IS_IPHONE && !IS_WP,
	zeropreload: !IS_IE && !IS_ANDROID, // IE supports only preload=metadata
	volume: !IS_IPAD && !IS_ANDROID && !IS_IPHONE && !IS_SILK && !IS_IPAD_CHROME,
	cachedVideoTag: !IS_IPAD && !IS_IPHONE && !IS_IPAD_CHROME && !IS_WP,
	firstframe: !IS_IPHONE && !IS_IPAD && !IS_ANDROID && !IS_SILK && !IS_IPAD_CHROME && !IS_WP && !IS_ANDROID_FIREFOX,
	inlineVideo: !IS_IPHONE && (!IS_WP || (WP_VER >= 8.1 && IE_MOBILE_VER >= 11)) && (!IS_ANDROID || ANDROID_VER >= 3),
	hlsDuration: !IS_ANDROID && (!b.safari || IS_IPAD || IS_IPHONE || IS_IPAD_CHROME),
	seekable: !IS_IPAD && !IS_IPAD_CHROME,
	scrollbar
}