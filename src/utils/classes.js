import * as Utils from './index';

export function extract() {
	return Array.prototype.slice.call(arguments, 0)
		.reduce(function(memo, cls) {
			if (Utils.isString(cls))
				memo[cls] = true;
			else if (Utils.isArray(cls))
				cls.forEach(function(key) { memo[key] = true; });
			else if (Utils.isObject(cls))
				memo = Object.assign(memo, cls);

			return memo;
		}, {})
}

export function combine() {
	let classMap = extract.apply(this, arguments)

	return Object.keys(classMap)
		.reduce(function(memo, className) {
			return memo + (classMap[className] ? " " + className : "");
		}, "")
		.substring(1)
}
