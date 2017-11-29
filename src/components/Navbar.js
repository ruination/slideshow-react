import throttle from 'lodash.throttle'
import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import * as Classes from '../utils/classes';
import * as Device from '../config/device';
import View from '../components/View';
import Link, { ExternalLink } from '../components/Link';
import BaseComponent from '../components/BaseComponent';
import Brand from '../components/Brand';
import Context from '../config/context';

class Navbar extends BaseComponent {
	static contextTypes = Context.Navigation

	constructor(props) {
  		super(props);
  
  		this.state = {
  			isScrolledPast: false,
  			isSearchOpen: false,
  		};

  		this._bind(
			"updateScrollPosition",
			"goBack",
			"goForward",
       	);
	}

	componentWillUpdate(nextProps, nextState, nextContext) {

	}

	componentDidMount() {
		this.updateScrollPosition(null, this.props.getScrollPosition());

		this.context.layout.on('scroll', this.updateScrollPosition);
	}

	componentWillUnmount() {
		this.context.layout.off('scroll', this.updateScrollPosition);
	}

	updateScrollPosition(event, position) {
		const element = findDOMNode(this);

		if (element) {			
			if (position > element.offsetHeight) {
				if (!this.state.isScrolledPast)
					this.setState({isScrolledPast: true})
			}
			else if (this.state.isScrolledPast) {
				this.setState({isScrolledPast: false})
			}
		}
	}
	
	componentWillReceiveProps(nextProps, nextContext) {

	}

	goBack(event) {
		const 
			context = this.context,
			{
				router,
			} 						= context,
			props = this.props,
			{
				history,
			} 						= props
		;

		if (history.canGoBack()) {
			if (event)
				event.preventDefault();

			router.goBack();
		}
	}

	goForward() {
		const 
			context = this.context,
			{
				router,
			} 						= context,
			props = this.props,
			{
				history,
			} 						= props
		;

		if (history.canGoForward())
			router.goForward();
	}

	render() {
		const 
			props = this.props,
			{
				onHide,
				onShow,
				transition,
				hasChildOpen,
				isContextScreeners,
				unmountOnExit,
				transitionType,
				windowTransitionTimeout,
				breadcrumbs,
				page,
				className,
				forwardHistory,
				definitionLength,
				pages,				
				selectChannelIfNeeded,
				fetchUserLogoutIfNeeded,
				player,
				history,
				hasTitlebar,
				Member,
				device,
				channel,
				channels,
				subscription,
				subscriptions,
				location,
				...other,
			} 						= props,
			context = this.context,
			{
				IMAGE,
			} 						= context,
			navClass = 
			{
				'navbar navbar-inverse navbar-fixed-top container-fluid': true,
				'gradient':  !this.state.isScrolledPast,
				'text-center': false,
				'navbar-overlay': false,
				'navbar-active': false,
				'navbar-search': this.state.isSearchOpen,
			},
			backButtonClass =
			{
 				'icon icon-angle-circled-left': true, 
 				'icon icon-left-open-1': false, 
 				// 'icon icon-nav-left': true, 
 				'disabled':!history.canGoBack(),
 				'btn btn-nav': true,
 				'btn-back': true,
 			},
			forwardButtonClass =
			{
 				'icon icon-angle-circled-right': true, 
 				'icon icon-right-open-1': false, 
 				// 'icon icon-nav-right': true, 
 				'disabled':!history.canGoForward(),
 				'btn btn-nav': true,
 				'btn-forward': true,
 			}
		;

		return (
		    <nav className={Classes.combine(className, navClass)}>
		    	<div className="navbar-content">
					<ul className="nav navbar-nav navbar-nav-menu">
						<li className="navbar-navigation">
							<i onClick={this.goBack} className={Classes.combine(backButtonClass)}></i>
							<i onClick={this.goForward} className={Classes.combine(forwardButtonClass)}></i>
						</li>
					</ul>

					<Brand 
						to={'/'} 
						>
					</Brand>
				</div>
			</nav>
		)
	}
}

export default Navbar