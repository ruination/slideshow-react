import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';

const toString = Object.prototype.toString;
const nativeKeys = Object.keys;
const textArea = document.createElement('textarea');

let _delayMap = {}
let __next_id = Math.round(100000000 * Math.random());

export const id = {
	generate: function() {
		return __next_id++;
	},
}

export function fix2(num) {
	return parseFloat(Math.round(num * 100) / 100).toFixed(2);
}

export function getReceiveActionProps(data) {
	return {
		success: data.success,
		errors: data.errors 
			? data.errors 
			: data.params && data.params.errors 
				? data.params.errors 
				: data.context && data.context.errors 
					? data.context.errors 
					: undefined,
		message: data.message,			
		code: data.code,			
	}
}

export function getValidationProps(state, action) {
	return {
		...state,
		success: action.success,
		errors: action.errors,
		message: action.message,
		code: action.code,
	}
}

export const delay = function(key, callback, wait) {
	if (_delayMap[key])
		clearTimeout(_delayMap[key])

	_delayMap[key] = setTimeout(function() {
		delete _delayMap[key];

		callback()
	}, wait);
}

export function replaceDictionary(str, obj) {
 	var pattern = [];

    for (let key in obj)
        if (obj.hasOwnProperty(key))
            pattern.push(":?" + key.replace(/([[^$.|?*+(){}\\])/g, '\\$1'));

    if (!pattern.length)
    	return str;
    
    pattern = new RegExp( pattern.join('|'), 'g' );

    return str.replace(pattern, function(match) { return obj[match] || obj[match.slice(1)]; });
}

export const splitComponentProps = function(props, Component) {
	const componentPropTypes = Component.propTypes;

	const parentProps = {};
	const childProps = {};

	Object.entries(props).forEach(([propName, propValue]) => {
		if (componentPropTypes[propName]) {
			parentProps[propName] = propValue;
		} else {
			childProps[propName] = propValue;
		}
	});

	return [parentProps, childProps];
}


export const splitContextProps = function(props, Component) {
	const componentPropTypes = Component.childContextTypes;

	const parentProps = {};
	const childProps = {};

	Object.entries(props).forEach(([propName, propValue]) => {
		if (componentPropTypes[propName]) {
			parentProps[propName] = propValue;
		} else {
			childProps[propName] = propValue;
		}
	});

	return [parentProps, childProps];
}

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
export var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
	    var output = "";
	    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	    var i = 0;

	    input = Base64._utf8_encode(input);

	    while (i < input.length) {

	        chr1 = input.charCodeAt(i++);
	        chr2 = input.charCodeAt(i++);
	        chr3 = input.charCodeAt(i++);

	        enc1 = chr1 >> 2;
	        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	        enc4 = chr3 & 63;

	        if (isNaN(chr2)) {
	            enc3 = enc4 = 64;
	        } else if (isNaN(chr3)) {
	            enc4 = 64;
	        }

	        output = output +
	        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
	        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

	    }

	    return output;
	},

	// public method for decoding
	decode : function (input) {
	    var output = "";
	    var chr1, chr2, chr3;
	    var enc1, enc2, enc3, enc4;
	    var i = 0;

	    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	    while (i < input.length) {

	        enc1 = this._keyStr.indexOf(input.charAt(i++));
	        enc2 = this._keyStr.indexOf(input.charAt(i++));
	        enc3 = this._keyStr.indexOf(input.charAt(i++));
	        enc4 = this._keyStr.indexOf(input.charAt(i++));

	        chr1 = (enc1 << 2) | (enc2 >> 4);
	        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	        chr3 = ((enc3 & 3) << 6) | enc4;

	        output = output + String.fromCharCode(chr1);

	        if (enc3 != 64) {
	            output = output + String.fromCharCode(chr2);
	        }
	        if (enc4 != 64) {
	            output = output + String.fromCharCode(chr3);
	        }

	    }

	    output = Base64._utf8_decode(output);

	    return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
	    string = string.replace(/\r\n/g,"\n");
	    var utftext = "";

	    for (var n = 0; n < string.length; n++) {

	        var c = string.charCodeAt(n);

	        if (c < 128) {
	            utftext += String.fromCharCode(c);
	        }
	        else if((c > 127) && (c < 2048)) {
	            utftext += String.fromCharCode((c >> 6) | 192);
	            utftext += String.fromCharCode((c & 63) | 128);
	        }
	        else {
	            utftext += String.fromCharCode((c >> 12) | 224);
	            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	            utftext += String.fromCharCode((c & 63) | 128);
	        }

	    }

	    return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
	    var string = "";
	    var i = 0;
	    var c = 0, c1 = 0, c2 = 0, c3 = 0;

	    while ( i < utftext.length ) {

	        c = utftext.charCodeAt(i);

	        if (c < 128) {
	            string += String.fromCharCode(c);
	            i++;
	        }
	        else if((c > 191) && (c < 224)) {
	            c2 = utftext.charCodeAt(i+1);
	            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
	            i += 2;
	        }
	        else {
	            c2 = utftext.charCodeAt(i+1);
	            c3 = utftext.charCodeAt(i+2);
	            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	            i += 3;
	        }

	    }

	    return string;
	}

}

