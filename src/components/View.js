import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Classes from '../utils/classes';
import Context from '../config/context';
import Theme from '../config/theme';
import { prefix } from '../utils';
import * as Device from '../config/device';
import {getViewClasses, splitViewProps} from '../utils/theme';

class View extends Component {
	static contextTypes = Context.General

	render() {
		const 
			context = this.context,
			{
				device,
			} 	= context,		
			props = this.props,
			{
				children,
				className,
				viewType : Component,
				viewSize = Theme.SIZES[device.viewport.size],
				...other,
			} = props,
			[viewProps, elementProps]	= splitViewProps(props),
			{
				viewPropagate,
				viewType,
				...childProps,
			} = viewProps
		;

		viewProps.viewSize = viewSize;

		const viewClasses = viewPropagate ? undefined : getViewClasses(viewProps, device);

		if (viewClasses && viewProps.viewClass == 'btn' && viewProps.viewStyle == 'link')
			viewClasses['btn'] = false;

		return (
			<Component {...elementProps} className={Classes.combine(viewClasses, className)}>
		        {viewPropagate && (() => {
					return React.Children.map(children, child => {
						if (!child)
							return null;

						const isBasicElement = !!child.type && !!child.type.toLowerCase && child.type.toLowerCase() === child.type;

				      	if (child && child.props)
					      	return React.cloneElement(child, isBasicElement ? child.props : {...childProps, ...child.props});
			      		
				      	return <Component>{child}</Component>;
				  	});
	         	})()}
	         	{!viewPropagate && children}
			</Component>
		)
	}
}

View.propTypes = {
	viewType: PropTypes.string
}

View.defaultProps = {
	viewStyle: "default",
	viewType: "div",
	viewPropagate: false,
	viewClass: 'view',
}

export default View