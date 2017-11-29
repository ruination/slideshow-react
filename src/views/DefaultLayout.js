import throttle from 'lodash.throttle';
import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import elementType from 'react-prop-types/lib/elementType';
import EventComponent from '../components/EventComponent';
import * as Storage from '../utils/storage';
import * as Classes from '../utils/classes';
import * as Device from '../config/device';
import Theme from '../config/theme';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import PageLayout from '../containers/PageLayout';
import PageContent from '../containers/PageContent';
import PageScroll from '../containers/PageScroll';

import Titlebar from '../components/Titlebar';
import LoadingMessage from '../components/LoadingMessage';
import Page from '../containers/Page';
import ViewScrollable from '../components/ViewScrollable';
import Navbar from '../components/Navbar';
import Brand from '../components/Brand';

class DefaultLayout extends EventComponent {
	constructor(props) {
		super(props);

		this._breadcrumbs = {};
		this._history = [
		{
			to: this.props.location.pathname,
			hash: this.props.location.hash,
			key: this.props.location.key,
			query: {...this.props.location.query},
			search: this.props.location.search,
			state: this.props.location.state || {timestamp: Date.now()},
		}];

		this.state =
		{
			breadcrumbs: this._breadcrumbs,
			history: this._history,
			historyPosition: 0,
			navigateDirection: "forward",
		};

		this.handleResize = throttle(function () {
			const 
				dpr = window.devicePixelRatio,
				device = {
					viewport	: 
					{
						width 		: this._page.offsetWidth ? this._page.offsetWidth : Math.min(window.innerWidth, window.screen.width),
						height 		: this._page.offsetHeight ? this._page.offsetHeight : Math.min(window.innerHeight, window.screen.height),
					},					
				}
			;

			this.props.deviceOrientationChanged(device);
		}.bind(this), 1000, {'leading': false, 'trailing': true})


		this._bind(
			"isContextScreeners",
			"getScrollPosition",
			"getPlaceholders",
			"setScrollPosition",
			"setBreadcrumb",
			"canGoForward",
			"canGoBack",
			"stopScrolling",
			"isScrolling",
		);
	}

	static childContextTypes = {
		IMAGE						: PropTypes.func,
		device						: PropTypes.object,
		ScrollComponent				: elementType,
		route						: PropTypes.object,
		location					: PropTypes.object,
		layout						: PropTypes.object,
		isScrolling					: PropTypes.func,
		getScrollPosition			: PropTypes.func,
	}

	getChildContext() {
		return {
			IMAGE 					: this.props.IMAGE,
			isScrolling 			: this.isScrolling,
			getScrollPosition 		: this.getScrollPosition,
			location 				: this.props.location,
			route 					: this.props.route,
			ScrollComponent 		: ViewScrollable,
			device 					: this.props.device,
			layout 					: this.event,
		}
	}

	static propTypes = {
		children: PropTypes.oneOfType([
			PropTypes.node,
			PropTypes.arrayOf(PropTypes.node)
		])
	}

	setScrollPosition(scrollPosition) {
		this._scrollPosition = scrollPosition;
		this._isScrolling = true;

		this.event.fire('scroll', scrollPosition);

		this.stopScrolling();
	}

	getScrollPosition() {
		return this._scrollPosition;
	}

	getPlaceholders() {
		return {
			default: 'logo.svg',
			square: 'logo-square.svg',
		};
	}

	isContextScreeners() {
		return this.props.isContextScreeners;
	}

	isScrolling() {
		return this._isScrolling;
	}

	stopScrolling() {
		if (this._stopScrolling)
			clearTimeout(this._stopScrolling)

		this._stopScrolling = setTimeout((function() {
			this._isScrolling = false;
		}).bind(this), 2000)
	}

	setBreadcrumb(key, text) {
		if (this.state.breadcrumbs[key] !== text) {
			this._breadcrumbs = 
			{
				...this._breadcrumbs,
				[key]: text,
			};

			this.setState({
				breadcrumbs: this._breadcrumbs,
			})
		}
	}

