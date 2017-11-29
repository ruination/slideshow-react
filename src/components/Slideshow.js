import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import throttle from 'lodash.throttle';
import BaseComponent from '../components/BaseComponent';
import ViewSwipeable from '../components/ViewSwipeable';
import * as Utils from '../utils';
import * as Classes from '../utils/classes';
import Supports from '../utils/supports';

class Slideshow extends BaseComponent {
	constructor(props, context) {
		super(props, context);

		this._handleResize = function() {
			const 
				slidesWidth = findDOMNode(this).offsetWidth || this.state.slidesWidth,
				previewSlides = this.props.previewSlides > 1 
					? this.props.visibleSlides * this.props.previewSlides / (slidesWidth - 2*this.props.previewSlides) 
					: this.props.previewSlides
				,
				animationTime = !this.state.slidesWidth 
					? 0 
					: this.props.animationSpeed
			;			

			if (slidesWidth != this.state.slidesWidth || previewSlides != this.state.previewSlides) {
				this.setState({
					slidesWidth,
					previewSlides,
					animationTime,
				})		

				if (!animationTime)
					this.resetAnimationSpeed();
			}
		}.bind(this);
		
  		this.handleResize = throttle(this._handleResize, 1000, {'leading': false, 'trailing': true })

		this.handleMouseOver = throttle(function(event) {
			if (!this.state.mouseHover)
				this.setState({
					mouseHover: true,
				})
		}.bind(this), 250, {'leading': true, 'trailing': false })

		this.handleMouseLeave = throttle(function(event) {
			if (this.state.mouseHover)
				this.setState({
					mouseHover: false,
				})
		}.bind(this), 150, {'leading': false, 'trailing': true })

		const 
			{
				initialSlide,
				animationSpeed,
				randomStart,
				visibleSlides,
				children,
				previewSlides,
			} = this.props,
			totalChildren = React.Children.count(children),
			randomStartSlide = Math.random() * totalChildren - visibleSlides,
			currentSlide = randomStart 
				? Math.round(
		            totalChildren <= visibleSlides 
			            ? 0 
			            : Math.max(1, randomStartSlide)
	            ) % totalChildren
				: initialSlide
		;

		this.state = {
			currentSlide: currentSlide,
			animationTime: 0,
			slidesWidth: 0,
			swiping: false,
			focusedSlide: undefined,
			swipeX: 0,
			isAnimating: false,
			mouseHover: false,
			previewSlides: previewSlides > 1 ? 0.1 : previewSlides,
			preloadSlides: this.props.preloadSlides,
		}

		this._bind(
			"resetAnimationSpeed",
			"setupNavigationInterval",
			"cancelNavigationInterval",
			"goToSlide",
			"animationTimedout",
			"nextSlide",
			"previousSlide",
			"handleClick",
			"handleSwipe",
			"handleSwiping",
			"setFocusedSlide",
			"onFocused",
			"onUnfocused",
			"disableFocusedState",
			"disableFocusedSlide",
       )
	}

	resetAnimationSpeed() {		
		if (this._resetAnimation) {
			clearTimeout(this._resetAnimation);
		}

		this._resetAnimation = setTimeout((() => {
			this.setState({
				animationTime: this.props.animationSpeed ? this.props.animationSpeed : 0,
			})

			this._resetAnimation = null;
		}).bind(this), 20);		
	}

	setupNavigationInterval() {
		this.cancelNavigationInterval();

		this.navigationInterval = setInterval(function() {
			if (this.props.navigationAutomatic) {
				const advanceSlides = this.props.automaticAdvanceSlides || this.props.visibleSlides;

				if (!this.state.mouseHover || this.props.navigationAlways)
					this.nextSlide(null, advanceSlides);
			}
			else {
				this.handleResize();
			}
		}.bind(this), this.props.navigationSpeed)
	}

	cancelNavigationInterval() {
		if (this.navigationInterval)
			clearInterval(this.navigationInterval);
	}
	
