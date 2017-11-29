import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { elementType } from 'react-prop-types/lib';
import * as Classes from '../utils/classes';

class Slide extends Component {
	getChildContext() {
		return {
			$slide: {
				aspectRatio: this.props.aspectRatio,
				isVisible: this.props.isVisible,
				isActive: this.props.isActive,
			},
		}
	}

	render() {
		const
			props = this.props, 
			{
				viewType: Component,
				aspectRatio,
				isVisible,
				isActive,
				...other,
			} 	= props
		;

		return (
		    <Component {...other}></Component>
		)
	}
}


Slide.propTypes = {
    /**
     * You can use a custom element for this component
     */
    viewType: elementType,	
}

Slide.defaultProps = {
	viewType: 'div',
}

Slide.childContextTypes = {
	$slide: PropTypes.shape({
		aspectRatio: PropTypes.number,
		isVisible: PropTypes.bool,
		isActive: PropTypes.bool,
	}),
}

class ImageSlide extends Component {
	getChildContext() {
		return {
			$slide: {
				aspectRatio: this.props.aspectRatio,
				isVisible: this.props.isVisible,
				isActive: this.props.isActive,
			},
		}
	}
	
	render() {
		const 
			props = this.props, 
			{
				viewType: Component,
				aspectRatio = 1,
				style: originalStyle,
				isVisible,
				isActive,
				children,
				className,
				src,
				...other,
			} 	= props,
			style = 
			{			
				...originalStyle,
				backgroundImage: src ? `url('${src}')` : null,
				paddingBottom: (100 / aspectRatio) + '%',
			},
			classes =
			{
				'image-slide': true,
			}
		;

		return (
		    <Component
		    	{...other}
		    	style={style}
		    	className={Classes.combine(className, classes)}
	    		>
	    		<div className={Classes.combine("image-slide-content")}>
	    			{children}
	    		</div>
			</Component>
		)
	}
}

ImageSlide.propTypes = {
    /**
     * You can use a custom element for this component
     */
    viewType: elementType,	

	src: PropTypes.string,
	aspectRatio: PropTypes.number,
}

ImageSlide.defaultProps = {
	viewType: 'div',
}

ImageSlide.childContextTypes = {
	$slide: PropTypes.shape({
		aspectRatio: PropTypes.number,
		isVisible: PropTypes.bool,
		isActive: PropTypes.bool,
	}),
}

Slide.Image = ImageSlide;

export default Slide;
