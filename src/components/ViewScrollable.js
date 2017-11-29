import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BaseComponent from '../components/BaseComponent';
import { findDOMNode } from 'react-dom';
import * as Classes from '../utils/classes';
import * as Supports from '../utils/supports';
import {splitViewProps} from '../utils/theme';
import resizeDetector from 'element-resize-detector';
import throttle from 'lodash.throttle';
import Context from '../config/context';

class ViewScrollable extends BaseComponent {
	static contextTypes = Context.General
	
	constructor(props, context) {
  		super(props, context);

  		this.scroll = {
			size: {
				content: {
					width: 0,
					height: 0,
				},
				container: {
					width: 0,
					height: 0,
				},
			},
			offset: {
				x: 0,
				y: 0,
			},
			limit: {
				x: 0,
				y: 0,
			},
		};

		this.erd = resizeDetector({
			strategy: "scroll"
		});

		this.onScroll = throttle(function onScroll(event) {
			const prevScrollbar = this.scroll.scrollbar;

			if (!this._content)
				return;
			
			this.scroll = {
				size: {
					content: {
						width: this._content.offsetWidth,
						height: this._content.offsetHeight,
					},
					container: {
						width: this._view.offsetWidth,
						height: this._view.offsetHeight,
					},
				},
				offset: {
					x: this._scrollX.scrollLeft,
					y: this._scrollY.scrollTop,
				},
				limit: {
					x: Math.max(0, this._content.offsetWidth - this._view.offsetWidth),
					y: Math.max(0, this._content.offsetHeight - this._view.offsetHeight),
				},
			}

			this.setState({scroll: this.scroll});

			if (this.props.onScroll)
				this.props.onScroll(event, this.scroll);
		}.bind(this), 5);

  		this.state = {
			scrollbar: this.getScrollbarSize(),
  			scroll: this.scroll,
			dragging: undefined,
  		}

  		this._bind(
			"updateScrollPosition",
		)
	}

	getScrollbarSize() {
		return Supports.scrollbar;
	}

	onDragStart(direction, event) {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		if (!this.props.disabled && this.state.dragging === undefined) {
			if (this.onDragMove) {
				document.removeEventListener('touchmove', this.onDragMove);
				document.removeEventListener('mousemove', this.onDragMove);
			}

			if (this.onDragFinish) {
				document.removeEventListener('touchend', this.onDragFinish);
				document.removeEventListener('mouseup', this.onDragFinish);
			}

			let pageX = event.pageX === undefined ?  event.clientX : event.pageX;

			if (!pageX && event.originalEvent && event.originalEvent.touches && event.originalEvent.touches.length)
				pageX = event.originalEvent.touches[0].pageX;

			const 
				dragStart = 
					direction == "y" 
		         		? event.pageY 
		         		: pageX
		        ,
				scrollPosition = this.scroll.offset[direction]
 	        ;

			this.setState({
				dragging: direction,
				dragPosition: dragStart,
			});

			this.onDragMove = function(event) {
				let pageX = event.pageX === undefined ?  event.clientX : event.pageX;

				if (!pageX && event.originalEvent && event.originalEvent.touches && event.originalEvent.touches.length)
					pageX = event.originalEvent.touches[0].pageX;

				const 
					dragPosition = 
						direction == "y" 
			         		? event.pageY 
			         		: pageX
			        ,
			        dragDelta = dragPosition - dragStart,
					trackSize = 
						direction == "y"
							? this.scroll.size.container.height / this.scroll.size.content.height
							: this.scroll.size.container.width / this.scroll.size.content.width
					,
			        scrollCoefficient = trackSize ? 1 / trackSize : 0
	 	        ;

	 	        if (direction == "x")
	 	        	this._scrollX.scrollLeft = Math.max(0, Math.min(this.scroll.limit.x, (scrollPosition + scrollCoefficient*dragDelta)));
	 	        else if (direction == "y")
	 	        	this._scrollY.scrollTop =  Math.max(0, Math.min(this.scroll.limit.y, (scrollPosition + scrollCoefficient*dragDelta)));

	 	        this.setState({dragPosition})
			}.bind(this);		

			this.onDragFinish = function(event) {
				if (this.state.dragging === direction) {
					this.setState({
						dragging: undefined,
						dragStart: undefined,
						dragPosition: undefined,
					});
				}

				document.removeEventListener('touchend', this.onDragFinish);
				document.removeEventListener('mouseup', this.onDragFinish);
				document.removeEventListener('touchmove', this.onDragMove);
				document.removeEventListener('mousemove', this.onDragMove);

				this.onDragFinish = undefined;
				this.onDragMove = undefined;
			}.bind(this);

			if (this.onDragMove) {
				document.addEventListener('touchmove', this.onDragMove);
				document.addEventListener('mousemove', this.onDragMove);
			}

			if (this.onDragFinish) {
				document.addEventListener('touchend', this.onDragFinish);
				document.addEventListener('mouseup', this.onDragFinish);
			}

			this.onDragMove(event);
		}
	}


