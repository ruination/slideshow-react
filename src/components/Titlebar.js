import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from '../components/BaseComponent';
import Context from '../config/context';
import * as Classes from '../utils/classes';
import Electron from 'electron';

const noop = event => event.preventDefault();

class WindowIcon extends BaseComponent {
	constructor(props, context) {
  		super(props, context);

  		this.state = 
  		{
  			hover: false,
  		};

  		this._bind(
  			"onMouseOver",
  			"onMouseOut",
		)
  	}

  	onMouseOver(event) {
  		if (!this.state.hover)
  			this.setState({hover: true})
  	}

  	onMouseOut(event) {
  		if (this.state.hover)
  			this.setState({hover: false})
  	}

  	render() {
  		const
  			props = this.props,
  			{
  				...other,
  			} = props
  		;

  		return <div {...other} onMouseOut={this.onMouseOut} onMouseOver={this.onMouseOver}></div>
  	}
}

class Titlebar extends BaseComponent {
	static contextTypes = Context.General

	constructor(props, context) {
  		super(props, context);

  		this.state = 
  		{
  			isFullscreen: false,
  		};

		this._window = Electron.remote.getCurrentWindow();

  		this._bind(
			"onMinimize",
			"onResize",
			"onMaximize",
			"onUnmaximize",
			"onClose",
		);
 	}

 	componentDidMount() {
 		this._window.addListener('maximize', this.onMaximize);
 		this._window.addListener('unmaximize', this.onUnmaximize);
 	}

 	componentWillUnmount() {
 		this._window.removeListener('maximize', this.onMaximize);
 		this._window.removeListener('unmaximize', this.onUnmaximize);
 	}
  
    onMinimize(event) {
    	if (event)
    		event.preventDefault();
    	
		this._window.minimize();
    }

    onResize(event) {
    	if (event)
    		event.preventDefault();
    	
		if (!this._window.isMaximized())
			this._window.maximize();
        else 
        	this._window.unmaximize();
    }


    onMaximize(event) {
    	if (event)
    		event.preventDefault();

        this.setState({isFullscreen: true});
    }

    onUnmaximize(event) {
    	if (event)
    		event.preventDefault();
    	
        this.setState({isFullscreen: false});
    }
  
    onClose(event) {
    	if (event)
    		event.preventDefault();
    	
        this._window.close();
    }

	render() {
		const 
			props = this.props,
			{
				children,
				draggable,
				darkMode,
				className,
				...other,
			} = props,
			state = this.state,
			{
				isFullscreen,
			} = state,
			context = this.context,
			{
				T,
				TC,
				IMAGE,
			} 	= context,
			titlebarClass = {
				'titlebar': true,
				'fullscreen': isFullscreen,
				'draggable': draggable,
				'titlebar-light': !darkMode,
			}
		;

		return (
			<div className={Classes.combine(className, titlebarClass)}>
				<div className="titlebar-content">
					<div className="titlebar-name">
						<span className="titlebar-name-content">
							slideshow-react
						</span>
					</div>

				    <div className="titlebar-controls">
				        <WindowIcon className="titlebar-minimize" onClick={this.onMinimize} onMouseUp={noop}>
				            <svg x="0px" y="0px" viewBox="0 0 10 1">
				                <rect width="10" height="1"></rect>
				            </svg>
				        </WindowIcon>
				        
				        <WindowIcon className="titlebar-resize" onClick={this.onResize} onMouseUp={noop}>
				            <svg className="fullscreen-svg" x="0px" y="0px" viewBox="0 0 10 10">
				                <path d="M 0 0 L 0 10 L 10 10 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 9 L 1 9 L 1 1 z "/>
				            </svg>
				            <svg className="maximize-svg" x="0px" y="0px" viewBox="0 0 10 10">
				                <mask id="Mask">
				                    <rect width="10" height="10"></rect>
				                    <path d="M 3 1 L 9 1 L 9 7 L 8 7 L 8 2 L 3 2 L 3 1 z"/>
				                    <path d="M 1 3 L 7 3 L 7 9 L 1 9 L 1 3 z"/>
				                </mask>
				                <path d="M 2 0 L 10 0 L 10 8 L 8 8 L 8 10 L 0 10 L 0 2 L 2 2 L 2 0 z" mask="url(#Mask)"/>
				            </svg>
				        </WindowIcon>

				        <WindowIcon className="titlebar-close" onClick={this.onClose} onMouseUp={noop}>
				            <svg x="0px" y="0px" viewBox="0 0 10 10">
				                <polygon points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5"></polygon>
				            </svg>
				        </WindowIcon>
				    </div>
			    </div>
			</div>
		);
	} 	
}

Titlebar.propTypes = {
	draggable: PropTypes.bool,
	darkMode: PropTypes.bool,
}

Titlebar.defaultProps = {
	draggable: true,
	darkMode: true,
}

export default Titlebar
