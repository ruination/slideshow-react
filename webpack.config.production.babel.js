/* eslint strict: 0 */
'use strict';

const webpack = require('webpack');
import config, {
	SYSTEM,
} from './webpack.config.base.babel';
const ExtractTextPlugin  = require('extract-text-webpack-plugin');

SYSTEM.URL = 'www.colahar.co';

config.entry = Object.assign(config.entry, {
	'js/app': [
		'babel-polyfill',
		`${SYSTEM.APP_DIR}/index`
	],
	'css': [`${SYSTEM.SASS_DIR}/mobile.scss`],
});

config.module.loaders.push(
	// { test: /\.scss$/, loaders: ['style-loader', `css-loader?minimize`, 'sass-loader']},
	{ test: /\.scss$/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?minimize!sass-loader' }) },
	{ test: /\.(png|jpe?g|gif)$/, loader: `url-loader?name=https://${SYSTEM.URL}/images/[name].[ext]&limit=1000&context=./public` },
	{ test: /\.(woff2?|eot|ttf|svg)(\?.*)?$/, loader: `url-loader?name=https://${SYSTEM.URL}/fonts/[name].[ext]&limit=1000` },
);

config.plugins.push(
	new webpack.optimize.CommonsChunkPlugin({ name: 'pkg', filename: 'js/pkg.js', minChunks: Infinity }),
	new webpack.NoEmitOnErrorsPlugin(),
	new webpack.DefinePlugin({
		__DEV__: false,
		'process.env': 
		{
			TARGET: JSON.stringify(process.env.TARGET),
			URL: JSON.stringify(SYSTEM.URL),
			URL_SCREENERS: JSON.stringify(SYSTEM.URL_SCREENERS),
			NODE_ENV: JSON.stringify('production')
		}
	}),
	new webpack.optimize.UglifyJsPlugin({
		compressor: {
			screw_ie8: true,
			warnings: false
		}
	}),
	new ExtractTextPlugin({ filename: '[name].css', disable: false, allChunks: true }) 
);

module.exports = config;