	componentWillReceiveProps(nextProps) {
		if (	nextProps.navigationAutomatic != this.props.navigationAutomatic 
		    || 	nextProps.navigationInterval != this.props.navigationInterval )
		    this.setupNavigationInterval();

		const 
			totalChildren = React.Children.count(nextProps.children),
			hasChildrenChanged = totalChildren != React.Children.count(this.props.children)
		;

		if (this.props.isFocusedRollout && !nextProps.isFocusedRollout && this.state.focusedSlide !== undefined) {
			this.setState({
				swiping: false,
				focusedSlide: undefined,
				swipeX: 0,
				isAnimating: false,
				mouseHover: false,
				animationTime: 0,
			})

			this.resetAnimationSpeed();
		}
		else if (!this.props.isFocusedRollout && nextProps.isFocusedRollout && this.state.focusedSlide === undefined) {
			this.setFocusedSlide(this._pendingFocusedSlide, true);
		}

		if (	nextProps.preloadSlides != this.props.preloadSlides
		    ||	nextProps.visibleSlides != this.props.visibleSlides
		    || 	hasChildrenChanged ) 
		{
			if (hasChildrenChanged)
			{
			    this.setState({
			    	currentSlide: nextProps.navigationInfinite 
			    		? this.state.currentSlide
			    		: Math.max(0, Math.min(totalChildren - nextProps.visibleSlides, this.state.currentSlide))
			    	,
					swiping: false,
					focusedSlide: undefined,
					swipeX: 0,
					isAnimating: false,
					mouseHover: false,
					animationTime: 0,
					preloadSlides: nextProps.preloadSlides,
				});
			}
			else
			{
			    this.setState({
					animationTime: 0,
					preloadSlides: nextProps.preloadSlides,
				});
			}

			this.resetAnimationSpeed();
		}

		if (	nextProps.previewSlides && nextProps.previewSlides > 1 ) {
			const
				slidesWidth = findDOMNode(this).offsetWidth || this.state.slidesWidth,
				previewSlides = this.props.visibleSlides * nextProps.previewSlides / (slidesWidth - 2*nextProps.previewSlides)
			;

			this.setState({
				slidesWidth,
				previewSlides,
			})
		}
		else if (	nextProps.previewSlides === undefined && this.props.previewSlides && this.props.previewSlides > 1 ) {
			const
				slidesWidth = findDOMNode(this).offsetWidth || this.state.slidesWidth,
				previewSlides = this.props.visibleSlides * this.props.previewSlides / (slidesWidth - 2*this.props.previewSlides)
			;

			this.setState({
				slidesWidth,
				previewSlides,
			})
		}
	}

	componentDidMount() {
		this.setupNavigationInterval();

		this._handleResize();

		this.resetAnimationSpeed();

		if (window.addEventListener) {
			window.addEventListener('resize', this.handleResize, false);
		}
	}

	componentWillUnmount() {
		if (this._resetAnimation)
			clearTimeout(this._resetAnimation);

		if (this._animationTimeout)
			clearTimeout(this._animationTimeout);

		if (this._throttleSetFocusedSlide)
			clearTimeout(this._throttleSetFocusedSlide);

		if (this._throttleDisableFocusedSlide)
			clearTimeout(this._throttleDisableFocusedSlide);

		if (window.removeEventListener) {
			window.removeEventListener('resize', this.handleResize, false);
		}
		
		this.cancelNavigationInterval();
		this.handleMouseLeave.cancel();
		this.handleMouseOver.cancel();
		this.handleResize.cancel();
	}

	componentWillUpdate() {
		this.handleResize();
	}

	goToSlide(event, nextSlide, velocity) {
		if (nextSlide == this.state.currentSlide)
			return;
		
		if (event && event.stopPropagation)
			event.stopPropagation();

		const 
			{
				children,
				visibleSlides,
				navigationInfinite,
				animationSpeed,
			} 				= this.props,
			{
				focusedSlide,
			}				= this.state,
			totalSlides 	= React.Children.count(children),
			slidesWidth 	= findDOMNode(this).offsetWidth,
			animationTime 	= 
				velocity 
					? Math.min(animationSpeed || 0, 1.5 * Math.round(slidesWidth / velocity))
					: animationSpeed || 0
			,
			currentSlide	= navigationInfinite 
				? nextSlide
				: Math.max(0, Math.min(totalSlides-visibleSlides, nextSlide)) 
			,
			newFocusedSlide	= focusedSlide 
				? (focusedSlide < currentSlide
					? currentSlide 
					: (focusedSlide >= visibleSlides+currentSlide
						? visibleSlides+currentSlide-1
						: focusedSlide
					) 
				)
				: focusedSlide
		;

		this.setState({
			currentSlide: currentSlide,
			animationTime: animationTime,
			isAnimating: true,
			slidesWidth: slidesWidth,
			focusedSlide: newFocusedSlide,
		});

		if (this._animationTimeout)
			clearTimeout(this._animationTimeout);

		this._animationTimeout = setTimeout(function() {
			this.animationTimedout();

			this._animationTimeout = null;
		}.bind(this), animationTime)
	}

