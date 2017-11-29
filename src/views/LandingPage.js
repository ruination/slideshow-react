import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageContent from '../containers/PageContent';
import BaseComponent from '../components/BaseComponent';
import * as Classes from '../utils/classes';
import * as Utils from '../utils';
import * as Device from '../config/device';
import * as Storage from '../utils/storage';
import Context from '../config/context';

import Slideshow from '../components/Slideshow';
import Slide from '../components/Slide';
import Link from '../components/Link';


class LandingPage extends BaseComponent {
	static contextTypes = Context.General

	constructor(props) {
  		super(props);
	}

	componentDidMount() {
		this.fetchData(this.props, this.context);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.fetchData(nextProps, nextContext);
	}	

	fetchData(props, context) {

	}

	render() {
		const 
			props = this.props,
 			{
 				gridCategoryColumns,
 				gridColumns,
				visibleSlidesPortrait,
				categorys,
				device,
				T,
				TC,
				IMAGE,
				...other,
			} 						= props,
			isMobile 				= device.isMobile,
			viewportAspectRatio		= device.viewport.width / device.viewport.height,
			jumbotronAspectRatio  	= viewportAspectRatio,
			slide1Image = IMAGE('slider/slider1.jpeg'),
			slide2Image = IMAGE('slider/slider2.jpeg'),
			slide3Image = IMAGE('slider/slider3.jpeg'),
			slide4Image = IMAGE('slider/slider4.jpeg'),
			bkgPosX	= Math.round(Math.random() * 200),
			bkgPosY	= Math.round(Math.random() * 100)
		;

		return (
			<PageContent {...props}>
				<Slideshow
					aspectRatio={jumbotronAspectRatio}
					navigationAutomatic={false}
					navigationAlways={true}
					navigationSpeed={30000}
					visibleSlides={1}
					preloadSlides={1}
					previewSlides={0}
					navigationInfinite={true}
					className="landing"
					>
				   			
					{/************************************************/}
					{/**** Slide1 -                               ****/}
				    {/************************************************/}	
					<Slide.Image src={slide1Image} className="landing-1">
					</Slide.Image>
					<Slide.Image src={slide2Image} className="landing-2"></Slide.Image>
					<Slide.Image src={slide3Image} className="landing-3"></Slide.Image>
					<Slide.Image src={slide4Image} className="landing-4"></Slide.Image>
				</Slideshow>

				<Slideshow
					aspectRatio={9/16}
					navigationAutomatic={true}
					navigationAlways={true}
					navigationSpeed={10000}
					visibleSlides={visibleSlidesPortrait}
					preloadSlides={2}
					previewSlides={0}
					navigationInfinite={true}
					className="landing-girls"
					>
				   			
					{/************************************************/}
					{/**** Slide1 - Girls                         ****/}
				    {/************************************************/}	
					<Slide.Image src={IMAGE('slider/girl (1).jpeg')} className="landing-girl-1"></Slide.Image>
					<Slide.Image src={IMAGE('slider/girl (2).jpeg')} className="landing-girl-2"></Slide.Image>
					<Slide.Image src={IMAGE('slider/girl (3).jpeg')} className="landing-girl-3"></Slide.Image>
					<Slide.Image src={IMAGE('slider/girl (4).jpeg')} className="landing-girl-4"></Slide.Image>
					<Slide.Image src={IMAGE('slider/girl (5).jpeg')} className="landing-girl-5"></Slide.Image>
					<Slide.Image src={IMAGE('slider/girl (6).jpeg')} className="landing-girl-6"></Slide.Image>
					<Slide.Image src={IMAGE('slider/girl (7).jpeg')} className="landing-girl-7"></Slide.Image>
				</Slideshow>					
			</PageContent>
		)
	}
}

export default LandingPage;
