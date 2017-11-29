import * as Utils from '../utils';

export var isSupported = false;

try {
	if (typeof window.localStorage == "object") {
		window.localStorage['colahar.storage.test'] = "true";
		isSupported = true;
	}
} 
catch (exception) {
	// Do Nothing
}

export var get = function (key, def) {
	var value = window.localStorage[key];

	try {
		const jsonValue = JSON.parse(Utils.Base64.decode(value))

		return Utils.isObject(jsonValue) ? jsonValue : (value === undefined ? def : value)
	}
	catch (exception) {
		// Do Nothing
	}

	return value === undefined ? def : value;
}

export var set = function(key, value) {
	return (window.localStorage[key] = Utils.isObject(value) ? Utils.Base64.encode(JSON.stringify(value)) : value);
}

export var unset = function(key) {
	var value = window.localStorage[key];

	delete window.localStorage[key];

	return value;
}

export var number = function(key, def) {
	var value = get(key);

	return Utils.isNaN(value) || value === undefined ? def : value;
}

if (!isSupported) {
	const noop_get = function(key, def) { return def; }
	const noop_set = function(key, value) { return value; }
	
	get = noop_get
	set = noop_set
	number = noop_get
	unset = noop_get
}