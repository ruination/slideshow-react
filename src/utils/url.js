import * as Utils from './index';

let __a = document.createElement('a');

export function isAbsolute(url) {
	return /^https?:/.test(url);
}

export function to(url) {
	__a.href = url;

	return __a.href;
}

export function escape(url) {
	return url
			.replace(/&amp;/g, '%26')
			.replace(/&/g, '%26')
			.replace(/=/g, '%3D')
	;
}

function serialize(v, k) {
	if (Utils.isArray(v)) {
		return v.map((val) => (k + "[]=" + val), "").join("&");
	}
	else if (Utils.isObject(v))
	{
		var str = [];

		for(var p in v)
			if (v.hasOwnProperty(p)) {
				str.push(k + "[" + encodeURIComponent(p) + "]=" + encodeURIComponent(v[p]));
			}

		return str.join("&");
	}		
	else
		return v;
}

export function encode(obj, prefix) {
	var str = [];

	for(var p in obj) {
		if (obj.hasOwnProperty(p)) {
			var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
			if (v !== null && v !== undefined)
				str.push(typeof v == "object" ?
					serialize(v, k) :
					encodeURIComponent(k) + "=" + encodeURIComponent(v)
				);
		}
	}
	return str.join("&");
}

export function getImageAsset(state) {
	return (path) => {
		return `/images/${path}`
	}
}

export function getAsset(state) {
	return (path) => {
		return `//${process.env.URL}/${path}`
	}
}