	componentDidMount() {
		this.handleResize();

		if (window.addEventListener) {
			window.addEventListener('resize', this.handleResize, false);
		}

		this.fetchData(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.fetchData(nextProps);

		if (	nextProps.location.pathname != this.props.location.pathname 
			|| 	JSON.stringify(nextProps.location.query) != JSON.stringify(this.props.location.query)) 
		{
			let 
				historyPosition = this.state.historyPosition,
				navigateDirection = this.state.navigateDirection
			;

			const 
				nextHistory = {
					to: nextProps.location.pathname,
					hash: nextProps.location.hash,
					key: nextProps.location.key,
					query: {...nextProps.location.query},
					search: nextProps.location.search,
					state: nextProps.location.state || {timestamp: Date.now()},
				}
			;

			this._breadcrumbs = {};

			if (nextProps.location.action == "POP") {
				const 
					next = JSON.stringify(nextHistory),
					forward = historyPosition+1 < this._history.length
						? JSON.stringify(this._history[historyPosition+1])
						: null
					,
					past = historyPosition > 0
						? JSON.stringify(this._history[historyPosition-1])
						: null
				;

				if (this._history[historyPosition].state.timestamp < nextHistory.state.timestamp) { 					
					// Navigate (<== Forward)
					navigateDirection = "forward";
					historyPosition += 1;

					if (forward != next)
						this._history.splice(historyPosition, 0, nextHistory);
				}
				else { 
					navigateDirection = "backward";
					// Navigate (<== Back)
					if (next == past)
						historyPosition -= 1;
					else
						this._history.unshift(nextHistory);
				}
			}
			else if (nextProps.location.action == "PUSH") {
				navigateDirection = "forward";
				this._history = this._history.slice(0, historyPosition+1);
				this._history.push(nextHistory);
				historyPosition = this._history.length-1;
			}

			this.setState({
				breadcrumbs: this._breadcrumbs,
				history: this._history,
				historyPosition: historyPosition,
				navigateDirection,
			});
		}		
	}

	canGoForward() {
		return this.state.historyPosition+1 < this._history.length;
	}

	canGoBack() {
		return this.state.historyPosition > 0;
	}

	fetchData(props, context) {
		
	}

	componentWillUnmount() {
		if (window.removeEventListener) {
			window.removeEventListener('resize', this.handleResize, false);
		}
	}

	renderChildren() {
		const 
			{
				children,
				...props
			} = this.props,
			classes = 
			{
				'page-content-view-navbar-normal': false,
				'page-content-view-navbar-offset': false,
			},
			childProps	=
			{
				...props,
				key							: props.location.pathname.replace('/', '_'),
				onScrolled					: this.setScrollPosition,
				className					: Classes.combine(classes),	
			}			
		;

		return React.Children.map(children, child => 
		{
			if (child && child.props) {
				return React.cloneElement(child, 
				{
					...childProps,
					...child.props,
				});
			}

			return child;
		})
	}

	render() {
		const 
			props = this.props,
			{
				isLoading,
				hasTitlebar,
				children,
				device,
				...other
			} = props,
			childProps = {
				...other,
				device,
				history						: {canGoBack: this.canGoBack, canGoForward: this.canGoForward},
				hasTitlebar,
			},
			pageClass 	= 
			{
				['device-' + Theme.SIZES[device.size]]: true,
				['device-' + device.orientation]: true,
				['viewport-' + Theme.SIZES[device.viewport.size]]: true,
				['viewport-' + device.viewport.orientation]: true,
				'page': true,
				'layout-titlebar': hasTitlebar,
				'mobile': device.isMobile,
			},
			pageLayoutClass = 
			{
				"page-layout-default": true, 
			}
		;

		return (
			<Page className={Classes.combine(pageClass)}>
				{hasTitlebar && <Titlebar></Titlebar>}

				<PageLayout ref={c => this._page = findDOMNode(c)} className={Classes.combine(pageLayoutClass)}>
					{isLoading &&
						<LoadingMessage viewType={Well} className="text-center application-loading"></LoadingMessage>
					}

					{false && <Navbar 
							{...childProps} 
							getScrollPosition={this.getScrollPosition}
							>
						</Navbar>
					}


					{!isLoading ? 
		                    <ReactCSSTransitionGroup 
			                    transitionName={this.state.navigateDirection == "forward" ? "page-transition" : "reverse-page-transition"}
			                    transitionEnterTimeout={0}
			                    transitionLeaveTimeout={0}
			                    >
								<PageScroll key={this.props.location.pathname}>
									{this.renderChildren()}
								</PageScroll>
		                    </ReactCSSTransitionGroup>
	                    : !isLoading ?
                    		<PageScroll key={this.props.location.pathname}>
								{this.renderChildren()}
							</PageScroll>
						: undefined
					}
				</PageLayout>
			</Page>
		);
	}
}


DefaultLayout.contextTypes = {
	router: PropTypes.object,
}

export default DefaultLayout