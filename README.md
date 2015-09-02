# Parallax
Parallax.js is a lightweight and simple mouse parallax effect. Simple to use 
and works with the mouse and reacts to the orientation of your smart device.




##Usage

```html
<div class="parallax-container">
	<div class="parallax box3" data-power="3"></div>
	<div class="parallax box2" data-power="2"></div>
	<div class="parallax box1" data-power="1"></div>
</div>
```

```javascript
var parallax = new Parallax( document.querySelector( '.parallax-container' ), {
	className: 'parallax',
	power: .1,
	axis: 'both',
	controls: 'mouse',
	scope: 'global'
} );

```
