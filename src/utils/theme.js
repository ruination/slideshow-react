import * as Utils from './index';
import Theme from '../config/theme';
import invariant from 'invariant';

export function getViewClasses(props, device) {
	const classes = {
		[prefix(props)]: true,
	};

	if (props.viewSize) {
		let viewSize = Theme.SIZES[props.viewSize] || props.viewSize;

		if (device) {
			if (Utils.isString(viewSize)) {
				if (viewSize.startsWith('+'))
					viewSize = Theme.SIZES[Theme.Size.constrain(device.viewport.size + Number(viewSize.substr(1)))];
				else if (viewSize.startsWith('-'))
					viewSize = Theme.SIZES[Theme.Size.constrain(device.viewport.size - Number(viewSize.substr(1)))];
			}
			else if (Utils.isFunction(viewSize)) {
				viewSize = Theme.SIZES[Theme.Size.constrain(viewSize(device))];
			}
		}


		classes[prefix(props, viewSize)] = true;
	}

	if (props.viewStyle) {
		classes[prefix(props, props.viewStyle)] = true;
	}

	return classes;
}


export function prefix(props, variant) {
	invariant(
		props.viewClass != null,
		'A `viewClass` prop is required for this component'
	);
	
	return props.viewClass + (variant ? `-${variant}` : '');
}

function getViewProps(props) {
	return {
		viewClass: props.viewClass,
		viewSize: props.viewSize,
		viewStyle: props.viewStyle,
		viewType: props.viewType,
		viewRole: props.viewRole,
		viewPropagate: props.viewPropagate,
	};
}

function isViewProp(propName) {
	return (
		propName === 'viewClass' ||
		propName === 'viewSize' ||
		propName === 'viewStyle' ||
		propName === 'viewType' ||
		propName === 'viewPropagate' ||
		propName === 'viewRole'
	);
}

export function splitViewProps(props) {
	const elementProps = {};

	Object.entries(props).forEach(([propName, propValue]) => {
		if (!isViewProp(propName)) {
			elementProps[propName] = propValue;
		}
	});

	return [getViewProps(props), elementProps];
}


export function splitViewPropsAndOmit(props, omittedPropNames) {
	const isOmittedProp = {};
	const elementProps = {};
	
	omittedPropNames.forEach(propName => { isOmittedProp[propName] = true; });

	Object.entries(props).forEach(
		([propName, propValue]) => {
			if (!isViewProp(propName) && !isOmittedProp[propName]) {
				elementProps[propName] = propValue;
			}
		}
	);

	return [getViewProps(props), elementProps];
}