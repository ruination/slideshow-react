import React from 'react';
import PropTypes from 'prop-types';
import { elementType } from 'react-prop-types/lib';
import * as Classes from '../utils/classes';
import Context from '../config/context';

const LoadingMessage = (props, context) => {
	const 
		{
			children,
			disabled,
			className,
			viewType: Component,
			...other,
		} = props,
		{
			T,
			TC,
			IMAGE,
		} 	= context,
		classes =
		{
			'loading-message': true,
			'loading-disabled': disabled,
		}
	;

	return (
	    <Component className={Classes.combine(className, classes)}>	    	
	    	<i className="icon icon-spin4 icon-spin"></i>
	    	{children}
		</Component>
	)
}

LoadingMessage.contextTypes = Context.General

LoadingMessage.propTypes = {
	disabled: PropTypes.bool,

    /**
     * You can use a custom element for this component
     */
    viewType: elementType,
}
LoadingMessage.defaultProps = {
	viewType: 'span',
	disabled: false,
}

export default LoadingMessage;