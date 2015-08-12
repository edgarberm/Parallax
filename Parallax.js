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

	console.info( this.o );

	this.container = container;
	this.capture = null;
	this.el = [];

	window.addEventListener( 'DOMContentLoaded', this._load.bind( this ), false );

};




// LOAD EVENT

Parallax.prototype._load = function () {

	var strength = this.o.power / 10;

	if ( this.o.detect === 'scroll' ) {
		this.capture = window;
	} else if ( this.o.scope === 'global' ) {
		this.capture = document;
	} else {
		this.capture = this.container;
	}

	this.capture.addEventListener( this.o.detect, this, false );

	this.el = document.getElementsByClassName( this.o.className );

};




// EVENT HANDLER

Parallax.prototype.handleEvent = function ( event ) { 

	var that = this;
	var counter = 1;
	var scrollLeft = ( window.pageXOffset !== undefined ) ? window.pageXOffset : ( document.documentElement || document.body.parentNode || document.body ).scrollLeft;
	var scrollTop = ( window.pageYOffset !== undefined ) ? window.pageYOffset : ( document.documentElement || document.body.parentNode || document.body ).scrollTop;
	
	if ( this.o.detect === 'scroll' ) {
		var xaxis = scrollLeft + window.innerWidth * .5;
		var yaxis = scrollTop + window.innerHeight * .5;
	} else {
		var xaxis = event.pageX;
		var yaxis = event.pageY;
	}
	
	
	[].forEach.call( this.el, function ( item ) {

		var offsetX = 0, 
			offsetY = 0;
		
		if ( that.o.axis === 'x' || that.o.axis === 'both' ) {
			offsetX = ( xaxis - that.container.getBoundingClientRect().left - ( that.container.getBoundingClientRect().width * .5 ) ) * that.o.power * counter * -1 - item.getBoundingClientRect().width * .5 + that.container.getBoundingClientRect().width * .5;
		} 

		if ( that.o.axis === 'y' || that.o.axis === 'both' ) {
			offsetY = ( yaxis - that.container.getBoundingClientRect().top - ( that.container.getBoundingClientRect().height * .5 ) ) * that.o.power * counter * -1 - item.getBoundingClientRect().height * .5 + that.container.getBoundingClientRect().height * .5;
		} 

		// Optimizada la animación con transformaciones CSS
		item.style.webkitTransform = 'translate3d( ' + offsetX + 'px, ' + offsetY + 'px, 0 )';

		counter ++;

	});

};




// MOBILE DETECT

Parallax.prototype._isMobile = function( agent ) {

	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( agent );
	
};



// EXTEND

Parallax.prototype._extend = function( opt, src ) {
	
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

