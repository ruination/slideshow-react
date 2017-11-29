import * as Utils from '../utils';

const Theme = {
	CLASSES: {
		'alert'					: 'alert',
		'button'				: 'btn',
		'button-group'			: 'btn-group',
		'button-toolbar'		: 'btn-toolbar',
		'column'				: 'col',
		'checkbox'				: 'checkbox',
		'input-group'			: 'input-group',
		'form'					: 'form',
		'form-group'			: 'form-group',		
		'form-control'			: 'form-control',		
		'form-control-static'	: 'form-control-static',		
		'form-control-feedback'	: 'form-control-feedback',		
		'icon'					: 'icon',
		'radio'					: 'radio',
		'label'					: 'label',
		'thumbnail'				: 'thumbnail',
		'list-group-item'		: 'list-group-item',
		'panel'					: 'panel',
		'panel-group'			: 'panel-group',
		'pagination'			: 'pagination',
		'progress-bar'			: 'progress-bar',
		'nav'					: 'nav',
		'navbar'				: 'navbar',
		'modal'					: 'modal',
		'menu-item'				: 'menu-item',
		'modal-title'			: 'modal-title',
		'modal-header'			: 'modal-header',
		'modal-footer'			: 'modal-footer',
		'modal-body'			: 'modal-body',
		'modal-dialog'			: 'modal-dialog',
		'modal-form'			: 'modal-form',
		'row'					: 'row',
		'well'					: 'well',
		'video'					: 'video',
		'studio'				: 'studio',
		'category'				: 'category',
		'star'					: 'star',
		'section'				: 'section',
	},

	STYLES: [
		'default',
		'primary',
		'secondary',
		'tertiary',
		'quaternary',
		'success',
		'info',
		'warning',
		'danger',
		'link',
		'inline',
		'tabs',
		'pills'
	],

	SIZES: {
		'inherit'	:	'inherit',
		'jumbo'		:	'jm',
		'super'		:	'su',
		'xlarge'	:	'xl',
		'large'		:	'lg',
		'medium'	:	'md',
		'small'		:	'sm',
		'xsmall'	:	'xs',
		'ssmall'	:	'ss',
		'xl'		:	'xl',
		'lg'		:	'lg',
		'md'		:	'md',
		'sm'		:	'sm',
		'xs'		:	'xs',
		'ss'		:	'ss',
		'1'			:	"ss",
		'2'			:	"xs",
		'3'			:	"sm",
		'4'			:	"md",
		'5'			:	"lg",
		'6'			:	"xl",
		'7'			:	"su",
		'8'			:	"jm",		
	},


	Size: {
		constrain: (size) => Math.min(Math.max(size, 1), 8),
	},

	GRID_COLUMNS: 12,
}

Theme.Size.PropTypes = Object.keys(Theme.SIZES).map(s => !isNaN(s) ? Number(s) : s);

Theme.PropTypes = {
	viewSize: function(props, propName, componentName) {
		if (	props[propName] === undefined
			||	Theme.Size.PropTypes.indexOf(props[propName]) !== -1
			||	Utils.isFunction(props[propName])
			||	(props[propName].length && (props[propName].substr(0, 1) == '+' || props[propName].substr(0, 1) == '-'))
		)
			return;

		return new Error(
			'Invalid prop `' + propName + '` [' + props[propName] + '] supplied to `' + componentName + '`. Validation failed. '
		);
	},
}


export const Size = {
	JUMBO		:	'jumbo',
	SUPER		:	'super',
	XLARGE		:	'xlarge',
	LARGE		:	'large',
	MEDIUM		:	'medium',
	SMALL		:	'small',
	XSMALL		:	'xsmall',
	SSMALL		:	'ssmall',
}

export const State = {
	SUCCESS		: 	'success',
	WARNING		: 	'warning',
	DANGER		: 	'danger',
	INFO		: 	'info',
}

export const Style = {
	DEFAULT		:	'default',
	PRIMARY		:	'primary',
	SECONDARY	:	'secondary',
	TERTIARY	:	'tertiary',
	QUATERNARY 	:	'quaternary',
	SUCCESS		:	'success',
	INFO		:	'info',
	WARNING		:	'warning',
	DANGER		:	'danger',
	LINK		:	'link',
	INVERSE		:	'inverse',
}

export default Theme