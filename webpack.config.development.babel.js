/* eslint strict: 0 */
'use strict';

const webpack = require('webpack');
import config, {
	SYSTEM,
} from './webpack.config.base.babel';

SYSTEM.HOT_URL = process.env.TARGET === 'electron' || process.env.TARGET === 'local' 
	? 'localhost' 
	: process.env.TARGET === "vm" 
		? "127.0.0.1" 
		: SYSTEM.URL
	;

SYSTEM.URL = process.env.TARGET === 'electron' || process.env.TARGET === 'local' 
	? `localhost`
	: process.env.TARGET === "vm" 
		? "localhost" 
		: SYSTEM.URL
	;

config.entry = Object.assign(config.entry, {
	'js/app': [
		`webpack-hot-middleware/client?path=http://${SYSTEM.HOT_URL}:${SYSTEM.PORT}/__webpack_hmr`, 
		'babel-polyfill',
		`${SYSTEM.APP_DIR}/index`
	],
});

config.module.loaders.push(
	{ test: /\.(png|jpe?g|gif)$/, loader: `url-loader?name=http://${SYSTEM.HOT_URL}:${SYSTEM.PORT}/images/[name].[ext]&limit=100000&context=./public` },
	{ test: /\.(woff2?|eot|ttf|svg)(\?.*)?$/, loader: `url-loader?name=http://${SYSTEM.HOT_URL}:${SYSTEM.PORT}/fonts/[name].[ext]&limit=100000&context=./public` },
	{ test: /\.scss$/, loaders: ['style-loader', 'css-loader?sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'sass-loader?sourceMap']}
);


config.plugins.push(
	new webpack.optimize.CommonsChunkPlugin({ name: 'pkg', filename: 'js/pkg.js' }),
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NoEmitOnErrorsPlugin(),
	new webpack.DefinePlugin({
		__DEV__: true,
		'process.env': 
		{
			TARGET: JSON.stringify(process.env.TARGET),
			URL: JSON.stringify(SYSTEM.URL),
			URL_SCREENERS: JSON.stringify(SYSTEM.URL_SCREENERS),
			NODE_ENV: JSON.stringify('development')
		}
	}),
	new webpack.IgnorePlugin(/vertx/),
);

if (process.env.TARGET == 'electron') {
	// const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
	
	// config.target = webpackTargetElectronRenderer(config);
	config.target = 'electron-renderer';
}

module.exports = {SYSTEM, config};
