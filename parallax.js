/**********************************************************************************
 *
 * Parallax.js: Mouse parallax effect
 *
 * Parallax.js is a lightweight and simple mouse parallax effect. Simple to use 
 * and works with the mouse and reacts to the orientation of your smart device.
 * 
 *
 * @author:  Edgar Bermejo - @BuiltByEdgar - http://builtbyedgar.com/
 * @version: 0.1.2 - Beta (29/08/2015)
 * @repository: https://github.com/BuiltByEdgar/Parallax
 * @license: MIT License
 *
 *
 * @container { DOM Object }
 * @options { Object }:
 * @power: Float (default = .5). How much 3D effect to use (from 0 to 10).
 * @axis: "x", "y" or "both". In which axis to apply the "3D" effect.
 * @controls: "mouse" or "orientation". Determine which is the event to controll it.
 * @scope: "global" or "local". From which base coordinate system to calculate 
 * the mouse position and parallax effect.
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
		controls: 'mouse',
		scope: 'global'
	}

	this._extend( defaults, options );
	this.o = defaults;

	this.container = container;
	this.capture = null;
	this.el = [];

	this.transformPrefix = this._getPrefix( [ 'transform', '-ms-transform', '-moz-transform', '-webkit-transform', '-o-transform' ] );

	this.windowWidth = window.innerWidth;
	this.windowHeight = window.innerHeight;

	window.addEventListener( 'DOMContentLoaded', this._load.bind( this ), false );
	window.addEventListener( 'resize', this._resize.bind( this ), false );

};




// LOAD EVENT

Parallax.prototype._load = function () {

	// Check scope
	if ( this.o.scope === 'global' ) {
		this.capture = document;
	} else {
		this.capture = this.container;
	}

	// Check controlls
	if ( this.o.controls === 'orientation' || this._isMobile() ) {
		// TODO:
		// Calibrate device first
		this.orientation = { x: 0, y: 0, cx: 0, cy: 0 };
		window.addEventListener( 'deviceorientation', this._deviceOrientationHandler.bind( this ), false );
	} else {
		this.pointer = { x: 0, y: 0, cx: 0, cy: 0 };
		this.capture.addEventListener( 'mousemove', this._mouseMoveHandler.bind( this ), false );
	}

	this.el = document.getElementsByClassName( this.o.className );

	window.requestAnimFrame = ( function () {
            return  window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    null;
        })(); 


	this._run();

};



// DEVICE ORIENTATION HANDLER

Parallax.prototype._deviceOrientationHandler = function ( event ) { 

	this.orientation.x = ( event.gamma > 2 || event.gamma < -2 ) ? event.gamma : 0;	// left-to-right
	this.orientation.y = ( event.beta > 2 || event.beta < -2 ) ? event.beta : 0;	// front-to-back
	// this.orientation.a = event.alpha;	// Compass direction

};



// MOUSEMOVE EVENT HANDLER

Parallax.prototype._mouseMoveHandler = function ( event ) { 

	this.pointer.x = event.pageX;
	this.pointer.y = event.pageY;

};




// RUN

Parallax.prototype._run = function ( ) { 


	var self = this,
		vx = 0, 
		vy = 0;



	// Faster than forEach
	for ( var i = 0, l = this.el.length; i < l; i++ ) {

		var tx = 0, 
			ty = 0,
			item = self.el[ i ],
			power = ( item.dataset.power || self.o.power ) / 10;
		

		// Check controls
		if ( self.o.controls === 'orientation' || self._isMobile() ) {

			self.orientation.cx += ( self.orientation.x - self.orientation.cx ) / 10;
			self.orientation.cy += ( self.orientation.y - self.orientation.cy ) / 10;

			if ( self.o.axis === 'x' || self.o.axis === 'both' ) {
				tx = self.orientation.cx * 10 * -power;
			}
			if ( self.o.axis === 'y' || self.o.axis === 'both' ) {
				ty = self.orientation.cy * 10 * -power;
			}


		} else {
			
			self.pointer.cx += ( self.pointer.x - self.pointer.cx ) / 10;
			self.pointer.cy += ( self.pointer.y - self.pointer.cy ) / 10;
			
			if ( self.o.axis === 'x' || self.o.axis === 'both' ) {
				tx = ( self.pointer.cx - self.windowWidth * .5 ) * -power;
			}

			if ( self.o.axis === 'y' || self.o.axis === 'both' ) {
				ty = ( self.pointer.cy - self.windowHeight * .5 ) * -power;
			}

		}

		// Fix for Safari for iOS (for now)
		item.style.webkitTransform = 'matrix3d( 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + tx + ', ' + ty + ', 0, 1 )';
		// matrix3d to add 3d rotation
		item.style[ self.transformPrefix ] = 'matrix3d( 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + tx + ', ' + ty + ', 0, 1 )';

	}

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

	if ( navigator.userAgent.match( /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i ) ) {
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



