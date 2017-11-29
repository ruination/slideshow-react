import PropTypes from 'prop-types';

export default  
{
	Member: 
	{
		T: PropTypes.func,
		TC: PropTypes.func,
		IMAGE: PropTypes.func,
		device: PropTypes.object,
		channel: PropTypes.object,
		channels: PropTypes.object,
		subscription: PropTypes.object,
		subscriptions: PropTypes.object,
		page: PropTypes.object,
		location: PropTypes.object,
		layout: PropTypes.object,
		isContextScreeners: PropTypes.func,
		getPlaceholders: PropTypes.func,
	},

	General: 
	{
		T: PropTypes.func,
		TC: PropTypes.func,
		IMAGE: PropTypes.func,
		channel: PropTypes.object,
		device: PropTypes.object,
		page: PropTypes.object,
		location: PropTypes.object,
		layout: PropTypes.object,
		isContextScreeners: PropTypes.func,
		getPlaceholders: PropTypes.func,
	},

	Navigation:
	{
		T: PropTypes.func,
		TC: PropTypes.func,
		IMAGE: PropTypes.func,
		page: PropTypes.object,
		route: PropTypes.object,
		device: PropTypes.object,
		channel: PropTypes.object,
		channels: PropTypes.object,
		location: PropTypes.object,
		subscription: PropTypes.object,
		subscriptions: PropTypes.object,
		layout: PropTypes.object,
		router: PropTypes.object,
		isContextScreeners: PropTypes.func,
		getPlaceholders: PropTypes.func,
	},
}