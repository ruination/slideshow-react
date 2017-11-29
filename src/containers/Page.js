import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Page = ({children, className, ...props}) => {
	return (
		<div className={className}>
			{children}
		</div>
	)
}

export default Page;