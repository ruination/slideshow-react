/* eslint strict: 0 */
'use strict';

const path = require('path');

const BUILD_DIR = path.resolve(__dirname, './public/');
const SASS_DIR = path.resolve(__dirname, './styles');
const APP_DIR = path.resolve(__dirname, './src');
const ROOT_DIR = path.basename(path.join(__dirname, '/./'));
const PORT = 35729;
const URL =  `localhost`;
const HOT_URL = `localhost`;

export const SYSTEM = {
	BUILD_DIR,
	SASS_DIR,
	APP_DIR,
	ROOT_DIR,
	PORT,
	URL,
	HOT_URL,
}

export default {
	entry: {
		pkg: 
		[	
			"react", "react-dom", "react-redux", "react-router", "react-router-redux",
			"react-overlays", "react-prop-types", "react-addons-perf", "react-transition-group",
			"create-react-class", "react-addons-css-transition-group",

			"redux", "redux-promise", "redux-thunk",
			"redux-devtools", "redux-devtools-dock-monitor", "redux-devtools-log-monitor", "redux-logger", 

			"lodash.throttle", "lodash.difference", "lodash.debounce", "lodash.foreach",
			"babel-polyfill", "dom-helpers",
			
			"invariant", "warning", "uncontrollable",

			"keycode", "jbinary", "js-cookie", "iframe-resizer", "interact.js", "moment",
			"webworkify-webpack", "url-toolkit", "fingerprintjs", "axios",

			"element-resize-detector",
			
			"webworkify", "hls.js/lib", 
		]
	},

	output: 
	{
		path: BUILD_DIR,
		filename: '[name].js',
	},


	module: 
	{
		loaders: [
			{ test: /\.jsx?$/, loaders: ['babel-loader'], exclude: /node_modules/ },
			{ test: /\.json$/, loader: 'json-loader' }
		]
	},

	plugins: [],
	externals: [],
};