export const Truncate = function(text, count) {
	return text ? (text.length > count ? text.substr(0, count) + "..." : text) : ""
}

export function subset(set, subSet) {
 	return subSet.filter(function(i) { return set.indexOf(i) === -1; }).length === 0;
}

export const isArguments = toString.call(arguments) === '[object Arguments]' ? function(obj) { return toString.call(obj) === '[object Arguments]' } : function(obj) { return has(obj, 'callee'); }
export const isFunction = function(obj) { return toString.call(obj) === '[object Function]' }
export const isString = function(obj) { return toString.call(obj) === '[object String]' }
export const isNumber = function(obj) { return toString.call(obj) === '[object Number]' }
export const isDate = function(obj) { return toString.call(obj) === '[object Date]' }
export const isRegExp = function(obj) { return toString.call(obj) === '[object RegExp]' }
export const isError = function(obj) { return toString.call(obj) === '[object Error]' }

export const property = function(key) {
	return function(obj) {
		return obj == null ? void 0 : obj[key];
	}
}

export const decodeHTML = function(encoded) {
	textArea.innerHTML = encoded;
	return textArea.value;
}

export const isArrayLike = function(collection) {
	var length = property('length')(collection);
	return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}

// Perform a deep comparison to check if two objects are equal.
export const isEqual = function(a, b) {
	return eq(a, b);
}

export const formatTimespan = function(time) {
	var h = Math.floor(time / 3600);
	var m = Math.floor((time % 3600) / 60);
	var s = Math.floor((time % 3600) % 60);
	var p = function(d) { return d < 10 ? "0" + d : d };

	return h > 0 ? (h + ":" + p(m) + ":" + p(s)) : (m + ":" + p(s));
}

// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
export const isEmpty = function(obj) {
	if (obj == null) return true;
	if (isArrayLike(obj) && (isArray(obj) || isString(obj) || isArguments(obj))) return obj.length === 0;
	return keys(obj).length === 0;
}

// Is a given value a DOM element?
export const isElement = function(obj) {
	return !!(obj && obj.nodeType === 1);
}

// Is a given value an array?
// Delegates to ECMA5's native Array.isArray
export const isArray = Array.isArray || function(obj) {
	return toString.call(obj) === '[object Array]';
}

export const toArray = function(obj) {
	return isArray(obj) ? obj : [obj];
}

// Is a given variable an object?
export const isObject = function(obj) {
	var type = typeof obj;
	return type === 'function' || type === 'object' && !!obj;
}

// Is a given object a finite number?
export const isFinite = function(obj) {
	return isFinite(obj) && !isNaN(parseFloat(obj));
}

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
export const keys = function(obj) {
	if (!isObject(obj)) return [];
	if (nativeKeys) return nativeKeys(obj);
	var keys = [];
	for (var key in obj) if (has(obj, key)) keys.push(key);
	return keys;
}

// Is the given value `NaN`? (NaN is the only number which does not equal itself).
export const isNaN = function(obj) {
	return isNumber(obj) && obj !== +obj;
}

// Is a given value a boolean?
export const isBoolean = function(obj) {
	return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
}

// Is a given value equal to null?
export const isNull = function(obj) {
	return obj === null;
}

// Is a given variable undefined?
export const isUndefined = function(obj) {
	return obj === void 0;
}

// Shortcut function for checking if an object has a given property directly
// on itself (in other words, not on a prototype).
export const has = function(obj, key) {
	return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}


// Keep the identity function around for default iteratees.
export const identity = function(value) {
	return value;
}

