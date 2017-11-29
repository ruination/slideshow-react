import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { elementType } from 'react-prop-types/lib';
import * as Classes from '../utils/classes';
import * as Utils from '../utils';
import Theme from '../config/theme';
import warning from 'warning';

import {getViewClasses, splitViewProps, prefix} from '../utils/theme';
import { createChainedFunction } from '../utils';

import FormControlFeedback from '../components/FormControlFeedback';
import FormControlStatic from '../components/FormControlStatic';


class FormControl extends Component {
	getInputDOMNode() {
		return findDOMNode(this._input);
	}

	componentDidMount() {
		if (this.props.autoFocus)
			this.getInputDOMNode().focus();
	}

	render() {
		const 
			formGroup = this.context.$formGroup,
			controlId = formGroup && formGroup.controlId,
			{
				viewType: Component,
				viewSize,
				type,
				id = controlId,
				inputRef,
				className,
				...props
			} = this.props,
			ref = c => this._input = c,
			[viewProps, elementProps] = splitViewProps(props)
		;


		warning(
			controlId == null || id === controlId,
			'`controlId` is ignored on `<FormControl>` when `id` is specified.'
		);

		let classes = type !== 'file' ? getViewClasses(viewProps) : {};

		if (viewSize) {
			const size = Theme.SIZES[viewSize] || viewSize;
			classes[prefix({ viewClass: 'input' }, size)] = true;
		}

		return (
			<Component
				{...elementProps}
				type={type}
				id={id}
				ref={createChainedFunction(inputRef, ref)}
				className={Classes.combine(className, classes)}
			>
			</Component>
		);
	}
}

FormControl.propTypes = {
    /**
     * className mappings
     * @private
     */
    viewClass: PropTypes.oneOf(Object.keys(Theme.CLASSES)),
    
    /**
     * Size variants
     * @type {("xsmall"|"small"|"medium"|"large"|"xs"|"sm"|"md"|"lg")}
     */
    viewSize: Theme.PropTypes.viewSize,	

    /**
     * You can use a custom element for this component
     */
	viewType: elementType,    

	/**
	 * Only relevant if `componentClass` is `'input'`.
	 */
	type: PropTypes.string,

	/**
	 * Uses `controlId` from `<FormGroup>` if not explicitly specified.
	 */
	id: PropTypes.string,	

	/**
	 * Attaches a ref to the `<input>` element. Only functions can be used here.
	 *
	 * Example: <FormControl inputRef={ref => { this.input = ref; }} />
	 */
	inputRef: PropTypes.func,	

	/**
	 * When `true` The input will automatically shift focus to itself when it
	 * mounts, and replace it to the last focused element when it unmounts.
	 */
	autoFocus: PropTypes.bool,	
}

FormControl.contextTypes = {
	$formGroup: PropTypes.object,
}

FormControl.defaultProps = {
	viewType: 'input',
	viewClass: 'form-control',
}

FormControl.Feedback = FormControlFeedback;
FormControl.Static = FormControlStatic;

export default FormControl
