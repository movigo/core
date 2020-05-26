# List plugin

## Install

### NPM

You can install Movigo list plugin with NPM:

```bash
npm install @movigo/list --save
```
    
### CDN

You can also load it with CDNs:
    
```html
  <script src="https://unpkg.com/@movigo/core"></script> <!-- Required dependency -->
  <script src="https://unpkg.com/@movigo/list"></script>
```

## Usage

[List plugin](https://github.com/movigo/list) function creates an animation for lists of elements with slide-in and fadein effects. In particular, it create an animation for each element of the list using the same keyframe and adequately defining `transform` and `opacity` CSS properties, and start each element with a delay defined according to the duration of the animation (1/3 of the duration).

It is possible to define the initial coordinates, the duration and the easing function for each element. Default coordinates and duration are defined assuming a large transition area, while the default easing function simulates a fast start and a constant decelaration of the elements.

```js
  const elements = document.querySelectorAll('li')

  await movigo.target(elements).list({
    x: 200, // Initial relative x coordinate (default: 0)
    y: 200, // Initial relative y coordinate (default: 100)
    duration: .5, // Animation duration (default: .3)
    easing: 'linear' // Easing function (default: 'cubic-bezier(0.0, 0.0, 0.2, 1)')
  }).animate()
```

