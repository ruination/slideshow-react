export function set(key, value) {
	sessionStorage.setItem(`app_${key}`, value);
}

export function get(key, def) {
	if (sessionStorage[`app_${key}`] === undefined)
		return def;

	return sessionStorage.getItem(`app_${key}`);
}

export function remove(key) {
	return sessionStorage.removeItem(`app_${key}`);
}