	animationTimedout() {
		this.setState({
			isAnimating: false,
		})
	}	

	nextSlide(event, numSlides = 1, velocity) {
		this.goToSlide(event, this.state.currentSlide + numSlides, velocity);
	}

	previousSlide(event, numSlides = 1, velocity) {
		this.goToSlide(event, this.state.currentSlide - numSlides, velocity);
	}

	handleClick(direction, event) {
		if (this.state.swiping)
			return;

		const 
			slidesWidth 		= findDOMNode(this).offsetWidth,
			previewWidth 		= this.state.previewSlides/this.props.visibleSlides*slidesWidth,
			navigationWidth 	= this.props.navigationWidth*slidesWidth,
			startOfSlideshow 	= false,
			endOfSlideshow 		= false,
			previewLeft 		= startOfSlideshow ? 0 : (endOfSlideshow ? 2*previewWidth : previewWidth),
			previewRight 		= startOfSlideshow ? slidesWidth-2*previewWidth : (endOfSlideshow ? slidesWidth : slidesWidth-previewWidth),
			navigationLeft 		= navigationWidth,
			navigationRight 	= slidesWidth-navigationWidth
	
		if (event)
			event.preventDefault();


		if (direction == "left" || (previewWidth && event.clientX < previewLeft) || (!previewWidth && this.props.visibleSlides == 1 && event.clientX < navigationLeft)) {
			if (this.props.onClickSlide)
				this.props.onClickSlide(event, this.props.visibleSlides);
			else
				this.previousSlide(event, this.props.visibleSlides);
		}
		else if (direction == "right" || (previewWidth && event.clientX > previewRight) || (!previewWidth && this.props.visibleSlides == 1 && event.clientX > navigationRight)) {
			if (this.props.onClickSlide)
				this.props.onClickSlide(event, this.props.visibleSlides);
			else
				this.nextSlide(event, this.props.visibleSlides);		
		}
	}

	handleSwipe(event, deltaX, deltaY, isFlick, velocity) {
		const 
			{
				focusingEnabled,
				visibleSlides,
				focusedSizeFactor,
				focusedRolloutEnabled,
				isFocusedRollout,
				no3D,
			} 						= this.props,
			{
				currentSlide,
				focusedSlide,
				preloadSlides,
			} 						= this.state,
	 	   	isDisplayingRollout 	= focusedRolloutEnabled && focusedSlide !== undefined  && isFocusedRollout,
			isFocusable				= focusingEnabled && !no3D && visibleSlides != 1,
			hasFocusedSlide			= 
				focusedSlide === undefined || !focusingEnabled || isDisplayingRollout
					? false
					: focusedSlide >= currentSlide-preloadSlides && focusedSlide < currentSlide+visibleSlides+preloadSlides
			,
			adjustedFocusedSizeFactor	= isFocusable && hasFocusedSlide ? focusedSizeFactor : 0,
			slidesWidth 		= findDOMNode(this).offsetWidth,
			adjustedVelocity	= Math.pow(1.01, velocity*18/this.props.visibleSlides + slidesWidth/240),
			slidesSwiped 		= Math.abs(Math.round(deltaX/slidesWidth*this.props.visibleSlides * adjustedVelocity * (1+adjustedFocusedSizeFactor)))
		;

		this.setState({
			swiping: false,
			swipeX: 0,
			slidesWidth: slidesWidth,
		});

		if (event)
			event.preventDefault();
		
		if (deltaX > 0)
			this.nextSlide(event, slidesSwiped, velocity);
		else
			this.previousSlide(event, slidesSwiped, velocity);
	}

	handleSwiping(ev, deltaX, deltaY, absX, absY) {
		this.setState({
			swiping: true,
			swipeX: deltaX,
		});
	}

