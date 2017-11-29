import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { hashHistory } from 'react-router';
import { routerMiddleware, push } from 'react-router-redux';
import rootReducer from '../reducers';
import Monitor from '../containers/Monitor';

import * as DeviceActions from '../actions/device';


const actionCreators = {
	...DeviceActions,
  	push,
};

const logger = createLogger({
	level: 'info',
	collapsed: true,
});

const router = routerMiddleware(hashHistory);

const enhancer = compose(
	applyMiddleware(
	    thunk, 
	    router, 
	    logger
    ),
	// Monitor.instrument(),
	// persistState(
	// 	window.location.href.match(
	// 		/[?&]debug_session=([^&]+)\b/
	// 	)
	// ),
	window.devToolsExtension ? window.devToolsExtension({ actionCreators }) : noop => noop
);

export default function configureStore(initialState) {
	const store = createStore(rootReducer, initialState, enhancer);

	if (window.devToolsExtension) {
		window.devToolsExtension.updateStore(store);
	}

	if (module.hot) {
		module.hot.accept('../reducers', () =>
			store.replaceReducer(require('../reducers'))
		);
	}

	return store;
}