import React from 'react';
import PropTypes from 'prop-types';
import View from '../components/View';
import Link from '../components/Link';
import Context from '../config/context';
import * as Classes from '../utils/classes';

const Brand = (props, context) => {
	const 
		{
			to,
			noLogo,
			isLogoOnly,
			className,
			children,
			isContextScreeners,
			...other
		} 	= props,
		{
			T,
			TC,
			IMAGE,
		} 	= context
	;	

	return (
	    <View {...other} className={Classes.combine(className, "brand")}>
			<Link to={to} className="navbar-brand" title={ "slideshow-react" }>
				<img src={IMAGE('logo3.png')}/>

				{children}
			</Link>
		</View>
	)
}

Brand.contextTypes = Context.General

export default Brand;