	onFocused(focusedSlide, event) {
		if (event)
			event.preventDefault();

		this._pendingFocusedItem = focusedSlide

		this.props.onFocused();
	}


	onUnfocused(event) {
		if (this.state.focusedSlide === undefined)
			return;

		if (event)
			event.preventDefault();

		this.props.onUnfocused();
	}

	setFocusedSlide(focusedSlide, immediately, event) {
		const 
			{
				focusedRolloutEnabled,
				isFocusedRollout,
			} 	= this.props,
			{
				focusedSlide : currentFocusedSlide,
			} 	= this.state,
			pendingFocusedSlide 	= this._throttleSetFocusedSlide ? this._pendingFocusedSlide : currentFocusedSlide,
	 	   	isDisplayingRollout 	= focusedRolloutEnabled && currentFocusedSlide !== undefined  && isFocusedRollout

		if (immediately) {
			if (event)
				event.preventDefault();

			if (this._throttleSetFocusedSlide)
				clearTimeout(this._throttleSetFocusedSlide);

			if (this._throttleDisableFocusedSlide) {
				clearTimeout(this._throttleDisableFocusedSlide);

				this._throttleDisableFocusedSlide = undefined;
			}

			if (currentFocusedSlide != focusedSlide) {
				this.setState({
					focusedSlide: focusedSlide,
				})
			}

			this._pendingFocusedSlide = focusedSlide
		}
		else if (pendingFocusedSlide != focusedSlide) {
			if (this._throttleSetFocusedSlide)
				clearTimeout(this._throttleSetFocusedSlide);

			if (this._throttleDisableFocusedSlide) {
				clearTimeout(this._throttleDisableFocusedSlide);

				this._throttleDisableFocusedSlide = undefined;
			}

			this._throttleSetFocusedSlide = setTimeout(function() 
			{
				this._pendingFocusedSlide = undefined;
				this._throttleSetFocusedSlide = undefined;

				if (currentFocusedSlide != focusedSlide) {
					this.setState({
						focusedSlide: focusedSlide,
					})
				}
			}.bind(this),
			isDisplayingRollout
				? 800
				: this.context.isScrolling() 
					? (currentFocusedSlide !== undefined ? 225 : 1450)
					: (currentFocusedSlide !== undefined ? 200 : 425))

			this._pendingFocusedSlide = focusedSlide
		}
	}

	disableFocusedState() 
	{
		if (this._throttleSetFocusedSlide) {
			clearTimeout(this._throttleSetFocusedSlide);

			// this._pendingFocusedSlide = undefined;
			this._throttleSetFocusedSlide = undefined;
		}

		const 
			{
				focusedRolloutEnabled,
				isFocusedRollout,
			} 						= this.props,
			{
				focusedSlide,
			} 						= this.state,
	 	   	isDisplayingRollout 	= focusedRolloutEnabled && focusedSlide !== undefined  && isFocusedRollout

		if (focusedSlide != undefined) {
			if (isDisplayingRollout) {
				return;
			}
			else if (this.state.mouseHover) {
				this._throttleDisableFocusedSlide = setTimeout(this.disableFocusedState, 250);
				return;
			}
			else {
				this.setState({
					focusedSlide: undefined,
				})
			}
		}

		this._throttleDisableFocusedSlide = undefined;
	}

	disableFocusedSlide() {
		if (this._throttleDisableFocusedSlide)
			clearTimeout(this._throttleDisableFocusedSlide);

		this._throttleDisableFocusedSlide = setTimeout(this.disableFocusedState, this.context.isScrolling() ? 75 : 50)
	}

