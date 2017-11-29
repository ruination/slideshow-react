import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { createChainedFunction } from '../utils';
import BaseComponent from '../components/BaseComponent';
import Supports from '../utils/supports';

class ViewSwipeable extends BaseComponent {
	constructor(props) {
  		super(props);
  
  		this.state = {
			x: null,
			y: null,
			swiping: false,
			start: 0
		}

  		this._bind("calculatePos", "touchStart", "touchMove", "touchEnd", "mouseStart", "mouseMove", "mouseEnd");
	}


	componentDidMount() {
		const element = findDOMNode(this);

		element.addEventListener("touchstart", this.touchStart)
		element.addEventListener("touchmove", this.touchMove)
		element.addEventListener("touchend", this.touchEnd)
	}

	componentWillUnmount() {
		const element = findDOMNode(this);

		element.removeEventListener("touchstart", this.touchStart)
		element.removeEventListener("touchmove", this.touchMove)
		element.removeEventListener("touchend", this.touchEnd)
	}

	calculatePos(e) {
		var x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
		var y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY

		var xd = this.state.x - x
		var yd = this.state.y - y

		var axd = Math.abs(xd)
		var ayd = Math.abs(yd)

		return {
			deltaX: xd,
			deltaY: yd,
			absX: axd,
			absY: ayd
		}
	}

	mouseStart(e) {
		if (Supports.touch) return;

		this.setState({
			start: Date.now(),
			x: e.clientX,
			y: e.clientY,
			swiping: false
		})
	}

	mouseMove(e) {
		if (Supports.touch) return;

		if (!this.state.x || !this.state.y ) {
			return
		}

		var pos = this.calculatePos(e)

		if (pos.absX < this.props.delta && pos.absY < this.props.delta) {
			return
		}

		if (this.props.onSwiping) {
			this.props.onSwiping(e, pos.deltaX, pos.deltaY, pos.absX, pos.absY)
		}

		if (pos.absX > pos.absY) {
			if (pos.deltaX > 0) {
				if (this.props.onSwipingLeft) {
					this.props.onSwipingLeft(e, pos.absX)
				}
			} else {
				if (this.props.onSwipingRight) {
					this.props.onSwipingRight(e, pos.absX)
				}
			}
		} else {
			if (pos.deltaY > 0) {
				if (this.props.onSwipingUp) {
					this.props.onSwipingUp(e, pos.absY)
				}
			} else {
				if (this.props.onSwipingDown) {
					this.props.onSwipingDown(e, pos.absY)
				}
			}
		}

		if (!this.state.swiping)
			this.setState({ swiping: true })

		e.preventDefault()
	}	

	mouseEnd(e) {
		if (this.state.swiping) {
			if (Supports.touch) return;

			var pos = this.calculatePos(e)

			var time = Date.now() - this.state.start
			var velocity = Math.sqrt(pos.absX * pos.absX + pos.absY * pos.absY) / time
			var isFlick = velocity > this.props.flickThreshold

			this.props.onSwiped && this.props.onSwiped(
				e,
				pos.deltaX,
				pos.deltaY,
				isFlick,
				velocity
			)
			
			if (pos.absX > pos.absY) {
				if (pos.deltaX > 0) {
					this.props.onSwipedLeft && this.props.onSwipedLeft(e, pos.deltaX, isFlick)
				} else {
					this.props.onSwipedRight && this.props.onSwipedRight(e, pos.deltaX, isFlick)
				}
			} else {
				if (pos.deltaY > 0) {
					this.props.onSwipedUp && this.props.onSwipedUp(e, pos.deltaY, isFlick)
				} else {
					this.props.onSwipedDown && this.props.onSwipedDown(e, pos.deltaY, isFlick)
				}
			}
		}
		else if (e.type == "mouseup") {
			this.props.onMouseClick && this.props.onMouseClick(e)
		}

		if (Supports.touch) return;

		e.preventDefault();
		
		this.setState({
			x: null,
			y: null,
			swiping: false,
			start: 0
		})
	}	

	touchStart(e) {
		if (e.touches.length > 1) {
			return
		}

		this.setState({
			start: Date.now(),
			x: e.touches[0].clientX,
			y: e.touches[0].clientY,
			swiping: false
		})
	}
	
