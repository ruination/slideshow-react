import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Classes from '../utils/classes';
import * as Utils from '../utils';
import { elementType } from 'react-prop-types/lib';
import Theme from '../config/theme';

import {getViewClasses, splitViewProps, prefix} from '../utils/theme';


class FormControlStatic extends React.Component {
	render() {
		const 
			{
				viewType: Component,
				className,
				...props
			} = this.props,
			[viewProps, elementProps] = splitViewProps(props),
			classes = getViewClasses(viewProps)
		;

		return (
			<Component
				{...elementProps}
				className={Classes.combine(className, classes)}
			>
			</Component>
		);
	}
}

FormControlStatic.propTypes = {
    /**
     * className mappings
     * @private
     */
    viewClass: PropTypes.oneOf(Object.keys(Theme.CLASSES)),

    /**
     * You can use a custom element for this component
     */
	viewType: elementType,
}

FormControlStatic.defaultProps = {
	viewType: 'p',
	viewClass: 'form-control-static'
}

export default FormControlStatic
