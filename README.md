# Parallax
Parallax.js is a lightweight and simple parallax effect. Simple to use and works with the mouse, with the scroll and reacts to the orientation of your smart device.


##Usage

```html
<div id="parallax-container" class="parallax-container-images">
	<img class="parallax" src="img-1.jpg" data-power=".15">
	<img class="parallax" src="img-2.png" data-power=".1">
	<img class="parallax" src="img-3.png" data-power=".05">
</div>
```

```javascript
var parallax = new Parallax( document.getElementById( 'parallax-container' ), {
		className: 'parallax',
		power: .1,
		axis: 'both',
		scope: 'global',
		detect: 'mousemove'
} );

```
