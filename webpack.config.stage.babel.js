/* eslint strict: 0 */
const webpack = require('webpack');
import config, {
	SYSTEM,
} from './webpack.config.base.babel';

// import LiveReloadPlugin from 'webpack-livereload-plugin';

config.entry = Object.assign(config.entry, {
	'js/app': [
		'babel-polyfill',
		`${SYSTEM.APP_DIR}/index`
	],
});

config.module.loaders.push(
	{ test: /\.scss$/, loaders: ['style-loader', `css-loader?sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]`, 'sass-loader?sourceMap']},
	{ test: /\.(png|jpe?g|gif)$/, loader: `url-loader?name=https://${SYSTEM.URL}/images/[name].[ext]&limit=1000&context=./public` },
	{ test: /\.(woff2?|eot|ttf|svg)(\?.*)?$/, loader: `url-loader?name=https://${SYSTEM.URL}/fonts/[name].[ext]&limit=1000` }
);

config.plugins.push(
	// new LiveReloadPlugin({port: SYSTEM.LR_PORT}),
	new webpack.optimize.CommonsChunkPlugin({ name: 'pkg', filename: 'js/pkg.js', minChunks: Infinity }),
	new webpack.NoEmitOnErrorsPlugin(),
	new webpack.DefinePlugin({
		__DEV__: true,
		'process.env': 
		{
			TARGET: JSON.stringify(process.env.TARGET),
			URL: JSON.stringify(SYSTEM.URL),
			URL_SCREENERS: JSON.stringify(SYSTEM.URL_SCREENERS),
			NODE_ENV: JSON.stringify('stage')
		}
	})
);

module.exports = config;
