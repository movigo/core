import { camelCaseToDashCase, checkBuiltInTypes, checkCSSPropertyValue, getElement, isDomElement } from './utils'

// List of all available options with types ('<functionName>: <parameterTypes>').
const availableOptions = {
  duration: 'number',
  delay: 'number',
  easing: 'string',
  loop: 'number'
}

// List of all available properties.
const availableProperties = [
  'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom',
  'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
  'border', 'borderRadius',
  'left', 'right', 'top', 'bottom',
  'width', 'height',
  'color', 'backgroundColor',
  'opacity',
]

// List of all available transformations (additional properties).
const availableTransformations = [
  'matrix',
  'translate', 'translateX', 'translateY', 'translateZ',
  'scale', 'scaleX', 'scaleY', 'scaleZ',
  'rotate', 'rotateX', 'rotateY', 'rotateZ',
  'skew', 'skewX', 'skewY'
]

/**
 * First chaining function to select DOM element (target) to animate.
 * Return an object with all the action functions.
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
    return getFunctions(target, options, {})
  }

  checkBuiltInTypes([target], 'string')

  return getFunctions(getElement(target), options, {})
}

/**
 *
 * @param {Element} target
 * @param {object} options
 * @param {object} properties
 * @returns {object}
 */
function getFunctions (target, options, properties) {
  // #JS work with object references!
  // Make a copy of options and properties objects to save state in different function chains.
  options = Object.assign({}, options)
  properties = Object.assign({}, properties)

  return {
    // Action functions.
    ...getTransformFunctions(target, options, properties),
    ...getPropertyFunctions(target, options, properties),
    // Option functions.
    ...getOptionFunctions(target, options, properties),
    // Animate function.
    animate: () => animate(target, options, properties)
  }
}

/**
 * Return an object of functions, in which each function is a CSS transformation.
 * @param {Element} target
 * @param {object} options
 * @param {object} properties
 * @returns {object}
 */
function getTransformFunctions (target, options, properties) {
  return availableTransformations.reduce(function addTransformFunction (accumulator, transformation, i) {
    accumulator[transformation] = function transformFunction (...values) {
      const value = `${transformation}(${values.join(',')}) `

      checkCSSPropertyValue('transform', value.trim())

      properties['transform'] = (properties['transform'] || '') + value

      return getFunctions(target, options, properties)
    }

    return accumulator
  }, {})
}

/**
 * Return an object of functions, in which each function is a CSS property.
 * @param {Element} target
 * @param {object} options
 * @param {object} properties
 * @returns {object}
 */
function getPropertyFunctions (target, options, properties) {
  return availableProperties.reduce(function addPropertyFunction (accumulator, property, i) {
    accumulator[property] = function propertyFunction (value) {
      checkCSSPropertyValue(property, value)

      properties[property] = value

      return getFunctions(target, options, properties)
    }

    return accumulator
  }, {})
}

/**
 *
 * @param {Element} target
 * @param {object} options
 * @param {object} properties
 * @returns {object}
 */
function getOptionFunctions (target, options, properties) {
  return Object.keys(availableOptions).reduce(function addOptionFunction (accumulator, option, i) {
    accumulator[option] = function optionFunction (...values) {
      checkBuiltInTypes(values, Object.values(availableOptions)[i])

      // If the function has not parameters set option to 'true'.
      options[option] = values.length > 0 ? values[0] : true

      return getFunctions(target, options, properties)
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
 * Return true if the values of the properties to animate are different
 * than the current style, otherwise return false.
 * @param {Element} target
 * @param {object} properties
 * @returns {boolean}
 */
function propertiesUpdateStyle (target, properties) {
  const computedStyle = window.getComputedStyle(target)

  for (const property in properties) {
    if (computedStyle[property] !== properties[property]) {
      return true
    }
  }

  return false
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
 * @returns {Promise<Element>}
 */
function setProperties (target, properties) {
  // Get the number of transitions (equal to the number of CSS properties to animate).
  const numberOfTransitions = Object.keys(properties).length

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
 * @returns {Promise<void | null>}
 */
async function animate (target, options, properties) {
  if (propertiesUpdateStyle(target, properties)) {
    // Save original CSS properties.
    const originalProperties = getOriginalProperties(target, properties)

    // Set transition CSS properties.
    target.style.transition = `all ${options.duration}s ${options.easing} ${options.delay}s`
    target.style.transitionProperty = Object.keys(properties).map(camelCaseToDashCase).join(',')

    if (options.loop !== false) {
      while (options.loop) {
        await setProperties(target, properties)
        await setProperties(target, originalProperties)

        options.loop = typeof options.loop === 'number' ? options.loop - 1 : options.loop
      }
    } else {
      await setProperties(target, properties)
    }

    // Set transition CSS property to 'inherit' value.
    target.style.transition = target.style.transitionProperty = 'inherit'
  }

  return null
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
    ...availableTransformations.slice(),
    ...availableProperties.slice()
  ]
}
