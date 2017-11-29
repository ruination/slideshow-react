import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Classes from '../utils/classes';
import * as Utils from '../utils';
import elementType from 'react-prop-types/lib/elementType';

class PageScroll extends Component {
	static contextTypes = {
		ScrollComponent				: elementType,
	}

	render() {
		const 
			props = this.props,
			{
				className,
				viewType: Component,
				children,
				...other
			} = props
		;

		return (
	        <Component {...other} className={Classes.combine('page-scroll', className)}>
				{children}
			</Component>
		)
	}
}

PageScroll.propTypes = {
	viewType: elementType, 
}


PageScroll.defaultProps = {
	viewType: 'div',
}

export default PageScroll
