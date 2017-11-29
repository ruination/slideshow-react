import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import * as Utils from '../utils';
import invariant from 'invariant';

class EventComponent extends Component {
	constructor(props, context) {
  		super(props, context);

		this._bind(
			"findIndexOfHandler",
			"findIndexOfListener",
			"addEventListener",
			"unbind",
			"one",
			"bind",
			"trigger",
			"removeEventListener",
		);

  		this.off = this.unbind;
		this.on = this.bind;
		this.fire = this.trigger;

		this.event = {
			handlers: {},
			args: {},
			on: this.on,		
			one: this.one,		
			bind: this.bind,		
			off: this.off,		
			unbind: this.unbind,		
			trigger: this.trigger,		
			fire: this.fire,		
		};
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

	findIndexOfHandler(type, handler) {
		return this.event.handlers[type].findIndex(function(store, index, array) { return store.handler === handler; });
	}

	findIndexOfListener(type, listener) {
		return this.event.handlers[type].findIndex(function(store, index, array) { return store.listener === listener; });
	}

	addEventListener(type, listener, once) {
		var self = findDOMNode(this);
		var baseEvent = type.split('.')[0];

		var handler = function(event) {
			if (once) {
				self.removeEventListener(baseEvent, handler);
				this.event.handlers[type].splice(this.findIndexOfHandler(type, handler), 1);
			}
			
			var args = [event].concat(this.event.args[event.timeStamp + event.type] || []);

			if (listener) 
				listener.apply(this, args);
		}.bind(this);

	    if (this.event.handlers[type] === undefined)
	    	this.event.handlers[type] = []; 

	    if (this.findIndexOfHandler(type, handler) === -1)
			this.event.handlers[type].push({handler: handler, listener: listener});
		else
			return false;

		self.addEventListener(baseEvent, handler);

		return true;
	}

  
  	unbind(type, listener) {
  		var types = type.split(' ');

  		types.forEach(function(singleType) {
  			this.removeEventListener(singleType, listener);
  		}.bind(this));

  		return this;
  	}

  	one(type, listener) {
  		var types = type.split(' ');

  		types.forEach(function(singleType) {
  			this.addEventListener(singleType, listener, true);
  		}.bind(this));

  		return this;
  	}
  
  	bind(type, listener) {
  		var types = type.split(' ');

  		types.forEach(function(singleType) {
  			this.addEventListener(singleType, listener);
  		}.bind(this));

  		return this;
  	}


  	trigger(type, args, noChain) {
	    if (!type)
	    	return;

		var self = findDOMNode(this);
	    var event = document.createEvent('Event');

	    event.initEvent(type.type || type, false, true);

	    if (Object.defineProperty) {
	    	event.preventDefault = function() {
	      		Object.defineProperty(this, 'defaultPrevented', { get: function() { return true; } });
	    	};
	    }

	    this.event.args[event.timeStamp + event.type] = (args || []).length ? args || [] : [args];
	    self.dispatchEvent(event);

	    return noChain ? event : this;
  	}

	removeEventListener(type, listener) {
		var self = findDOMNode(this);
		var eventNamespaces = type.split('.');
		var baseEvent = eventNamespaces[0];
		var eventNamespace = eventNamespaces.slice(1);

	    if (this.event.handlers[type] === undefined) 
	    	return;

    	Object.keys(this.event.handlers).filter(function(handlerType) 
    	{
			var handlerNamespace = handlerType.split('.').slice(1);

			return (!baseEvent || handlerType.indexOf(baseEvent) === 0) && Utils.subset(handlerNamespace, eventNamespace);
		})
    	.forEach(function(handlerType) 
    	{
			var handlerBaseEvent = handlerType.split('.')[0];

		    for (var i = 0; i != this.event.handlers[type].length;) {
		        var store = this.event.handlers[type][i];

		        if (listener === undefined || store.listener === listener) {
					self.removeEventListener(handlerBaseEvent, store.handler);
		            this.event.handlers[type].splice(i, 1); 

		            if (listener === undefined)
		            	continue;
		            else
		            	break;
		        }

		        i++;
		    }
	    }.bind(this));

	    if (this.event.handlers[type].length == 0)
	    	delete this.event.handlers[type];
	}
}

export default EventComponent