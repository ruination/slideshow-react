import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Theme from '../config/theme';
import * as Classes from '../utils/classes';
import Context from '../config/context';

import ValidComponentChildren from '../utils/ValidComponentChildren';
import {splitViewPropsAndOmit, getViewClasses} from '../utils/theme';

class FormGroup extends Component {
	static contextTypes = Context.General

	getChildContext() {
		const 
			{ controlId } = this.props,
			[viewStyle, help] = this.getStyleAndHelp(this.props)
		;

		return {
			$formGroup: {
				controlId,
				viewStyle,
				help,
			},
		};
	}

	getStyleAndHelp(props) {
		let 
			viewStyle = undefined,
			hasFeedback = false,
			help = undefined
		;

		if (props.errors && props.controlId && props.errors[props.controlId]) {
			viewStyle = "error";
			hasFeedback = true;
			help = props.errors[props.controlId];

			if (typeof help !== 'string' && help.length)
				help = help[0];
		}

		if (props.success) {
			viewStyle = "success";
			hasFeedback = true;
			help = props.success;	
		}

		return [viewStyle, help];
	}

	hasFeedback(children) {
		return ValidComponentChildren.some(children, child => (
			child.props.bsRole === 'feedback' ||
			child.props.children && this.hasFeedback(child.props.children)
		));
	}

	render() {
		const 
			{
				viewStyle,
				className,
				children,
				errors,
				success,
				...props
			} = this.props,
			[viewProps, elementProps] = splitViewPropsAndOmit(props, ['controlId']),
			classes = 
			{
				...getViewClasses(viewProps, this.context.device),
				'has-feedback': this.hasFeedback(children),
			},
			[feedbackViewStyle, help] = this.getStyleAndHelp(this.props)
		;

		if (feedbackViewStyle)
			classes[`has-${feedbackViewStyle}`] = true;
		else if (viewStyle)
			classes[`has-${viewStyle}`] = true;

		return (
			<div
				{...elementProps}
				className={Classes.combine(className, classes)}
			>
				{children}
			</div>
		);
	}	
}

FormGroup.propTypes = {
    /**
     * className mappings
     * @private
     */
    viewClass: PropTypes.oneOf(Object.keys(Theme.CLASSES)),

    /**
     * Style variants
     * @type {("default"|"primary"|"success"|"info"|"warning"|"danger"|"link")}
     */
    viewStyle: PropTypes.oneOf(Theme.STYLES),
    
    /**
     * Size variants
     * @type {("xsmall"|"small"|"medium"|"large"|"xs"|"sm"|"md"|"lg")}
     */
	viewSize: Theme.PropTypes.viewSize,

	/**
	 * Sets `id` on `<FormControl>` and `htmlFor` on `<FormGroup.Label>`.
	 */
	controlId: PropTypes.string,
}

FormGroup.childContextTypes = {
	$formGroup: PropTypes.object.isRequired,
}

FormGroup.defaultProps = {
	viewClass: 'form-group',
}

export default FormGroup