	touchMove(e) {
		if (e.touches.length > 1)
			return;

		if (!this.state.x || !this.state.y) {
			this.setState({
				start: Date.now(),
				x: e.touches[0].clientX,
				y: e.touches[0].clientY,
				swiping: false
			})


			return;
		}

		var cancelPageSwipe = false
		var pos = this.calculatePos(e)

		if (pos.absX < this.props.delta && pos.absY < this.props.delta) {
			return
		}

		if (!this.state.swiping && (!this.props.deltaStartX || pos.absX < this.props.deltaStartX) && (!this.props.deltaStartY || pos.absY < this.props.deltaStartY))
			return

		if (this.props.onSwiping) {
			this.props.onSwiping(e, pos.deltaX, pos.deltaY, pos.absX, pos.absY)
		}

		if (pos.absX > pos.absY) {
			if (pos.deltaX > 0) {
				if (this.props.onSwipingLeft) {
					this.props.onSwipingLeft(e, pos.absX)
					cancelPageSwipe = true
				}
			} else {
				if (this.props.onSwipingRight) {
					this.props.onSwipingRight(e, pos.absX)
					cancelPageSwipe = true
				}
			}
		} else {
			if (pos.deltaY > 0) {
				if (this.props.onSwipingUp) {
					this.props.onSwipingUp(e, pos.absY)
					cancelPageSwipe = true
				}
			} else {
				if (this.props.onSwipingDown) {
					this.props.onSwipingDown(e, pos.absY)
					cancelPageSwipe = true
				}
			}
		}

		if (cancelPageSwipe || this.state.swiping) {
			e.preventDefault()
			e.stopPropagation()
		}

		if (!this.state.swiping)
			this.setState({ swiping: true })
	}

	touchEnd(e) {
		if (this.state.swiping) {
			var pos = this.calculatePos(e)

			var time = Date.now() - this.state.start
			var velocity = Math.sqrt(pos.absX * pos.absX + pos.absY * pos.absY) / time
			var isFlick = velocity > this.props.flickThreshold

			this.props.onSwiped && this.props.onSwiped(
				e,
				pos.deltaX,
				pos.deltaY,
				isFlick,
				velocity * 10
			)
			
			if (pos.absX > pos.absY) {
				if (pos.deltaX > 0) {
					this.props.onSwipedLeft && this.props.onSwipedLeft(e, pos.deltaX, isFlick)
				} else {
					this.props.onSwipedRight && this.props.onSwipedRight(e, pos.deltaX, isFlick)
				}
			} else {
				if (pos.deltaY > 0) {
					this.props.onSwipedUp && this.props.onSwipedUp(e, pos.deltaY, isFlick)
				} else {
					this.props.onSwipedDown && this.props.onSwipedDown(e, pos.deltaY, isFlick)
				}
			}
		}
		
		this.setState({
			x: null,
			y: null,
			swiping: false,
			start: 0
		})
	}

	render() {
		const 
			{
				children,
				onSwiped,
				onSwiping,
				onSwipingUp,
				onSwipingRight,
				onSwipingDown,
				onSwipingLeft,
				onSwipedUp,
				onSwipedRight,
				onMouseClick,
				onSwipedDown,
				onSwipedLeft,
				flickThreshold,
				deltaStartX,
				delta,
				...props,
			} = this.props
		;

		return (
			<div
				{...props}
				onMouseDown={createChainedFunction(this.mouseStart, this.props.onMouseDown)}
				onMouseMove={createChainedFunction(this.mouseMove, this.props.onMouseMove)}
				onMouseLeave={createChainedFunction(this.mouseEnd, this.props.onMouseLeave)}
				onMouseUp={createChainedFunction(this.mouseEnd, this.props.onMouseUp)}
				>
					{children}
			</div>  
		)
	}
}

ViewSwipeable.propTypes = {
	onSwiped: PropTypes.func,
	onSwiping: PropTypes.func,
	onSwipingUp: PropTypes.func,
	onSwipingRight: PropTypes.func,
	onSwipingDown: PropTypes.func,
	onSwipingLeft: PropTypes.func,
	onSwipedUp: PropTypes.func,
	onMouseClick: PropTypes.func,
	onSwipedRight: PropTypes.func,
	onSwipedDown: PropTypes.func,
	onSwipedLeft: PropTypes.func,
	flickThreshold: PropTypes.number,
	delta: PropTypes.number,
	deltaStartX: PropTypes.number
}

ViewSwipeable.defaultProps = {
	flickThreshold: 0.6,
	delta: 1,
	deltaStartX: 50
}

export default ViewSwipeable
