import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefaultLayout from '../layouts/DefaultLayout';

export default class App extends Component {
	static propTypes = {
		children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node)
        ])
	}

	render() {
		const {children, ...props} = this.props;

		return (
			<DefaultLayout {...props}>
				{children}
			</DefaultLayout>
		);
	}
}
