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

// List of all available properties with types.
const availableProperties = {
  left: 'string',
  right: 'string',
  top: 'string',
  bottom: 'string',
  width: 'string',
  height: 'string'
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
    return getFunctions(target, options, {}, 'initial')
  }

  checkBuiltInTypes([target], 'string')

  return getFunctions(getElement(target), options, {}, 'initial')
}

/**
 *
 * @param {Element} target
 * @param {object} options
 * @param {object} properties
 * @param {string} transform
 * @returns {object}
 */
function getFunctions (target, options, properties, transform) {
  // #JS work with object references!
  // Make a copy of options and properties objects to save state in different function chains.
  options = Object.assign({}, options)
  properties = Object.assign({}, properties)

  return {
    // Action functions.
    ...getTransformFunctions(target, options, properties, transform),
    ...getPropertyFunctions(target, options, properties, transform),
    // Option functions.
    ...getOptionFunctions(target, options, properties, transform),
    // Animate function.
    animate: () => animate(target, options, properties, transform)
  }
}

/**
 * Return an object of functions, in which each function is a CSS transformation.
 * @param {Element} target
 * @param {object} options
 * @param {object} properties
 * @param {string} transform
 * @returns {object}
 */
function getTransformFunctions (target, options, properties, transform) {
  return Object.keys(availableTransformations).reduce(function addTransformFunction (accumulator, transformation, i) {
    accumulator[transformation] = function transformFunction (...values) {
      checkBuiltInTypes(values, Object.values(availableTransformations)[i])

      // If transform property is in a 'initial' state set it as empty string for next transformations.
      transform = transform === 'initial' ? '' : transform

      return getFunctions(target, options, properties, transform + `${transformation}(${values.join(',')}) `)
    }

    return accumulator
  }, {})
}

/**
 * Return an object of functions, in which each function is a CSS property.
 * @param {Element} target
 * @param {object} options
 * @param {object} properties
 * @param {string} transform
 * @returns {object}
 */
function getPropertyFunctions (target, options, properties, transform) {
  return Object.keys(availableProperties).reduce(function addPropertyFunction (accumulator, property, i) {
    accumulator[property] = function propertyFunction (value) {
      checkBuiltInTypes([value], Object.values(availableProperties)[i])

      properties[property] = value

      return getFunctions(target, options, properties, transform)
    }

    return accumulator
  }, {})
}

/**
 *
 * @param {Element} target
 * @param {object} options
 * @param {object} properties
 * @param {string} transform
 * @returns {object}
 */
function getOptionFunctions (target, options, properties, transform) {
  return Object.keys(availableOptions).reduce(function (accumulator, option, i) {
    accumulator[option] = function (...values) {
      checkBuiltInTypes(values, Object.values(availableOptions)[i])

      // If the function has not parameters set option to 'true'.
      options[option] = values.length > 0 ? values[0] : true

      return getFunctions(target, options, properties, transform)
    }

    return accumulator
  }, {})
}

/**
 *
 * @param {Element} target
 * @param {number} numberOfTransitions
 * @returns {Promise<Element>}
 */
function whenTransitionsEnds (target, numberOfTransitions) {
  return new Promise(function (resolve) {
    target.ontransitionend = function () {
      numberOfTransitions--

      if (numberOfTransitions === 0) {
        resolve(target)
      }
    }
  })
}

/**
 *
 * @param {Element} target
 * @param {object} properties
 * @returns {object}
 */
function getOriginalProperties (target, properties) {
  return Object.keys(properties).reduce(function (accumulator, property) {
    accumulator[property] = target.style[property]

    return accumulator
  }, {})
}

/**
 *
 * @param {Element} target
 * @param {object} properties
 * @param {string} transform
 * @returns {Promise<Element>}
 */
function setProperties (target, properties, transform) {
  // Get the number of transitions (equal to the number of CSS properties to animate).
  const numberOfTransitions = Object.keys(properties).length + 1

  target.style.transform = transform

  for (const property in properties) {
    target.style[property] = properties[property]
  }

  return whenTransitionsEnds(target, numberOfTransitions)
}

/**
 * Last chaining function to start the animation. Set CSS properties and return a promise
 * resolved when the animation ends.
 * @param {Element} target
 * @param {object} options
 * @param {object} properties
 * @param {string} transform
 * @returns {Promise<void>}
 */
async function animate (target, options, properties, transform) {
  // Save original CSS properties.
  const originalTransform = target.style.transform
  const originalProperties = getOriginalProperties(target, properties)

  // Set transition CSS properties.
  target.style.transition = `all ${options.duration}s ${options.easing} ${options.delay}s`
  target.style.transitionProperty = `transform, ${Object.keys(properties).join(',')}`

  if (options.loop !== false) {
    while (options.loop) {
      await setProperties(target, properties, transform)
      await setProperties(target, originalProperties, originalTransform)

      options.loop = typeof options.loop === 'number' ? options.loop - 1 : options.loop
    }
  } else {
    await setProperties(target, properties, transform)
  }

  // Set transition CSS property to 'inherit' value.
  target.style.transition = target.style.transitionProperty = 'inherit'
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
  return [
    ...Object.keys(availableTransformations),
    ...Object.keys(availableProperties)
  ]
}
