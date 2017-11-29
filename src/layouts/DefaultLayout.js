import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DefaultLayout from '../views/DefaultLayout';
import * as DeviceActions from '../actions/device';
import * as Utils from '../utils';
import * as Device from '../config/device';
import * as URL from '../utils/url';

function mapStateToProps(state, props) {
	const
		device					= state.device,
		deviceSize				= device.viewport.size,
		visibleSlidesPortrait	=
			(deviceSize == Device.Size.SS ? 2 : 
			(deviceSize == Device.Size.XS ? 3 : 
			(deviceSize == Device.Size.SM ? 4 : 
			(deviceSize == Device.Size.MD ? 5 : 
 					/* Device.Size.LG */	6)))),
		previewSlides			= 
			(deviceSize == Device.Size.SS ? 0*0.10*3*60 : 
			(deviceSize == Device.Size.XS ? 0*0.20*2*60 : 
			(deviceSize == Device.Size.SM ? 0*0.7*((2/3)*2)*60 : 
			(deviceSize == Device.Size.MD ? 0.9*((3/4)*1.35)*60 : 
 					/* Device.Size.LG */	1.25*((4/5)*1)*60)))),
		preloadSlides			= visibleSlidesPortrait + 1
	;

	return {
		ASSET: URL.getAsset(state),
		IMAGE: URL.getImageAsset(state),
		hasTitlebar: process.env.TARGET == 'electron',
		device,
		deviceSize,
		visibleSlidesPortrait,
		previewSlides,
		preloadSlides,
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
	{
		...DeviceActions,
	}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
