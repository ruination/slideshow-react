import React, { Component } from 'react';
import PropTypes from 'prop-types';
import elementType from 'react-prop-types/lib/elementType';
import * as Classes from '../utils/classes';

const SectionTitle = (props) => {
	const 
		{
			children,
			viewType: Component,
			viewRole,
			...other,
		} 	= props

	return (
		<Component className={Classes.combine(props.className, 'section-title')}>
			{children}
		</Component>
	)
}

SectionTitle.propTypes = {
    /**
     * You can use a custom element for this component
     */	
	viewType: elementType, 
}

SectionTitle.defaultProps = {
	viewType: 'h3',
	viewRole: 'title',
}

export default SectionTitle