# Usage

Movigo is a very light and compact library, consisting of a core and optionally extendible
with external plugins. The library core consists of some simple functions, which offer
everything you need to create simple and complex animations using CSS keyframes.

## Target

The entry point of the library is the `target` function, which requires DOM element(s) to animate
as parameter. This parameter can be passed as a string selector or as DOM element(s) using
`querySelector` or `querySelectorAll` JavaScript functions.

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

* Option functions: `delay`, `duration`, `easing`, `loop`;
* Action functions `from`, `to`;
* Plugin functions: `list`, `focus`, `drawer`.

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

## Animation parameters

Each function updates an internal object, saved from time to time,
containing the `parameters`. The `parameters` object contain the values necessary for
the creation of the animations and correspond to the options
(set with option or plugin functions) and to the CSS
properties (set with action or plugin functions).

```js
  movigo.parameters() // Return default parameters.

  /* Default state of parameter object.
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

## Actions

Action functions allow you to change CSS property values. There are currently two function:
`to` and `from`. Both take an object containing CSS properties, and they work like in
a CSS keyframe: `from` values represent the initial state of the animation,
`to` values represent the final state. If `from` function is not defined, the initial state is
represented by the current CSS target properties.

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

Option functions allow you to set some properties of the animations, such as duration,
speed curve of the transition effect, delays or loops.
The number parameter of `delay` and `duration` functions must be defined in seconds, `easing` function parameter values
can be found in [W3S documentation](https://www.w3schools.com/CSSref/css3_pr_animation-timing-function.asp)
and `loop` function take a number of loops or nothing (infinite loop).

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

## Specific parameters

Option and action functions can get a function as parameter, in which the i-th element index
or the element itself can be used to define specific element options or actions.

```js
  const target = movigo.target('div')

  await target
    .delay((i, element) => i * .05) // Define specific delay for each element. 
    .easing('cubic-bezier(0.4, 0.0, 0.2, 1)')
    .to({ opacity: 1 }).animate()
```

## Plugins

Movigo allows you to extend the core of the library with additional functions,
for example to manage complex animations in a simple way.
The `addPlugin` function takes a simple function as input, which will
be added to existing plugins and then exposed in the functions chain object.

Below is an example of very simple code of the `list` plugin, which
sets the parameters to create animations for lists.

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

The plugin function must have `elements` and `animationParameters` parameters (ops! sorry for the repetition),
and if necessary it is possible to add other specific-plugin parameters (like `options` in the example).
Note that the animation parameters can also be updated by simply calling the action
and option functions after the plugin function, so that they are overwritten.

Therefore, a plugin is a function that changes the state of the animation parameters,
allowing the construction of complex animations in a few lines of code.