	render() {
		const 
			props = this.props,
			{
				navigationInfinite,
				focusingEnabled,
				visibleSlides,
				className,
				navigationAutomatic,
				aspectRatio,
				controlsEnabled,
				previewSlides,
				focusedSizeFactor,
				focusedRolloutEnabled,
				children,
				centerSlides,
				isFocusedRollout,
				isShowingRollout,
				isSwipingEnabled,
				no3D,
				slideProps,
			} 						= props,
			{
				currentSlide,
				focusedSlide,
				preloadSlides,
			} 						= this.state,
			totalChildren 			= React.Children.count(children),
			isFocusable				= focusingEnabled && !no3D && visibleSlides != 1,
			wrapFocusedSlide		= focusedSlide%totalChildren,
			focusedIndex			= focusedSlide === undefined ? -1 : (wrapFocusedSlide < 0 ? (wrapFocusedSlide + totalChildren) : wrapFocusedSlide),
	 	   	isDisplayingRollout 	= focusedRolloutEnabled && focusedIndex !== -1 && isFocusedRollout,
			isActive				= navigationAutomatic || this.state.swiping || this.state.isAnimating || this.state.mouseHover || isDisplayingRollout || (focusedSlide !== undefined && focusingEnabled),
			hasFocusedSlide			= 
				focusedSlide === undefined || !focusingEnabled || isDisplayingRollout
					? false
					: focusedSlide >= currentSlide-preloadSlides && focusedSlide < currentSlide+visibleSlides+preloadSlides
			,
			adjustedFocusedSizeFactor	= isFocusable && hasFocusedSlide ? focusedSizeFactor : 0,
			totalSlides 			= navigationInfinite 
				? visibleSlides + 2*preloadSlides
				: Math.min(totalChildren, visibleSlides + 2*preloadSlides) 
			,
			preloadLeftSlides		= navigationInfinite
				? preloadSlides
				: currentSlide - Math.max(0, Math.min(totalChildren, currentSlide+visibleSlides+preloadSlides) - totalSlides)
			,
			preloadRightSlides		= navigationInfinite
				? preloadSlides
				: Math.min(totalChildren, totalSlides + Math.max(0, currentSlide-preloadSlides)) - currentSlide - visibleSlides
			,
			availablePreloadSlides 	= totalSlides - visibleSlides,
			startingSlideIndex 		= currentSlide - preloadLeftSlides,
			finalSlideIndex 		= currentSlide + visibleSlides + preloadRightSlides,			
			adjustedTotalSlides		= totalSlides + focusedSizeFactor,
			slidesWidth 			= 
				(
				 	1 
				 	- 2*this.state.previewSlides/(visibleSlides+2*this.state.previewSlides)
			 	) * 100 / (visibleSlides) * adjustedTotalSlides
		 	,
			slidesPosition 			= 
				(
				 	this.state.previewSlides 
				 	+ (centerSlides ? Math.max(0, visibleSlides - totalSlides)/2 : 0)
				 	- startingSlideIndex 
				 	- preloadLeftSlides 
				 	// - 	(hasFocusedSlide
					 // 	   ? focusedSlide == currentSlide+visibleSlides-1
					 // 	   		? adjustedFocusedSizeFactor 
					 // 	   		: focusedSlide == currentSlide
					 // 	   			? 0
					 // 	   			: adjustedFocusedSizeFactor/2
					 // 	   : 0
			 	 //   		)
				) * 100 / adjustedTotalSlides
			,
			slidesSwipeOffset 		= (this.state.swiping) 
				? -100*this.state.swipeX/this.state.slidesWidth 
					* (visibleSlides + 2*this.state.previewSlides) / adjustedTotalSlides
				: 0
			,
			slidesTranslatePosition = 'translate3d(' + (slidesPosition+slidesSwipeOffset) + '%,0,0)',
			slidesStyle 			= 
			{
				WebkitTransitionDuration: (this.state.swiping ? 0 : this.state.animationTime) + 'ms',
				transitionDuration: (this.state.swiping ? 0 : this.state.animationTime) + 'ms',
				width: slidesWidth + '%',
				left: no3D ? (((slidesPosition+slidesSwipeOffset) * adjustedTotalSlides / (visibleSlides + 2*this.state.previewSlides)) + '%') : null,
				WebkitTransform: no3D ? null : slidesTranslatePosition,
				MozTransform: no3D ? null : slidesTranslatePosition,
				MsTransform: no3D ? null : slidesTranslatePosition,
				transform: no3D ? null : slidesTranslatePosition,
			},
			slidesTrackPosition		= (startingSlideIndex) * 100 / adjustedTotalSlides,
			slidesTrackTranslate 	= 'translate3d(' + (slidesTrackPosition) + '%,0,0)',
			slidesTrackStyle		= 
			{
				left: no3D ? ((slidesTrackPosition) + '%') : null,
				WebkitTransform: no3D ? null : slidesTrackTranslate,
				MozTransform: no3D ? null : slidesTrackTranslate,
				MsTransform: no3D ? null : slidesTrackTranslate,
				transform: no3D ? null : slidesTrackTranslate,
			},
			slideWidth 				= (100 / (adjustedTotalSlides)) + '%',
			slides 					= [],
			slideshowClass			=
			{
				 'slideshow': true,
				 'slideshow-hidden': this.state.slidesWidth == 0,
				 'slideshow-focusable': isFocusable,
				 'slideshow-rolledout': isDisplayingRollout,
				 [`width-${visibleSlides}`]: true,
			},
			slidesClass				=
			{
				 'sshow-slides': true,
			},
			controlsClass			=
			{
				'sshow-controls': true,
				'sshow-nopreview': previewSlides == 0,
				'controls-hidden': !controlsEnabled,
			},
			controlsNavLeftStyle	=
			{
				minWidth: previewSlides == 0
					? null 
					: previewSlides < 1 ? ((this.state.previewSlides/visibleSlides * 100) + '%') : (previewSlides + 'px'),
				opacity: navigationInfinite || currentSlide > 0 ? undefined : "0",
			},
			controlsNavRightStyle	=
			{
				minWidth: previewSlides == 0
					? null 
					: previewSlides < 1 ? ((this.state.previewSlides/visibleSlides * 100) + '%') : (previewSlides + 'px'),
				opacity: navigationInfinite || currentSlide < totalChildren-visibleSlides ? undefined : "0",
			},
			focusedSlidesOffset = 
				- (hasFocusedSlide
			 	   ? focusedSlide == currentSlide+visibleSlides-1
			 	   		? adjustedFocusedSizeFactor 
			 	   		: focusedSlide == currentSlide
			 	   			? 0
			 	   			: adjustedFocusedSizeFactor/2
			 	   : 0
	 	   		),
			rolloutStyle =
			{
				WebkitTransitionDuration: props.rolloutDuration + 'ms',
				transitionDuration: props.rolloutDuration + 'ms',
				maxHeight: props.rolloutHeight
			}
		;

		if (totalChildren) {
			for (var i = startingSlideIndex; i < finalSlideIndex; i++) {
				const 
					wrapSlideIndex			= i%totalChildren,
					slideIndex 				= wrapSlideIndex < 0 ? (wrapSlideIndex + totalChildren) : wrapSlideIndex,
					isFocusedSlide			= i == focusedSlide,
					focusedSlideTransform 	= 
						(isFocusedSlide 
							? 'translate3d(' + (100 * (adjustedFocusedSizeFactor/2 + focusedSlidesOffset)) + '%,0,0) ' 
							: 'translate3d(0,0,0)'
						) 
						+ 
						('scale(' + (1 + adjustedFocusedSizeFactor) + ')')
					,
					defaultSlideTransform 	= 
						!hasFocusedSlide 
							? 'translate3d(0,0,0)'
							: i < focusedSlide 
							   ? 'translate3d(' + (100 * focusedSlidesOffset) + '%,0,0)'
							   : 'translate3d(' + (100 * (adjustedFocusedSizeFactor + focusedSlidesOffset)) + '%,0,0)'
					,
					slideStyle 				= 
					{
						WebkitTransitionDuration: (this.state.swiping ? 0 : this.state.animationTime) + 'ms',
						transitionDuration: (this.state.swiping ? 0 : this.state.animationTime) + 'ms',
						width: slideWidth,
						margin: no3D && isFocusedSlide ? '0% ' + (50 * adjustedFocusedSizeFactor / adjustedTotalSlides) + '%' : null,
						WebkitTransform: !isFocusedSlide ? defaultSlideTransform : focusedSlideTransform,
						MozTransform: !isFocusedSlide ? defaultSlideTransform : focusedSlideTransform,
						MsTransform: !isFocusedSlide ? defaultSlideTransform : focusedSlideTransform,
						transform: !isFocusedSlide ? defaultSlideTransform : focusedSlideTransform,
					},
					slideVisible 	= i > currentSlide-1-this.state.previewSlides && i < currentSlide+visibleSlides+this.state.previewSlides,
					isVisible		= !!this.state.slidesWidth && !this.state.isAnimating && slideVisible && (!isDisplayingRollout || isFocusedSlide),
					isHidden		= !this.state.swiping && (!slideVisible || (isDisplayingRollout && !isFocusedSlide)),
					slideClass 		= 
					{
						'sshow-slide': true,
						'slide-visible': isVisible,
						'slide-hidden': isHidden,
						'slide-focused': isFocusedSlide,
						'slide-focus-locked': isFocusedSlide && isDisplayingRollout,
					},
					child 			= children.length ? children[slideIndex] : children,
					slide			= React.cloneElement(child, 
					{
						...slideProps,
						aspectRatio: Utils.isFunction(aspectRatio) ? aspectRatio({isDisplayingRollout, isShowingRollout}) : aspectRatio,
						isVisible: isVisible,
						isActive: isActive,
						onClick: this.state.swiping || this.state.isAnimating
							? e => e.preventDefault()
							: !focusedRolloutEnabled  
								? undefined
								: !isDisplayingRollout
									? this.onFocused.bind(this, i)
									: isFocusedSlide
										? this.onUnfocused
										: this.setFocusedSlide.bind(this, i, true)
						,
						...child.props,						
					}),
					useFocusingEvents	= isFocusable && !this.state.isAnimating && slideVisible
				;

                slides.push(
					<div 
						onMouseOver={useFocusingEvents ? this.setFocusedSlide.bind(this, i, false) : undefined}
						onMouseLeave={useFocusingEvents ? this.disableFocusedSlide : undefined}
						className={Classes.combine(slideClass)} 
						key={i}
						style={slideStyle}
						>
							{slide}
					</div>
				)
			}
		}

		return (
			<ViewSwipeable
				className={Classes.combine(slideshowClass, className)}
				onSwiped={isSwipingEnabled ? this.handleSwipe : Utils.noop}
				onSwiping={isSwipingEnabled ? this.handleSwiping : Utils.noop}				
				onMouseEnter={this.handleMouseOver}
				onMouseOver={this.handleMouseOver}
				onMouseLeave={this.handleMouseLeave}
				>
				<div className="slideshow-content">
					<div className={Classes.combine(slidesClass)} style={slidesStyle}>
						<div className='sshow-slides-track' style={slidesTrackStyle}>
							{slides}
						</div>
					</div>

					<div className={Classes.combine(controlsClass)}>
						<span className="nav-left" onClick={this.handleClick.bind(this, "left")} style={controlsNavLeftStyle}><i className="icon icon-left-open-1"></i></span>
						<span className="nav-right" onClick={this.handleClick.bind(this, "right")} style={controlsNavRightStyle}><i className="icon icon-right-open-1"></i></span>
					</div>
				</div>

				{isDisplayingRollout && 
					<div className="slideshow-rollout" style={rolloutStyle}>
						{React.cloneElement(children[focusedIndex], {isExpanded: true})}
					</div>
				}
			</ViewSwipeable>
		)
	}
}

