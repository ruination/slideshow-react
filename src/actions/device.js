import {
	REORIENT_DEVICE
} from '../actiontypes/device'

export function reorientDevice(device) {
	return {
		type: REORIENT_DEVICE,
		device: device,
		receivedAt: Date.now(),
	}
}

function shouldReorientDevice(state, device) {
	if (		state.device.height == device.height 
			&& 	state.device.width == device.width 
	    	&& 	state.device.viewport.height == device.viewport.height 
	    	&& 	state.device.viewport.width == device.viewport.width)
		return false

	return true
}

export function deviceOrientationChanged(deviceConfig = {}) {
	return (dispatch, getState) => {
		const 
			dpr = window.devicePixelRatio,
			device = {
				width 		: window.screen.width,
				height 		: window.screen.height,
				screen	: 
				{
					width 		: window.innerWidth,
					height 		: window.innerHeight,
				},
				viewport	: 
				{
					width 		: Math.min(window.innerWidth, window.screen.width),
					height 		: Math.min(window.innerHeight, window.screen.height),
				},
				dpr,
				...deviceConfig,
			}
		;

		if (shouldReorientDevice(getState(), device)) {
			return dispatch(reorientDevice(device))
		}
	}
}
