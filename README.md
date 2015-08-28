# Parallax
Parallax.js is a lightweight and simple mouse parallax effect. Simple to use 
and works with the mouse and soon reacts to the orientation of your smart device.




##Usage

```html
<div class="parallax-container">
	<img class="parallax" src="img/cd-img-1.jpg" data-power="1" alt="">
	<img class="parallax" src="img/cd-img-2.png" data-power=".6" alt="">
	<img class="parallax" src="img/cd-img-3.png" data-power=".3" alt="">
</div>
```

```javascript
var parallax = new Parallax( document.querySelector( '.parallax-container' ), {
	className: 'parallax',
	power: .1,
	axis: 'both',
	scope: 'global'
} );

```
