import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Classes from '../utils/classes';

const Icon = (props) => {
	let iconClassName = {};

	iconClassName[props.viewClass] = true;
	iconClassName['icon-' + props.glyph] = true;
	iconClassName['form-control-feedback'] = props.formControlFeedback;

	return (
		<span className={Classes.combine(props.className, iconClassName)}>
			{props.children}
		</span>
	)
}

Icon.propTypes = {
	/**
     * className mappings
	 * @private
	 */
	viewClass: PropTypes.string,

	/**
	 * An icon name.
	 */
	glyph: PropTypes.string.isRequired,

	/**
	 * Adds 'form-control-feedback' class
	 * @private
	 */
	formControlFeedback: PropTypes.bool
}

Icon.defaultProps = {
	viewClass: 'icon',
	formControlFeedback: false
}

export default Icon