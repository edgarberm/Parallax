/**********************************************************************************
 *
 * Parallax.js: Parallax effects
 *
 * Parallax.js is a lightweight and simple parallax effect. Simple to use and works 
 * with the mouse, with the scroll and reacts to the orientation of your smart device.
 * 
 *
 * @author:  Edgar Bermejo - @BuiltByEdgar - http://builtbyedgar.com/
 * @version: 0.0.1 - Beta (11/07/2015)
 * @repository: https://github.com/BuiltByEdgar/Parallax
 * @license: MIT License
 *
 *
 * @container { DOM Object }
 * @options { Object }:
 * - @strength: Int	(default = 5). How much 3D effect to use (from 0 to 1)
 * - @axis: "x" or "y" or "both". In which axis to apply the "3D" effect
 * - @scope: "global" or "local". From which base coordinate system to calculate 
 * the mouse position and parallax effect
 * - @detect: "mousemove" or "scroll". Either use the mouse position as a reference or the 
 * page scroll position
 *
 *
 **********************************************************************************/


'use strict';




// CONSTRUCTOR

function Parallax ( container, options ) {

	var defaults = {
		className: 'parallax',
		power: .5,
		axis: 'x',
		scope: 'global',
		detect: 'mousemove'
	}

	this._extend( defaults, options );
	this.o = defaults;

	this.container = container;
	this.capture = null;
	this.el = [];

	this.raf;

	this.windowHalfWidth = window.innerWidth * .5;
	this.windowHalfHeight = window.innerHeight * .5;

	window.addEventListener( 'DOMContentLoaded', this._load.bind( this ), false );
	window.addEventListener( 'resize', this._resize.bind( this ), false );

};




// LOAD EVENT

Parallax.prototype._load = function () {

	if ( this.o.detect === 'scroll' ) {
		this.capture = window;
	} else if ( this.o.scope === 'global' ) {
		this.capture = document;
	} else {
		this.capture = this.container;
	}

	this.transformPrefix = this._getPrefix( [ 'transform', '-ms-transform', '-moz-transform', '-webkit-transform', '-o-transform' ] );

	this.capture.addEventListener( this.o.detect, this, false );

	if ( this._isMobile() ) {
		if ( window.DeviceMotionEvent ) {
			window.addEventListener( 'ondevicemotion', this );
		} else {
			alert( "Sorry, your browser doesn't support Device Orientation" );
		}
	}

	this.el = document.getElementsByClassName( this.o.className );

};




// EVENT HANDLER

Parallax.prototype.handleEvent = function ( event ) { 

	event.preventDefault();

	var that = this,
		counter = 1,
		scrollLeft = ( window.pageXOffset !== undefined ) ? window.pageXOffset : ( document.documentElement || document.body.parentNode || document.body ).scrollLeft,
		scrollTop = ( window.pageYOffset !== undefined ) ? window.pageYOffset : ( document.documentElement || document.body.parentNode || document.body ).scrollTop,
		axisX = 0, 
		axisY = 0,
		rotateX = 0, 
		rotateY = 0;
	
	if ( this.o.detect === 'scroll' ) {
		axisX = scrollLeft + window.innerWidth * .5;
		axisY = scrollTop + window.innerHeight * .5;
	} else if ( this._isMobile() ) {
		axisY = event.accelerationIncludingGravity.y * 3;
		axisX = event.accelerationIncludingGravity.x * 3;
	} else {
		axisX = event.pageX;
		axisY = event.pageY;
	}
	
	
	[].forEach.call( this.el, function ( item ) {

		var offsetX = 0, 
			offsetY = 0,
			power = item.dataset.power || this.o.power;
		
		if ( that.o.axis === 'x' || that.o.axis === 'both' ) {
			offsetX = ( axisX - that.container.getBoundingClientRect().left - ( that.container.getBoundingClientRect().width * .5 ) ) * power * counter * -1 - item.getBoundingClientRect().width * .5 + that.container.getBoundingClientRect().width * .5;
		} 

		if ( that.o.axis === 'y' || that.o.axis === 'both' ) {
			offsetY = ( axisY - that.container.getBoundingClientRect().top - ( that.container.getBoundingClientRect().height * .5 ) ) * power * counter * -1 - item.getBoundingClientRect().height * .5 + that.container.getBoundingClientRect().height * .5;
		}

		
		// matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1)
		// matrix3d( 1,	0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 );
		item.style[ that.transformPrefix ] = 'matrix3d( 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + offsetX + ', ' + offsetY + ', 0, 1 )';

		counter ++;

	});

};




// GET PREFIX
// @prefixex { Array }

Parallax.prototype._getPrefix = function ( prefixes ) {
	
	var tmp = document.createElement( 'div' ),
		result = '';

	for ( var i = 0; i < prefixes.length; i++ ) {
		
		if ( typeof tmp.style[ prefixes[ i ] ] ) {
			result = prefixes[ i ];
			break;
		} else {
			result = null;
		}
	}
	
	return result;

};




// RESIZE

Parallax.prototype._resize = function ( event ) {
	
	this.windowHalfWidth = window.innerWidth * .5;
	this.windowHalfHeight = window.innerHeight * .5;
	
};


// MOBILE DETECT

Parallax.prototype._isMobile = function ( agent ) {

	if ( navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) ) {
		return true;
	} else {
		return false;
	}
	
};



// EXTEND

Parallax.prototype._extend = function ( opt, src ) {
	
	for ( var p in src ) {
		if ( src[ p ] && src[ p ].constructor && src[ p ].constructor === Object ) {
			opt[ p] = opt[ p ] || {};
			arguments.callee( opt[ p ], src[ p ] );
		} else {
			opt[ p ] = src[ p ];
		}
	}

	return opt;
};