	updateScrollPosition(scrollPosition) {
		this._scrollY.scrollTop = scrollPosition;
	}

	componentDidMount() {
		this.erd.listenTo(this._content, this.onScroll);

		if (this.props.scrollPosition)
			this.updateScrollPosition(this.props.scrollPosition);

		// if (window.addEventListener) {
		// 	window.addEventListener('resize', this.onScroll, false);
		// }
	}

	componentWillUnmount() {
		this.erd.uninstall(this._content);

		// if (window.removeEventListener) {
		// 	window.removeEventListener('resize', this.onScroll, false);
		// }
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (this.props.scrollPosition != nextProps.scrollPosition)
			this.updateScrollPosition(nextProps.scrollPosition);

		if (nextContext.device.lastUpdated != this.context.device.lastUpdated) {
			const scrollbar = this.getScrollbarSize();

			if (this.state.scrollbar.x != scrollbar.x || this.state.scrollbar.y != scrollbar.y)
				this.setState({scrollbar});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.scrollbar.x != prevState.scrollbar.x || this.state.scrollbar.y != prevState.scrollbar.y)
			this.onScroll();
	}


	render() {
		const 
			props = this.props,
			{
				enableScrollX = false,
				viewSize,
				viewStyle,
				viewClass,
				onScroll,
				className,
				contentClassName,
				scrollPosition,
				children,
				...other
			} = props,
			[viewProps, elementProps]	= splitViewProps(other),
			trackXEnabled = this.scroll.limit.x > 1,
			trackXSize = this.scroll.size.container.width * Math.max(0.1, (this.scroll.size.container.width / this.scroll.size.content.width) || 0),
			trackXPosition = !trackXEnabled ? 0 : (this.scroll.size.container.width - trackXSize) * (this.scroll.offset.x / this.scroll.limit.x),
			trackXTransform = 'translate3d(' + (trackXPosition) + 'px,0,0)',
			trackXStyle = {
				width: trackXSize,
				WebkitTransform: trackXTransform, MozTransform: trackXTransform, MsTransform: trackXTransform, transform: trackXTransform,
			},
			trackYEnabled = this.scroll.limit.y > 1,
			trackYSize = this.scroll.size.container.height * Math.max(0.1, (this.scroll.size.container.height / this.scroll.size.content.height) || 0),
			trackYPosition = !trackYEnabled ? 0 : (this.scroll.size.container.height - trackYSize) * (this.scroll.offset.y / this.scroll.limit.y),
			trackYTransform = 'translate3d(0,' + (trackYPosition) + 'px,0)',
			trackYStyle = {
				height: trackYSize,
				WebkitTransform: trackYTransform, MozTransform: trackYTransform, MsTransform: trackYTransform, transform: trackYTransform,
			},
			scrollStyle = 
			{
				marginRight: trackYEnabled ? (this.state.scrollbar.x + "px") : null,
				overflowX: "hidden",
				overflowY: "auto",
				height: "100%",
				width: "auto",
			},
			scrollStyleX = 
			{
				marginBottom: trackXEnabled ? (this.state.scrollbar.y + "px") : null,
				overflowX: "auto",
				overflowY: "hidden",
			}
		;

		return (
	        <div ref={c => this._view = findDOMNode(c)} {...elementProps} className={Classes.combine('view scroll-native', className)}>
	        	<div ref={c => this._scrollY = findDOMNode(c)} className='view-scroll' onScroll={this.onScroll} style={scrollStyle}>
	        		<div ref={c => this._scrollX = findDOMNode(c)} className='view-scroll-x' onScroll={this.onScroll} style={scrollStyleX}>
				        <article ref={c => this._content = findDOMNode(c)} className={Classes.combine('view-content', contentClassName)}>
							{children}
						</article>
					</div>
				</div>

				{trackXEnabled && !!this.state.scrollbar.x &&
				<aside key="track-x" className={"scrollbar-track scrollbar-track-x" + (this.state.dragging ? " show" : "")}>
		            <div className="scrollbar-thumb scrollbar-thumb-x" style={trackXStyle} onTouchStart={this.onDragStart.bind(this, "x")} onMouseDown={this.onDragStart.bind(this, "x")}></div>
		        </aside>}

				{trackYEnabled && !!this.state.scrollbar.y &&
		        <aside key="track-y" className={"scrollbar-track scrollbar-track-y" + (this.state.dragging ? " show" : "")}>
		            <div className="scrollbar-thumb scrollbar-thumb-y" style={trackYStyle} onTouchStart={this.onDragStart.bind(this, "y")} onMouseDown={this.onDragStart.bind(this, "y")}></div>
		        </aside>}
			</div>
		)
	}	
}

export default ViewScrollable