import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LandingPage from '../views/LandingPage';

function mapStateToProps(state, props) {
	const
		{
			
		} = props
	;

	return {
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
	{
	}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
