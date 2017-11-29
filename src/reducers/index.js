import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import * as DeviceReducers from './device';


const rootReducer = combineReducers(
{
	...DeviceReducers,
	routing,
});

export default rootReducer;
