# Drawer plugin

## Install

### NPM

You can install Movigo drawer plugin with NPM:

```bash
npm install @movigo/drawer --save
```
    
### CDN

You can also load it with CDNs:
    
```html
  <script src="https://unpkg.com/@movigo/core"></script> <!-- Required dependency -->
  <script src="https://unpkg.com/@movigo/drawer"></script>
```

## Usage

[Drawer plugin](https://github.com/movigo/drawer) allows you to animate sidebars
by creating a slide effect and obscuring the background container.

It is necessary to select a sidenav as target, and optionally the background container if you want to obscure it. It is possible define width, position, duration and easing function of the sidenav animation. In addition, you can specify whether to open or close the sidenav and define the background brightness of the container.

```js
  const sidenav = document.querySelector('.sidenav')
  const container = document.querySelector('.container')

  movigo.target([sidenav, container]).drawer({
    leftSide: false, // Defines the sidenav position: left or right (default: true)
    open: false, // To close or open the sidenav (default: true)
    width: 300, // Width of the sidenav (default: 200)
    duration: .5, // Animation duration (default: .3 on opening, 0.25 on closing)
    easing: 'linear', // Easing function (default: ease-in-out)
    backdropBrightness: 70 // Backdrop container brightness in % (default: 60)
  }).animate()
```

It's important to define some CSS properties in the sidenav to work correctly:

```html
  <style>
    .container {
      position: relative;
    }

    .sidenav {
      z-index: 999;
      position: absolute; /* Or fixed for fullscreen sidenav */
      width: 0;
      height: 100%;
      overflow-x: hidden;
    }
  </style>

  <div class="container">
    <button onclick="openSidenav()"></button>
      <div class="sidenav">
        Sidenav
      </div>
  </div>
```
