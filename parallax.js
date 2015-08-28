/**********************************************************************************
 *
 * Parallax.js: Mouse parallax effect
 *
 * Parallax.js is a lightweight and simple mouse parallax effect. Simple to use 
 * and works with the mouse and soon reacts to the orientation of your smart device.
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
 * @power: Float (default = .5). How much 3D effect to use (from 0 to 1)
 * @axis: "x", "y" or "both". In which axis to apply the "3D" effect
 * @scope: "global" or "local". From which base coordinate system to calculate 
 * the mouse position and parallax effect
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
		scope: 'global'
	}

	this._extend( defaults, options );
	this.o = defaults;

	this.container = container;
	this.capture = null;
	this.el = [];

	this.pointer = { x: 0, y: 0, cx: 0, cy: 0 };

	this.transformPrefix = this._getPrefix( [ 'transform', '-ms-transform', '-moz-transform', '-webkit-transform', '-o-transform' ] );

	this.windowWidth = window.innerWidth;
	this.windowHeight = window.innerHeight;

	window.addEventListener( 'DOMContentLoaded', this._load.bind( this ), false );
	window.addEventListener( 'resize', this._resize.bind( this ), false );

};




// LOAD EVENT

Parallax.prototype._load = function () {

	if ( this.o.scope === 'global' ) {
		this.capture = document;
	} else {
		this.capture = this.container;
	}


	this.capture.addEventListener( 'mousemove', this._mouseMoveHandler.bind( this ), false );

	this.el = document.getElementsByClassName( this.o.className );

	window.requestAnimFrame = (function() {
            return  window.requestAnimationFrame        || // Chromium
                    window.webkitRequestAnimationFrame  || // WebKit
                    window.mozRequestAnimationFrame     || // Mozilla
                    window.oRequestAnimationFrame       || // Opera
                    window.msRequestAnimationFrame      || // IE
                    null;
        })(); 

	this._run();

};



// MOUSEMOVE EVENT HANDLER

Parallax.prototype._mouseMoveHandler = function ( event ) { 

	this.pointer.x = event.pageX;
	this.pointer.y = event.pageY;

};




// RUN

Parallax.prototype._run = function ( ) { 


	var self = this,
		counter = 1,
		vx = 0, 
		vy = 0;
	
	
	this.pointer.cx += ( this.pointer.x - this.pointer.cx ) / 10;
	this.pointer.cy += ( this.pointer.y - this.pointer.cy ) / 10;
	vx = -( ( this.windowWidth * .5 ) - Math.max( 15, Math.min( this.pointer.cx, this.windowWidth - 15 ) ) );
	vy = -( ( this.windowHeight * .5 ) - Math.max( 0, Math.min( this.pointer.cy,this.windowHeight - 5 ) ) );
	
	
	[].forEach.call( this.el, function ( item ) {

		var ox = 0, 
			oy = 0,
			power = ( item.dataset.power || this.o.power ) / 10;
		
		if ( self.o.axis === 'x' || self.o.axis === 'both' ) {
			ox = ( vx - self.container.getBoundingClientRect().left - ( self.container.getBoundingClientRect().width * .5 ) ) * power * counter * -1 - item.getBoundingClientRect().width * .5 + self.container.getBoundingClientRect().width * .5;
		} 

		if ( self.o.axis === 'y' || self.o.axis === 'both' ) {
			oy = ( vy - self.container.getBoundingClientRect().top - ( self.container.getBoundingClientRect().height * .5 ) ) * power * counter * -1 - item.getBoundingClientRect().height * .5 + self.container.getBoundingClientRect().height * .5;
		}
		
		item.style[ self.transformPrefix ] = 'matrix3d( 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + ox + ', ' + oy + ', 0, 1 )';

		counter ++;

	});

	requestAnimFrame( this._run.bind( this ) );

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
	
	this.windowWidth = window.innerWidth;
	this.windowHeight = window.innerHeight;
	
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



