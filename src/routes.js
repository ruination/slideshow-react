import React from 'react';
import { Route, IndexRoute } from 'react-router';

export default (store) => ({
	path: '/',

	getChildRoutes(partialNextState, callback) {
		require.ensure([], function (require) {
			callback(null, [
			])
		})
	},

	getIndexRoute(partialNextState, callback) {
		require.ensure([], function (require) {
			callback(null, {
				component: require('./pages/LandingPage'),
			})
		})
	},

	getComponents(nextState, callback) {
		require.ensure([], function (require) {
			callback(null, require('./containers/App'))
		})
	}
})
