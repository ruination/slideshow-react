if (process.env.NODE_ENV !== 'production') {
	require('../styles/colahar/mobile.scss');
}

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './stores/configureStore';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

render(
	<Provider store={store}>
		<Router history={history} routes={routes(store)}></Router>
	</Provider>, 
	document.getElementById('app')
);
