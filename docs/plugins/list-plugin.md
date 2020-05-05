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

[List plugin](https://github.com/movigo/list) allows you to create and manage animations for lists of elements,
with slide-in and fade-in effects.

It is possible to define initial coordinates and set a duration and an easing function
for each element, while the delay between the elements of the list is defined according to the duration.

```js
  const elements = document.querySelectorAll('li')

  await movigo.target(elements).list({
    x: 200, // Initial relative x coordinate (default: 0)
    y: 200, // Initial relative y coordinate (default: 100)
    duration: .5, // Animation duration (default: .3)
    easing: 'linear' // Easing function (default: 'cubic-bezier(0.0, 0.0, 0.2, 1)')
  }).animate()
```

