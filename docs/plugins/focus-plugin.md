# Focus plugin

## Install

### NPM

You can install Movigo focus plugin with NPM:

```bash
npm install @movigo/focus --save
```
    
### CDN

You can also load it with CDNs:
    
```html
  <script src="https://unpkg.com/@movigo/core"></script> <!-- Required dependency -->
  <script src="https://unpkg.com/@movigo/focus"></script>
```

## Usage

[Focus plugin](https://github.com/movigo/focus) function creates an animation to focus an element by scaling it and obscuring the other background elements. In this way two keyframes are created, or if no element is selected, all the elements are reset to the initial conditions with a unique keyframe. 

It is possible to select the element to focus and define the size of the scaling, the brightness of the background elements, the duration and the easing function of the animation. Default values assume a large transaction area.

```js
  const images = document.querySelectorAll('img')

  movigo.target(images).focus({
    element: 1, // Index of the element to focus (default: -1 -> no focused elements)
    scale: [1.5, 1.5], // Dimensions to scale focused element (default: [2, 2]) 
    backdropBrightness: 80, // Backdrop element brightness in % (default: 60)
    duration: .5, // Animation duration (default: .3)
    easing: 'linear', // Easing function (default: cubic-bezier(0.34, 1.56, 0.64, 1))
  }).animate()
``` 
