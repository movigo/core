# Components 

## Target

The entry point of the library is the `target` function, which requires one or more DOM elements as parameter. The parameter can be passed as a string selector or using `querySelector` or `querySelectorAll` JavaScript functions.

```js
  const target = movigo.target('#circle')

  // or:

  const element = document.querySelector('#square')
  const target = movigo.target(element)

  // or:

  const elements = document.querySelectorAll('div')
  const target = movigo.target(elements)
```

The `target` function return an object containing the functions necessary to create the animations,
that can be divided in:

* Option functions:  determine the behavior of animations (`delay`, `duration`, `easing`, `loop`);
* Action functions: determine animation stages and which CSS properties must be animated (`from`, `to`);
* Plugin functions: add features to core library (`list`, `focus`, `drawer`).

Each of these functions, in turn, returns the same function object with an additional
`animate` function, used precisely as final function to start the animation.
In this way it is possible to create function chains with the
[method chaining](https://en.wikipedia.org/wiki/Method_chaining) technique.

```js
  target.duration(.8) // Option function.

  target.to({ width: '200px' }) // Action function.

  target.to({ width: '200px' }) // List plugin function.

  // Create the animation and wait for the end.
  await target.duration(.8).to({ width: '200px' }).animate()
```

Each chain function processes and updates an internal object, containing the `animation parameters`. This object is used in the last `animate` function to create the animations and it contains the following properties: `delay`, `duration`, `easing` and `loop` set with option functions, and `to` and `from` set with action functions. Plugin functions can set all the animation parameters.

```js
  movigo.parameters() // Return default parameters.

  /* Default state of the animation parameter object.
  {
    duration: 0.3,
    delay: 0,
    easing: 'linear',
    loop: 0,
    from: {},
    to: {}
  }
  */
```

A new state of this object is saved for each function of the chain, making it
possible to reuse a particular state to create multiple animations.

```js
  const slowAnimation = target.duration(10) // 10 seconds.
    
  slowAnimation.parameters() // Return chain-specific parameters.

  /* State of parameter object saved in slowAnimation object scope.
  {
    duration: 10,
    delay: 0,
    easing: 'linear',
    loop: 0,
    from: {},
    to: {}
  }
  */

  // Create two different animations with same duration (saved in slowAnimation object scope).
  await slowAnimation.to({ width: 200 }).animate()
  await slowAnimation.to({ height: 200 }).animate()
```

Option and action functions can also get a function as parameter, in which the i-th element index or the element itself can be used to define specific element options or actions.

```js
  const target = movigo.target('div')

  await target
    .delay((i, element) => i * .05) // Define specific delay for each element. 
    .easing('cubic-bezier(0.4, 0.0, 0.2, 1)')
    .to({ opacity: 1 }).animate()
```

## Actions

Action functions allow you to determine animation stages and which CSS properties must be animated. There are currently two function: `to` and `from`. Both take an object containing CSS properties and work like in a CSS keyframe: `from` properties represent the initial state of the animation and `to` properties represent the final state. If `from` function is not defined, the initial state is represented by the current CSS properties of the elements to animate.

```js
  movigo.actions() // Return a list of available action functions as strings.

  /*
  ['from', 'to']
  */

  await target.from({
    width: 0,
    height: 0
  }).to({
    width: 200,
    height: 200
  }).animate()
```

## Options

Option functions allow you to determine the behavior of animations with some properties of the animations, such as duration, speed curve of the transition effect, delays or loops. The number parameter of `delay` and `duration` functions must be defined in seconds, `easing` function parameter values can be found in [W3S documentation](https://www.w3schools.com/CSSref/css3_pr_animation-timing-function.asp) and `loop` function take a number of loops or nothing (if defined without parameters set an infinite loop).

```js
  movigo.options() // Return a list of available option functions as strings.

  /*
  ['delay', 'duration', 'easing', 'loop']
  */

  await target
    .duration(.5).delay(1).easing('ease-in-out').loop(2)
    .to({ opacity: .5 })
    .animate()
```

## Plugins

Movigo allows you to extend the core of the library with additional functions, for example to manage complex animations in a simple way. The `addPlugin` function takes a simple function as input, which will be added to existing plugins and then exposed in the function chain object.

Below is an example of very simple code of the `list` plugin, which sets the parameters to create animations for lists.

```js
  /**
   * Prepare animation parameters to create a list animation.
   * @param {Element[] | NodeList} elements
   * @param {object} animationParameters
   * @param {object} options
   */
  function list (elements, animationParameters, options) {
    options = {
      x: 0, y: 100,
      duration: .3,
      easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      ...options
    }

    for (const element of elements) {
      element.style.transform = `translate(${options.x}px, ${options.y}px)`
      element.style.opacity = '0'
    }

    animationParameters.duration = options.duration
    animationParameters.easing = options.easing
    animationParameters.delay = Array.from(elements).map((element, i) => i * options.duration / 3)
    animationParameters.to = { opacity: 1, transform: 'translateY(0px)' }

    // One moment! Where is 'return'??
    // No 'return' is needed, because animationParameters is an object
    // and objects, in JS, are passed as reference.
  }

  addPlugin(list)

  await movigo.target('div').list({
    x: -100, y: 0, // Horizontal animation, from left.
  }).animate()
```

A plugin function must have internal `elements` and `animationParameters` parameters, and possibly you can add other parameters (like `options` in the example) usable when plugin function is called as chain function. Clearly, the `animation parameters` can also be updated by simply calling the action and option functions after the plugin function, so that they are overwritten.

Therefore, a plugin is a function that changes the state of the animation parameters, allowing you to create complex animations in a few lines of code.
