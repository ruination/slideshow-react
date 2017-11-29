import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';

class BaseComponent extends Component {
	constructor(props) {
  		super(props);
	}

	_bind(...methods) {
  		methods.forEach( (method) => 
  		{
			invariant
			(
				!!this[method],
				`All methods to be bound must exist before the constructor is called, check \`${method}\`.`
			);

  			this[method] = this[method].bind(this) 
  		});
 	}
}

export default BaseComponent