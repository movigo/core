import { availableOptions } from './options'
import { availableProperties, availableTransformations } from './actions'
import {
  camelCaseToDashCase,
  checkBuiltInTypes,
  checkCSSPropertyValue,
  copyObject,
  getElements,
  isDomElementOrNodeList
} from './utils'

/**
 * First chaining function to select DOM element (target) to animate.
 * Return an object with all the action functions.
 * @param {string | Element | NodeList} target
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

  if (isDomElementOrNodeList(target)) {
    const targets = target.length ? target : [target]

    return getAllChainFunctions(targets, options, {})
  }

  checkBuiltInTypes(target, 'string')

  return getAllChainFunctions(getElements(target), options, {})
}

/**
 * Create an object of functions user for the function chaining.
 * @param {Element[]} targets
 * @param {object} options
 * @param {object} properties
 * @returns {object}
 */
function getAllChainFunctions (targets, options, properties) {
  return {
    // Action functions.
    ...createTransformFunctions(targets, options, properties),
    ...createPropertyFunctions(targets, options, properties),
    // Option functions.
    ...createOptionFunctions(targets, options, properties),
    // Animate function.
    animate: () => animateAll(targets, options, properties)
  }
}

/**
 * Get a list of items (array of strings) and a function,
 * and return an object where the key is an item and the value is a
 * chain function. Used to create all the chain functions.
 * @param {string[]} items
 * @param {function} chainFunction
 * @returns {object}
 */
function createChainFunctions (items, chainFunction) {
  return items.reduce(function addTransformFunction (accumulator, item, i) {
    accumulator[item] = function (...values) {
      return chainFunction(values, item, i)
    }

    return accumulator
  }, {})
}

/**
 * Create the transformation chain functions (CSS transform property).
 * @param {Element[]} targets
 * @param {object} options
 * @param {object} properties
 * @returns {object}
 */
function createTransformFunctions (targets, options, properties) {
  return createChainFunctions(availableTransformations, function transformFunction (values, transformation) {
    const value = `${transformation}(${values.join(',')}) `

    checkCSSPropertyValue('transform', value.trim())

    // Make a copy of properties object to save state in different function chains.
    const propertiesCopy = copyObject(properties)
    propertiesCopy['transform'] = (propertiesCopy['transform'] || '') + value

    return getAllChainFunctions(targets, options, propertiesCopy)
  })
}

/**
 * Create the property chain functions (other CSS properties).
 * @param {Element[]} targets
 * @param {object} options
 * @param {object} properties
 * @returns {object}
 */
function createPropertyFunctions (targets, options, properties) {
  return createChainFunctions(availableProperties, function addPropertyFunction ([value], property) {
    checkCSSPropertyValue(property, value)

    // Make a copy of properties' object to save state in different function chains.
    const propertiesCopy = copyObject(properties)
    propertiesCopy[property] = value

    for (const target of targets) {
      if (!target.style[property]) {
        target.style[property] = window.getComputedStyle(target).getPropertyValue(property)
      }
    }

    return getAllChainFunctions(targets, options, propertiesCopy)
  })
}

/**
 * Create the option chain functions.
 * @param {Element[]} targets
 * @param {object} options
 * @param {object} properties
 * @returns {object}
 */
function createOptionFunctions (targets, options, properties) {
  // Option functions always take only one parameter.
  return createChainFunctions(Object.keys(availableOptions), function addOptionFunction ([value], option, i) {
    checkBuiltInTypes(value, `${Object.values(availableOptions)[i]} function`)

    // Make a copy of options' object to save state in different function chains.
    const optionsCopy = copyObject(options)

    if (typeof value === 'function') {
      optionsCopy[option] = Array.from(targets).map(function (target, ii) {
        const newValue = value(ii, target)

        checkBuiltInTypes(newValue, Object.values(availableOptions)[i])

        // If there is not value set option to 'true'.
        return newValue === undefined ? true : newValue
      })
    } else {
      // If there is not value set option to 'true'.
      optionsCopy[option] = value === undefined ? true : value
    }

    return getAllChainFunctions(targets, optionsCopy, properties)
  })
}

/**
 * Return original properties save in style object.
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
 * @param {object} options
 * @param {number} i
 */
function setSpecificOptions (options, i) {
  options.delay = Array.isArray(options.delay) ? options.delay[i] : options.delay
  options.duration = Array.isArray(options.duration) ? options.duration[i] : options.duration
  options.easing = Array.isArray(options.easing) ? options.easing[i] : options.easing
  options.loop = Array.isArray(options.loop) ? options.loop[i] : options.loop
}

/**
 * Update CSS properties and return a promise resolved when the transition ends.
 * @param {Element} target
 * @param {object} properties
 * @returns {Promise<void>}
 */
function createTransitions (target, properties) {
  return new Promise(function (resolve) {
    let transitions = 0
    let created = true

    function increaseTransitions () {
      console.log(transitions)
      created = true
      transitions++
    }

    function decreaseTransitions () {
      transitions--

      if (transitions <= 0) {
        resolveTransitions()
      }
    }

    function resolveTransitions () {
      // Remove all event listeners.
      target.removeEventListener('transitionrun', increaseTransitions)
      target.removeEventListener('transitionend', decreaseTransitions)
      target.removeEventListener('transitioncancel', resolveTransitions)
      // Resolve transitions.
      resolve()
    }

    target.addEventListener('transitionrun', increaseTransitions)
    target.addEventListener('transitionend', decreaseTransitions)
    target.addEventListener('transitioncancel', resolveTransitions)

    for (const property in properties) {
      target.style[property] = properties[property]
    }
  })
}

/**
 * Last chaining function that start the animation. Set CSS properties
 * creating transitions and return a promise resolved when the animation ends.
 * @param {Element} target
 * @param {object} options
 * @param {object} properties
 * @param {number} i
 * @returns {Promise<void>}
 */
async function animate (target, options, properties, i) {
  // Save original CSS properties.
  const originalProperties = getOriginalProperties(target, properties)

  // Set any specific options.
  setSpecificOptions(options, i)

  // Set transition CSS properties.
  target.style.transition = `all ${options.duration}s ${options.easing} ${options.delay}s`
  target.style.transitionProperty = Object.keys(properties).map(camelCaseToDashCase).join(',')

  if (options.loop !== false) {
    while (options.loop) {
      await createTransitions(target, properties)
      await createTransitions(target, originalProperties)

      options.loop = typeof options.loop === 'number' ? options.loop - 1 : options.loop
    }
  } else {
    await createTransitions(target, properties)
  }

  // Set transition CSS property to 'inherit' value.
  target.style.transition = target.style.transitionProperty = 'inherit'
}

/**
 *
 * @param {Element[]} targets
 * @param {object} options
 * @param {object} properties
 * @returns {Promise<void[]>}
 */
async function animateAll (targets, options, properties) {
  return Promise.all(Array.from(targets).map(function (target, i) {
    return animate(target, copyObject(options), copyObject(properties), i)
  }))
}