Slideshow.propTypes = {
	aspectRatio: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.number
	]),
	animationSpeed: PropTypes.number,
	controlsEnabled: PropTypes.bool,
	initialSlide: PropTypes.number,
	centerSlides: PropTypes.bool,
	randomStart: PropTypes.bool,
	onClickSlide: PropTypes.func,
	navigationSpeed: PropTypes.number,
	navigationWidth: PropTypes.number,
	automaticAdvanceSlides: PropTypes.number,
	focusingEnabled: PropTypes.bool,
	focusedSizeFactor: PropTypes.number,
	navigationInfinite: PropTypes.bool,
	isSwipingEnabled: PropTypes.bool,
	navigationAlways: PropTypes.bool,
	no3D: PropTypes.bool,
}

Slideshow.defaultProps = {
	animationSpeed: 400,
	initialSlide: 0,
	randomStart: false,
	centerSlides: false,
	isSwipingEnabled: true,
	onClickSlide: null,
	navigationSpeed: 5000,
	navigationWidth: 0.45,
	navigationInfinite: false,
	navigationAutomatic: false,
	navigationAlways: false,
	isFocusedRollout: false,
	controlsEnabled: true,
	visibleSlides: 1,
	focusingEnabled: true,
	focusedRolloutEnabled: false,
	focusedSizeFactor: 0.382,//0.283,
	preloadSlides: 4,
	previewSlides: 0.1,
	no3D: !Supports.transform3d,
}

Slideshow.contextTypes = {
	isScrolling: PropTypes.func,
}

export default Slideshow;
