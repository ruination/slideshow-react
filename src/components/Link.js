import React, { Component } from 'react';
import PropTypes from 'prop-types';
import View from '../components/View';
import * as Classes from '../utils/classes';
import { createChainedFunction } from '../utils';

const { bool, object, string, func, oneOfType, number } = PropTypes

function isLeftClickEvent(event) {
	return event.button === 0
}

function isModifiedEvent(event) {
	return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

// TODO: De-duplicate against hasAnyProperties in createTransitionManager.
function isEmptyObject(object) {
	for (const p in object)
		if (Object.prototype.hasOwnProperty.call(object, p))
			return false

	return true
}

function createLocationDescriptor(to, { query, hash, state }) {
	if (query || hash || state) {
		return { pathname: to, query, hash, state }
	}

	return to
}

/**
 * A <Link> is used to create an <a> element that links to a route.
 * When that route is active, the link gets the value of its
 * activeClassName prop.
 *
 * For example, assuming you have the following route:
 *
 *   <Route path="/posts/:postID" component={Post} />
 *
 * You could use the following component to link to that route:
 *
 *   <Link to={`/posts/${post.id}`} />
 *
 * Links may pass along location state and/or query string parameters
 * in the state/query props, respectively.
 *
 *   <Link ... query={{ show: true }} state={{ the: 'state' }} />
 */
class Link extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		let allowTransition = true

		if (this.props.onClick)
			this.props.onClick(event)

		if (isModifiedEvent(event) || !isLeftClickEvent(event) || this.props.to == null)
			return

		if (event.defaultPrevented === true)
			allowTransition = false

		// If target prop is set (e.g. to "_blank") let browser handle link.
		/* istanbul ignore if: untestable with Karma */
		if (this.props.target) {
			if (!allowTransition)
				event.preventDefault()

			return window.open(this.props.to)
		}

		event.preventDefault()

		if (allowTransition) {
			const 
				{ 
					to,
					query,
					hash,
					state ,
				} = this.props,
				{ 
					router,
					location 
				} = this.context,
				newQuery = 
				{
					...query,
				},
				href = to === undefined
					? location.pathname
					: to != null && !to.startsWith('/')
						? location.pathname + (!to.length || location.pathname.endsWith('/') ? '' : '/') + to
						: to
			;
			
			if (location.pathname == href && JSON.stringify(newQuery) == JSON.stringify(location.query))
				return;

			const nextLocation = createLocationDescriptor(href, 
			{
				query: newQuery,
				hash,
				state: {
					timestamp: Date.now(),
				} 
			})

			router.push(nextLocation)
		}
	}
	
	render() {
		const 
			{
				Wrapper,
				to,
				query,
				Element,
				hash,
				state,
				className,
				activeClassName,
				activeStyle,
				onlyActiveOnIndex,
				...props 
			} = this.props,
			{
				router,
				location
			} = this.context
		;

		let 
			href = to,
			pathname = location.pathname
		;

		if (href === undefined)
			href = pathname;
		else if (href != null && !href.startsWith('/'))
			href = pathname + (!href.length || pathname.endsWith('/') ? '' : '/') + href;

		let linkClass = Classes.extract(className);

		let wrapperClassName = "";
		let wrapperStyle = {};

		if (router && href != null) {
			const nextLocation = createLocationDescriptor(href, {query: query, hash, state })
			props.href = router.createHref(nextLocation)

			if (activeClassName || (activeStyle != null && !isEmptyObject(activeStyle))) {
				if (router.isActive(nextLocation, onlyActiveOnIndex)) {
					if (activeClassName) {
						props.className += props.className === '' ? activeClassName : ` ${activeClassName}`
						wrapperClassName += wrapperClassName === '' ? activeClassName : ` ${activeClassName}`
					}

					if (activeStyle) {
						props.style = { ...props.style, ...activeStyle }
						wrapperStyle = { ...wrapperStyle, ...activeStyle }
					}
				}
			}
		}

		const link = 
			<View
				viewType='span'
				viewClass='btn-link'
				{...props}
				className={linkClass}
				onClick={this.handleClick}
				>
			</View>

		if (Wrapper)
			return <Wrapper className={wrapperClassName.length ? wrapperClassName : undefined} style={wrapperStyle}>{link}</Wrapper>
		else 
			return link
	}
}

Link.contextTypes = {
	router: object,
	location: object,
}

Link.propTypes = {
	to: oneOfType([ string, object ]),
	query: object,
	hash: string,
	Element: string,
	state: object,
	activeStyle: object,
	activeClassName: string,
	onlyActiveOnIndex: bool.isRequired,
	Wrapper: string,
	onClick: func
}

Link.defaultProps = {
	onlyActiveOnIndex: false,
	className: '',
	Element: "span",
	activeClassName: 'active',
	style: {},
}

export const ExternalLink = (props) => {
	const propTypes = {
		to: string,
		Wrapper: string,
		onClick: func
	}

	const {Wrapper, to, onClick, btnIsLink, className = 'btn', style = {}, ...other}  = props;
	
	let linkClass = Classes.extract(className);

	const handleClick = (event) => {
		let allowTransition = true

		if (onClick)
			onClick(event)

		if (isModifiedEvent(event) || !isLeftClickEvent(event))
			return

		if (event.defaultPrevented === true)
			allowTransition = false

		event.preventDefault()

		if (to && allowTransition)
			return window.open(to)
	}

	const link = <View viewType='span' {...props} className={linkClass} style={style} onClick={handleClick} />;

	if (Wrapper)
		return <Wrapper>{link}</Wrapper>
	else 
		return link
}


export default Link
