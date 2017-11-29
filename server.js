/* eslint strict: 0, no-console: 0 */
'use strict';
 
const express = require('express');
const webpack = require('webpack');
import {SYSTEM, config} from './webpack.config.development.babel';

const app = express();
const compiler = webpack(config);

app.engine('html', require('ejs').renderFile);

app.use(require('webpack-dev-middleware')(compiler, 
{
	hot: true,
	publicPath: config.output.publicPath,
	noInfo: true, 
	stats: {
		colors: true
	}
}));

app.use(require('webpack-hot-middleware')(compiler, 
{
	log: console.log,
		path: '/__webpack_hmr',
		heartbeat: 10 * 1000,
}));

app.use(express.static(__dirname + '/public'));

app.listen(SYSTEM.PORT, SYSTEM.HOT_URL, err => {
	if (err) {
		console.log(err);
		return;
	}

	console.log(`Listening at http://${SYSTEM.HOT_URL}:${SYSTEM.PORT}`);
});

app.get('/', function (req, res) {
	res.render(__dirname+'/src/app.html', {url: SYSTEM.URL, process});
});
