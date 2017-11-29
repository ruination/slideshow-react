import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { elementType } from 'react-prop-types/lib';
import * as Classes from '../utils/classes';
import * as Utils from '../utils';
import Context from '../config/context';
import {getViewClasses, splitViewProps} from '../utils/theme';

class Button extends Component {
	static contextTypes = Context.General
	
	constructor(props, context) {
  		super(props, context);

  		this.renderAnchor = this.renderAnchor.bind(this);
  		this.renderButton = this.renderButton.bind(this);
  		this.renderNavItem = this.renderNavItem.bind(this);
	}

	render() {
		const 
			[viewProps, elementProps]	= splitViewProps(this.props)
		;

	 	var classes = this.props.navDropdown ? {} : getViewClasses(viewProps, this.context.device);
	 	var renderFuncName;

	 	classes = {
	 		'active': this.props.active,
	 		'btn-block': this.props.block,
	 		...classes
 		};

 		if (viewProps.viewStyle == 'link')
 			classes['btn'] = false;
	 	
	 	if (this.props.navItem) {
	 		return this.renderNavItem(classes);
	 	}

	 	renderFuncName = this.props.href || this.props.target || this.props.navDropdown ?
	 	'renderAnchor' : 'renderButton';

	 	return this[renderFuncName](classes);
	}

	renderAnchor(classes) {
	 	var Component = this.props.viewType || 'a';
	 	var href = this.props.href || '#';
	 	classes.disabled = this.props.disabled;

	 	return (
	 		<Component
		 		{...this.props}
		 		href={href}
		 		className={Classes.combine(this.props.className, classes)}
		 		role="button">
		 		{this.props.children}
 			</Component>
 		);
	}

	renderButton(classes) {
	 	var Component = this.props.viewType;
	 	const 
		 	{
		 		viewType,
				active,
				block,
				viewClass,
				viewStyle,
				viewSize,
				closeButton,
				disabled,
				className,
				navItem,
				navDropdown,
				children,
		 		...props,
		 	} = this.props;

	 	return (
	 		<Component
		 		{...props}
		 		disabled={disabled}
		 		type={props.type || 'button'}
		 		className={Classes.combine(classes, className)}>
		 		{children}
			</Component>
 		);
	}

	renderNavItem(classes) {
	 	var liClasses = {
	 		active: this.props.active
	 	};

	 	return (
	 		<li className={Classes.combine(liClasses)}>
	 			{this.renderAnchor(classes)}
	 		</li>
 		);
	}
}

Button.propTypes = {
	active: PropTypes.bool,
	disabled: PropTypes.bool,
	block: PropTypes.bool,
	navItem: PropTypes.bool,
	navDropdown: PropTypes.bool,

    /**
     * You can use a custom element for this component
     */
    viewType: elementType,
    href: PropTypes.string,
    target: PropTypes.string,

    /**
     * Defines HTML button type Attribute
     * @type {("button"|"reset"|"submit")}
     * @defaultValue 'button'
     */
    type: PropTypes.oneOf(['button', 'reset', 'submit'])
}

Button.defaultProps = {
	viewType: 'button',
	active: false,
	block: false,
	viewClass: 'btn',
	viewStyle: 'default',
	disabled: false,
	navItem: false,
	navDropdown: false
}


class ButtonSubmit extends Component {
	constructor(props) {
  		super(props);
  
  		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(event) {
		if (this.props.onSubmit)
			this.props.onSubmit(event, this.props.onHide);
	}

	render() {
		var {onSubmit, ...other} = this.props;

		return <Button type="submit" {...other} onClick={Utils.createChainedFunction(this.props.onClick, this.onSubmit)}>{this.props.children}</Button>;
	}
}

Button.Submit = ButtonSubmit;

export default Button
