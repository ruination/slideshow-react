import {
	REORIENT_DEVICE
} from '../actiontypes/device'

import * as Device from '../config/device'

export function device(state = {
	width: 1920,
	height: 1080,
	size: Device.Size.LG,
	orientation: Device.Orientation.Landscape,
	viewport: 
	{
		width: 1920,
		height: 1080,
		size: Device.Size.LG,
		orientation: Device.Orientation.Landscape,
	},
}, action) {
	switch (action.type) {
		case REORIENT_DEVICE: 
			const 
				deviceSize = Device.calculateSize(action.device.width, action.device.height),
				viewportSize = Device.calculateSize(action.device.viewport.width, action.device.viewport.height),
				orientation = action.device.width < action.device.height ? Device.Orientation.Portrait : Device.Orientation.Landscape
			;

			return Object.assign({}, state, {
				width: action.device.width,
				height: action.device.height,
				size: deviceSize,
				orientation,
				viewport: {
					width: action.device.viewport.width,
					height: action.device.viewport.height,
					size: Math.min(viewportSize, deviceSize),
					orientation: action.device.viewport.width < action.device.viewport.height ? Device.Orientation.Portrait : Device.Orientation.Landscape,					
				},
				isMobile: viewportSize <= Device.Size.SM,
				isLandscape: orientation == Device.Orientation.Landscape,
				isPortrait: orientation == Device.Orientation.Portrait,
				lastUpdated: action.receivedAt,
			})
		default:
			return state
	}
}
