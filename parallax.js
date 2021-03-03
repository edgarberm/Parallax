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
 * @power: Float (default = 5). How much 3D effect to use (from -10 to 10).
 * @axis: "x", "y" or "both". In which axis to apply the "3D" effect.
 * @controls: "mouse" or "orientation". Determine which is the event to controll it.
 * @scope: "global" or "local". From which base coordinate system to calculate
 * the mouse position and parallax effect.
 *
 *
 **********************************************************************************/

"use strict";

// CONSTRUCTOR

function Parallax(container, options) {
  var defaults = {
    className: "parallax",
    power: 0.5,
    axis: "x",
    controls: "mouse",
    scope: "global",
  };

  this._extend(defaults, options);
  this.o = defaults;

  this.container = container;
  this.capture = null;
  this.el = [];

  this.transformPrefix = this._getPrefix([
    "transform",
    "-ms-transform",
    "-moz-transform",
    "-webkit-transform",
    "-o-transform",
  ]);

  window.addEventListener("DOMContentLoaded", this._load.bind(this), false);
}

// LOAD EVENT

Parallax.prototype._load = function () {
  // Check scope
  if (this.o.scope === "global") {
    this.capture = window;
    this.windowWidth = this.capture.innerWidth;
    this.windowHeight = this.capture.innerHeight;
  } else {
    this.capture = this.container;
    this.windowWidth = this.capture.getBoundingClientRect().width;
    this.windowHeight = this.capture.getBoundingClientRect().height;
  }

  // Check controlls
  if (this.o.controls === "orientation" || this._isMobile()) {
    // TODO:
    // Calibrate device first
    this.orientation = {
      x: 0,
      y: 0,
      cx: this.capture.innerWidth * 0.5,
      cy: this.capture.innerHeight,
    };
    window.addEventListener(
      "deviceorientation",
      this._deviceOrientationHandler.bind(this),
      false
    );
  } else {
    this.pointer = { x: 0, y: 0, cx: 0, cy: 0 };
    this.capture.addEventListener(
      "mousemove",
      this._mouseMoveHandler.bind(this),
      false
    );
  }

  this.el = document.getElementsByClassName(this.o.className);

  this.windowWidth = this.capture.innerWidth;
  this.windowHeight = this.capture.innerHeight;

  window.addEventListener("resize", this._resize.bind(this), false);

  window.requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      null
    );
  })();

  this._run();
};

// DEVICE ORIENTATION HANDLER

Parallax.prototype._deviceOrientationHandler = function (event) {
  this.orientation.x = event.gamma > 2 || event.gamma < -2 ? event.gamma : 0; // left-to-right
  this.orientation.y = event.beta > 2 || event.beta < -2 ? event.beta : 0; // front-to-back
  // this.orientation.a = event.alpha;	// Compass direction
};

// MOUSEMOVE EVENT HANDLER

Parallax.prototype._mouseMoveHandler = function (event) {
  this.pointer.x = event.pageX;
  this.pointer.y = event.pageY;
};

// RUN

Parallax.prototype._run = function () {
  // Check controls
  if (this.o.controls === "orientation" || this._isMobile()) {
    this.orientation.cx += (this.orientation.x - this.orientation.cx) / 10;
    this.orientation.cy += (this.orientation.y - this.orientation.cy) / 10;
  } else {
    this.pointer.cx += (this.pointer.x - this.pointer.cx) / 10;
    this.pointer.cy += (this.pointer.y - this.pointer.cy) / 10;
  }

  // Loop for is faster than forEach and keep 'this' scope
  for (var i = 0, len = this.el.length; i < len; i++) {
    var tx = 0,
      ty = 0,
      item = this.el[i],
      power = (item.dataset.power || this.o.power) / 10;

    // Check controls
    if (this.o.controls === "orientation" || this._isMobile()) {
      if (this.o.axis === "x" || this.o.axis === "both") {
        tx = this.orientation.cx * 10 * -power;
      }
      if (this.o.axis === "y" || this.o.axis === "both") {
        ty = this.orientation.cy * 10 * -power;
      }
    } else {
      if (this.o.axis === "x" || this.o.axis === "both") {
        tx = (this.pointer.cx - this.windowWidth * 0.5) * -power;
      }

      if (this.o.axis === "y" || this.o.axis === "both") {
        ty = (this.pointer.cy - this.windowHeight * 0.5) * -power;
      }
    }

    // matrix3d to add 3d rotation soon
    // Fix for Safari for iOS (for now)
    item.style[this.transformPrefix] = item.style.webkitTransform =
      "matrix3d( 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, " +
      tx +
      ", " +
      ty +
      ", 0, 1)";
  }

  requestAnimFrame(this._run.bind(this));
};

// GET PREFIX
// @prefixex { Array }

Parallax.prototype._getPrefix = function (prefixes) {
  var tmp = document.createElement("div"),
    result = "";

  for (var i = 0; i < prefixes.length; i++) {
    if (typeof tmp.style[prefixes[i]]) {
      result = prefixes[i];
      break;
    } else {
      result = null;
    }
  }

  return result;
};

// RESIZE

Parallax.prototype._resize = function (event) {
  this.windowWidth = this.capture.innerWidth;
  this.windowHeight = this.capture.innerHeight;
};

// MOBILE DETECT

Parallax.prototype._isMobile = function (agent) {
  if (
    navigator.userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i
    )
  ) {
    return true;
  } else {
    return false;
  }
};

// EXTEND

Parallax.prototype._extend = function (opt, src) {
  for (var p in src) {
    if (src[p] && src[p].constructor && src[p].constructor === Object) {
      opt[p] = opt[p] || {};
      arguments.callee(opt[p], src[p]);
    } else {
      opt[p] = src[p];
    }
  }

  return opt;
};
