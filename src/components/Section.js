import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Classes from '../utils/classes';
import * as Utils from '../utils';
import * as Device from '../config/device';
import Context from '../config/context';
import Header from '../components/SectionHeader';
import Title from '../components/SectionTitle';
import View from '../components/View';
import Theme from '../config/theme';
import {getViewClasses, splitViewProps} from '../utils/theme';

class Section extends Component {
	static contextTypes = Context.General

	render() {
		const 
			props = this.props,
			{
				className,
				children,
				...other
			} 					= props,
			context = this.context,
			{
				T,
				TC,
				IMAGE,
			} 					= context
		;

		return (
	        <View {...props}>
			</View>
		)
	}
}

Section.contextTypes = Context.General


Section.propTypes = {
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
}

Section.defaultProps = {
	viewClass: 'section',
}


const Block = (props, context) => {
	const 
		{
			className,
			children,
			...other
		} 					= props,
		{
			T,
			TC,
			IMAGE,
			device,
		} 					= context,
		size = Theme.SIZES[device.viewport.size || Device.Size.LG]
	;	

	return (
        <div className={Classes.combine('section-block section-block-' + size, className)}>
			{React.Children.map(children, child => {
		      	if (child && child.props) {
		      		switch (child.props.viewRole) {
		      			case 'title':
		      			{
							return React.cloneElement(child, 
							{
								viewType: "h4",
							});
		      			}

		      			default:
		      				return child
		      		}
		      	}

	      		return child;
		  	})}
		</div>
    )
}

Block.contextTypes = Context.General



const Divider = (props, context) => {
	const 
		{
			className,
			children,
			...other
		} 					= props
	;	

	return (
        <span className="section-divider"></span>
    )
}

const Separator = (props, context) => {
	const 
		{
			className,
			children,
			...other
		} 					= props
	;	

	return (
        <span className="section-separator"></span>
    )
}


Section.Header = Header;
Section.Title = Title;
Section.Block = Block;
Section.Divider = Divider;
Section.Separator = Separator;

export default Section

