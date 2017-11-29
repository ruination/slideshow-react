import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { elementType } from 'react-prop-types/lib';
import * as Classes from '../utils/classes';
import * as Utils from '../utils';
import Theme from '../config/theme';

import {getViewClasses, splitViewProps, prefix} from '../utils/theme';

import Icon from '../components/Icon';


class FormControlFeedback extends Component {
	getGlyph(viewStyle) {
		switch (viewStyle) {
			case 'success': return 'ok';
			case 'warning': return 'attention-alt';
			case 'error': return 'cancel-2';
			default: return null;
		}
	}

	renderDefaultFeedback(formGroup, className, classes, elementProps) {
		const 
			glyph = this.getGlyph(formGroup && formGroup.viewStyle),
			help = formGroup.help,
			Glyphicon = this.props.iconType
		;

		if (!glyph)
			return null;

		return (
	        <span>
				<Glyphicon
			    	formControlFeedback
					glyph={glyph}
			    	>
			    </Glyphicon> 
			    {help && <span className="help-block">{help}</span>}
		    </span>
	   )
	}

	render() {
		const 
			{
				className,
				viewRole,
				children,
				...props
			} = this.props,
			[viewProps, elementProps] = splitViewProps(props),
			classes = getViewClasses(viewProps)
		;

		if (!children) {
			return this.renderDefaultFeedback(
				this.context.$formGroup, className, classes, elementProps
			);
		}

		const child = React.Children.only(children);
		return React.cloneElement(child, {
			...elementProps,
			className: Classes.combine(child.props.className, className, classes),
		});
	}

}

FormControlFeedback.propTypes = {
    /**
     * className mappings
     * @private
     */
    viewClass: PropTypes.oneOf(Object.keys(Theme.CLASSES)),

    /**
     * You can use a custom icon for this component
     */
	iconType: elementType,
}

FormControlFeedback.contextTypes = {
	$formGroup: PropTypes.object,
}

FormControlFeedback.defaultProps = {
	viewRole: 'feedback',
	viewClass: 'form-control-feedback',
	iconType: Icon,
}

export default FormControlFeedback
