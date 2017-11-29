import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from '../components/Link';
import * as Classes from '../utils/classes';

const SectionHeader = (props) => {
	const 
		{
			to,
			title,
			children,
			...other
		} 	= props

	return (
		<div className={Classes.combine(props.className, 'section-header')}>
			{!!to &&
				<Link viewType="h1" viewClass='section-header-title' to={to}>
					{title} <span className="section-icon-navigate"><i className="icon icon-right-open-1"></i></span>
				</Link>
			}

			{!to && 
				<h1>{title}</h1>
			}

			{children}
		</div>
	)
}

SectionHeader.propTypes = {
}

SectionHeader.defaultProps = {
}

export default SectionHeader