// Predicate-generating functions. Often useful outside of Underscore.
export const constant = function(value) {
	return function() {
		return value;
	}
}

export const noop = function() { }

/**
 * Safe chained function
 *
 * Will only create a new function if needed,
 * otherwise will pass back existing functions or null.
 *
 * @param {function} functions to chain
 * @returns {function|null}
 */
export const createChainedFunction = function(...funcs) {
	return funcs
		.filter(f => f != null)
		.reduce((acc, f) => {
			if (typeof f !== 'function') {
				throw new Error('Invalid Argument Type, must only provide functions, undefined, or null.');
			}

			if (acc === null) {
				return f;
			}

			return function chainedFunction(...args) {
				acc.apply(this, args);
				f.apply(this, args);
			};
		}, null);
}

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * This file contains a modified version of:
 * https://github.com/facebook/react/blob/v0.12.0/src/vendor/stubs/EventListener.js
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * TODO: remove in favour of solution provided by:
 *  https://github.com/facebook/react/issues/285
 */

/**
 * Does not take into account specific nature of platform.
 */
export const EventListener = {
  /**
   * Listen to DOM events during the bubble phase.
   *
   * @param {DOMEventTarget} target DOM element to registration listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
	listen(target, eventType, callback) {
	   	if (target.addEventListener) {
	   		target.addEventListener(eventType, callback, false);

	   		return {
	   			remove() {
	   				target.removeEventListener(eventType, callback, false);
	   			}
	   		};
	   	} 
	   	else if (target.attachEvent) {
	   		target.attachEvent('on' + eventType, callback);

	   		return {
	   			remove() {
	   				target.detachEvent('on' + eventType, callback);
	   			}
	   		};
	   	}
	}
}

/**
 * Checks if only one of the listed properties is in use. An error is given
 * if multiple have a value
 *
 * @param props
 * @param propName
 * @param componentName
 * @returns {Error|undefined}
 */
export function createSinglePropFromChecker(arrOfProps) {
  function validate(props, propName, componentName) {
    const usedPropCount = arrOfProps
      .map(listedProp => props[listedProp])
      .reduce((acc, curr) => acc + (curr !== undefined ? 1 : 0), 0);

    if (usedPropCount > 1) {
      const [first, ...others] = arrOfProps;
      const message = `${others.join(', ')} and ${first}`;
      return new Error(
        `Invalid prop '${propName}', only one of the following ` +
        `may be provided: ${message}`
      );
    }
  }
  return validate;
}

export const childrenValueValidation = function (props, propName, componentName) {
	var error = createSinglePropFromChecker('children', 'value')(props, propName, componentName);

	if (!error) 
	{
		error = PropTypes.node(props, propName, componentName);
	}

	return error;
}

export function curry(fn) {
	return (...args) => 
	{
		let last = args[args.length - 1];
		if (typeof last === 'function') {
			return fn(...args);
		}
		return Component => fn(...args, Component);
	};
}

export function prefix(props, variant) {
	invariant
	(
		props.viewClass != null,
		'A `viewClass` prop is required for this component'
	);

	return props.viewClass + (variant ? `-${variant}` : '');
}


function getViewProps(props) {
	return {
		viewClass: props.viewClass,
		viewSize: props.viewSize,
		viewStyle: props.viewStyle,
		viewRole: props.viewRole,
	};
}

function isViewProp(propName) {
	return (
		propName === 'viewClass' ||
		propName === 'viewSize' ||
		propName === 'viewStyle' ||
		propName === 'viewRole'
	);
}

export function splitViewProps(props) {
	const elementProps = {};

	Object.entries(props).forEach(
		([propName, propValue]) => 
		{
			if (!isViewProp(propName)) {
				elementProps[propName] = propValue;
			}
		}
	);

	return [getViewProps(props), elementProps];
}

export let version = React.version.split('.').map(parseFloat);

export function getType(component){
	if( version[0] >= 15 || (version[0] === 0 && version[1] >= 13) )
		return component

	return component.type
}

export function capitalize(string) {
	return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

export function each(obj, cb, thisArg){
	if( Array.isArray(obj)) return obj.forEach(cb, thisArg)

	for(var key in obj) if(has(obj, key))
		cb.call(thisArg, obj[key], key, obj)
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
export function isReactComponent(component) {
	return !!(
		component &&
		component.prototype &&
		component.prototype.isReactComponent
	);
}