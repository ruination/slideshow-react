import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Classes from '../utils/classes';
import * as Utils from '../utils';

class PageLayout extends Component {
	render() {
		const 
			props = this.props,
			{
				className,
				children,
				...other
			} = props
		;

		return (
	        <div {...other} className={Classes.combine('page-layout', className)}>
				{children}
			</div>
		)
	}
}

export default PageLayout
