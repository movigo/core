import { checkBuiltInTypes, getElement, isDomElement } from './utils'

/** Action and parameter definitions: '<functionName>: <parameterTypes>' **/

// List of all available transformations with types.
const availableTransformations = {
  matrix: 'string number',
  translate: 'string',
  translateX: 'string',
  translateY: 'string',
  translateZ: 'string',
  scale: 'string number',
  scaleX: 'string number',
  scaleY: 'string number',
  scaleZ: 'string number',
  rotate: 'string',
  rotateX: 'string',
  rotateY: 'string',
  rotateZ: 'string',
  skew: 'string',
  skewX: 'string',
  skewY: 'string'
}

// List of all available options with types.
const availableOptions = {
  duration: 'number',
  delay: 'number',
  easing: 'string',
  loop: 'number'
}

/**
 * First chaining function to select DOM element (target) to animate.
 * Return an object with all the action functions (without the last 'animate' function).
 * @param {string | Element} target
 * @returns {object}
 */
export function target (target) {
  // Default options.
  const options = {
    duration: .5,
    delay: 0,
    easing: 'linear',
    loop: false
  }

  if (isDomElement(target)) {
    return getFunctions(target, options, 'initial')
  }

  checkBuiltInTypes([target], 'string')

  return getFunctions(getElement(target), options, 'initial')
}

/**
 *
 * @param {Element} target
 * @param {object} options
 * @param {string} transform
 * @returns {object}
 */
function getFunctions (target, options, transform) {
  // Make a copy of options to save state in different function chains.
  options = Object.assign({}, options)

  return {
    // Action functions.
    ...getTransformFunctions(target, options, transform),
    // Option functions.
    ...getOptionFunctions(target, options, transform),
    // Animate function.
    animate: () => animate(target, options, transform)
  }
}

/**
 * Return an object of functions, in which each function is a CSS transformation.
 * @param {Element} target
 * @param {object} options
 * @param {string} transform
 * @returns {object}
 */
function getTransformFunctions (target, options, transform) {
  return Object.keys(availableTransformations).reduce(function addTransformFunction (accumulator, transformation, i) {
    accumulator[transformation] = function transformFunction (...values) {
      checkBuiltInTypes(values, Object.values(availableTransformations)[i])

      // If transform property is in a 'initial' state set it as empty string for next transformations.
      transform = transform === 'initial' ? '' : transform

      return getFunctions(target, options, transform + `${transformation}(${values.join(',')}) `)
    }

    return accumulator
  }, {})
}

/**
 *
 * @param target
 * @param options
 * @param transform
 * @returns {object}
 */
function getOptionFunctions (target, options, transform) {
  return Object.keys(availableOptions).reduce(function (accumulator, option, i) {
    accumulator[option] = function (...values) {
      checkBuiltInTypes(values, Object.values(availableOptions)[i])

      // If the function has not parameters set option to 'true'.
      options[option] = values.length > 0 ? values[0] : true

      return getFunctions(target, options, transform)
    }

    return accumulator
  }, {})
}

/**
 * Last chaining function to start the animation. Set CSS properties and return a promise
 * resolved when the animation ends.
 * @param {Element} target
 * @param {object} options
 * @param {string} transform
 * @returns {Promise<*>}
 */
async function animate (target, options, transform) {
  // Save original CSS properties.
  const originalTransition = target.style.transition
  const originalTransform = target.style.transform

  // Create internal animate function when set transform CSS property
  // and return a promise of the transition end.
  function _animate (transform) {
    target.style.transform = transform

    return new Promise(function (resolve) {
      target.ontransitionend = resolve
    })
  }

  // Set transition CSS property.
  target.style.transition = `transform ${options.duration}s ${options.easing} ${options.delay}s`

  if (options.loop !== false) {
    while (options.loop) {
      await _animate(transform)
      await _animate(originalTransform)

      options.loop = typeof options.loop === 'number' ? options.loop - 1 : options.loop
    }
  } else {
    await _animate(transform)
  }

  // Set transition CSS property with original value.
  target.style.transition = originalTransition
}

/**
 * Return a copy of available option functions.
 * @returns {string[]}
 */
export function options () {
  return Object.keys(availableOptions)
}

/**
 * Return a copy of available action functions.
 * @returns {string[]}
 */
export function actions () {
  return Object.keys(availableTransformations)
}
