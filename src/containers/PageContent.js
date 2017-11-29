import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BaseComponent from '../components/BaseComponent';
import ViewScrollable from '../components/ViewScrollable';
import * as Classes from '../utils/classes';
import * as Utils from '../utils';
import * as Storage from '../utils/storage';
import { findDOMNode } from 'react-dom';
import throttle from 'lodash.throttle'
import Context from '../config/context';
import elementType from 'react-prop-types/lib/elementType';

export class PageContent extends BaseComponent {
	static contextTypes = 
	{
		...Context.Navigation,
		ScrollComponent				: elementType,
	}

	constructor(props, context) {
  		super(props, context);

		const routeHistory = Storage.get('route.history', {});

		this._scrollPosition = routeHistory[this.props.location.key] && !props.isNotSavingScrollPosition ? routeHistory[this.props.location.key].scrollPosition : 0;
		this.state = {
			scrollPosition: this._scrollPosition,
		}

		this._scrollHandler = throttle(function(event, args) {
			const 
				scrollPosition		= args.offset.y,
				scrollPositionMax	= args.limit.y,
				scrollContentHeight	= args.size.content.height
			;


			if (scrollPosition != this._scrollPosition) {
				const routeHistory = Storage.get('route.history', {});

				Storage.set('route.history', {
					...routeHistory,
					[this.props.location.key]: 
					{
						path: this.props.location.pathname,
						scrollPosition: scrollPosition,
						scrollPositionMax: scrollPositionMax,
						scrollContentHeight: scrollContentHeight,
					}
				})

				if (this.props.onScrolled)
					this.props.onScrolled(scrollPosition)
			}	

			this._scrollPosition		= scrollPosition;
			this._scrollPositionMax		= scrollPositionMax;
			this._scrollContentHeight	= scrollContentHeight;
		}.bind(this), 250, {leading: false});

  		this._bind(
			"recallScrollPosition",
			"updateScrollPosition",
       	);
	}

	updateScrollPosition(position) {
		this.setState({scrollPosition: position})
	}

	componentDidMount() {
		const routeHistory = Storage.get('route.history', {});

		if (routeHistory[this.props.location.key] && !this.props.isNotSavingScrollPosition) {
			this._scrollPosition = routeHistory[this.props.location.key].scrollPosition;
		}

		this.updateScrollPosition(this._scrollPosition);
		
		if (this.props.onScrolled)
			this.props.onScrolled(this._scrollPosition)

	}

	componentWillUnmount() {
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.pathname != this.props.location.pathname) {
			this._componentUpdate = true;
			this.recallScrollPosition(nextProps, this.props);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this._componentUpdate) {
			const 
				scrollPosition		= this._scrollbar.offset.y,
				scrollPositionMax	= this._scrollbar.limit.y,
				scrollContentHeight	= this._scrollbar.size.content.height,
				routeHistory = Storage.get('route.history', {});

			this.updateScrollPosition(this._scrollPosition);		

			Storage.set('route.history', {
				...routeHistory,
				[this.props.location.key]: 
				{
					path: this.props.location.pathname,
					scrollPosition: scrollPosition,
					scrollPositionMax: scrollPositionMax,
					scrollContentHeight: scrollContentHeight,
				}
			})			
				
			if (this.props.onScrolled)
				this.props.onScrolled(this._scrollPosition)

			this._componentUpdate = false;
		}
	}

	recallScrollPosition(nextProps, prevProps) {
		const 
			routeHistory = Storage.get('route.history', {})
		;
		
		if (nextProps.location.action == "POP") {
			if (routeHistory[nextProps.location.key] && !nextProps.isNotSavingScrollPosition) {
				this._scrollPosition = routeHistory[nextProps.location.key].scrollPosition;
			}
			else
				this._scrollPosition = 0;
		}
		else {
			Storage.set('route.history', {
				...routeHistory,
				[nextProps.location.key]: 
				{
					path: nextProps.location.pathname,
					scrollPosition: this._scrollbar.offset.y,
					scrollPositionMax: this._scrollbar.limit.y,
					scrollContentHeight: this._scrollbar.size.content.height,
				}
			})

			this._scrollPosition = 0;
		}

		this.updateScrollPosition(this._scrollPosition);

		if (nextProps.onScrolled)
			nextProps.onScrolled(this._scrollPosition)
	}

	render() {
		const 
			props = this.props,
			{
				children,	
				className,		
				device,	
				page,
				...other
			} = props,
			context = this.context,
			{
				T,
				TC,
				IMAGE,
				ScrollComponent,
			} 						= context
		;

		return (
	        <ScrollComponent
	        	contentClassName={Classes.combine("page-content", className)}
	        	onScroll={this._scrollHandler}
	        	scrollPosition={this.state.scrollPosition}
	        	>
	        	<div style={{minHeight: device.viewport.height}}>
					{children}
				</div>
	        </ScrollComponent>
		)
	}
}

PageContent.displayName = process.env.NODE_ENV !== 'production' ? "PageContent" : 'pc';

export default PageContent
