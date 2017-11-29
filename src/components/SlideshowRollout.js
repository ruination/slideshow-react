import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Classes from '../utils/classes';
import * as Device from '../config/device';
import BaseComponent from '../components/BaseComponent';
import Context from '../config/context';
import WindowComponent from '../components/WindowComponent';
import Slideshow from '../components/Slideshow';

class SlideshowRollout extends BaseComponent {
	static contextTypes = Context.General

	constructor(props, context) {
  		super(props, context);

  		this._bind(
  			"onFocused",
  			"onUnfocused",
   		)
 	}

 	onFocused() {
 		this.props.onShow("!childopen");
 	}

 	onUnfocused() {
 		this.props.onHide();
 	}

	render() {
		const 
			props = this.props,
			{
				transition,
				show,
				...other,
			} = props,
			context = this.context,
			{
				T,
				TC,
				IMAGE,
				device,
			} 					= context
		;

		return (
	       <Slideshow
				{...other}
				focusedRolloutEnabled={false}
				onFocused={this.onFocused}
				onUnfocused={this.onUnfocused}
				isFocusedRollout={transition !== WindowComponent.EXITED}
				isShowingRollout={transition > WindowComponent.ENTER}
				rolloutHeight={transition > WindowComponent.ENTER ? device.viewport.height : null}
				rolloutDuration={300 * device.viewport.height / 720}
				>
			</Slideshow>
		)
	}
}

export default WindowComponent(SlideshowRollout)