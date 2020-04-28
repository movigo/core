import { availableActions } from './actions'
import {
  camelCaseToDashCase,
  checkBuiltInTypes,
  checkCSSPropertyValue,
  copyObject,
  createID,
  getElements,
  isDomElementOrNodeList
} from './utils'
import { availableOptions } from './options'

/**
 * First chaining function to select DOM element (target) to animate.
 * Return an object with all the action functions.
 * @param {string | Element | Element[] | NodeList} elements
 * @returns {object}
 */
export function target (elements) {
  // Default parameters.
  const parameters = {
    duration: 0.3,
    delay: 0,
    easing: 'linear',
    loop: 0,
    from: {},
    to: {}
  }

  if (isDomElementOrNodeList(elements)) {
    return getAllChainFunctions(elements.length ? elements : [elements], parameters)
  }

  checkBuiltInTypes(elements, 'string')

  return getAllChainFunctions(getElements(elements), parameters)
}

/**
 * Create an object of functions used for the function chaining.
 * @param {NodeList} elements
 * @param {object} parameters
 * @returns {object}
 */
function getAllChainFunctions (elements, parameters) {
  return {
    ...createActionFunctions(elements, parameters), // Action functions.
    ...createOptionFunctions(elements, parameters), // Option functions.
    animate: () => animateAll(elements, parameters) // Animate function.
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
    accumulator[item] = function (value) {
      return chainFunction(value, item, i)
    }

    return accumulator
  }, {})
}

/**
 * Create the action chain functions.
 * @param {NodeList} elements
 * @param {object} parameters
 * @returns {object}
 */
function createActionFunctions (elements, parameters) {
  return createChainFunctions(Object.keys(availableActions), function addActionFunction (value, action, i) {
    checkBuiltInTypes(value, Object.values(availableActions)[i])

    for (const entry of Object.entries(value)) {
      checkCSSPropertyValue(...entry)
    }

    // Make a copy of parameters' object to save state in different function chains.
    const parametersCopy = copyObject(parameters)
    parametersCopy[action] = {
      ...parameters[action],
      ...value
    }

    return getAllChainFunctions(elements, parametersCopy)
  })
}

/**
 * Create the option chain functions.
 * @param {NodeList} elements
 * @param {object} parameters
 * @returns {object}
 */
function createOptionFunctions (elements, parameters) {
  return createChainFunctions(Object.keys(availableOptions), function addOptionFunction (value, option, i) {
    // Make a copy of options' object to save state in different function chains.
    const parametersCopy = copyObject(parameters)
    const type = Object.values(availableOptions)[i]

    parametersCopy[option] = typeof value === 'function'
      ? Array.from(elements).map((target, ii) => checkBuiltInTypes(value(ii, target), type))
      : checkBuiltInTypes(value, type)

    return getAllChainFunctions(elements, parametersCopy)
  })
}

/**
 * Add a keyframe for the animations in the style element.
 * @param {Element} styleElement
 * @param {object} parameters
 * @returns {string}
 */
function createKeyFrame (styleElement, parameters) {
  const animationName = createID()

  styleElement.innerHTML += `@keyframes ${animationName} {
    from { ${Object.keys(parameters.from).map(p => `${camelCaseToDashCase(p)}: ${parameters.from[p]}`).join(';')} }
    to { ${Object.keys(parameters.to).map(p => `${camelCaseToDashCase(p)}: ${parameters.to[p]}`).join(';')} }
  }`

  return animationName
}

/**
 * Create an object of properties in which are set specific properties, valid for the i-th element.
 * @param {object} parameters
 * @param {number} i
 * @returns {object}
 */
function mapSpecificParameters (parameters, i) {
  return Object.keys(parameters).reduce(function (accumulator, parameter) {
    accumulator[parameter] = Array.isArray(parameters[parameter]) ? parameters[parameter][i] : parameters[parameter]

    return accumulator
  }, {})
}

/**
 * Last chaining function that start the animation. Set CSS properties
 * creating transitions and return a promise resolved when the animation ends.
 * @param {Element} element
 * @param {object} parameters
 * @param {string} animationName
 * @param {number} i
 * @returns {Promise<void>}
 */
async function animate (element, parameters, animationName, i) {
  if (element.style.animationPlayState !== 'running') {
    // Map any specific properties.
    const { duration, easing, delay, loop } = mapSpecificParameters(parameters, i)

    element.style.animation = `${animationName} ${duration}s ${easing} ${delay}s ${loop || 'infinite'}`
    element.style.animationIterationCount = typeof loop === 'undefined' ? 'infinite' : loop === 0 ? 1 : loop * 2
    element.style.animationDirection = 'alternate'

    await new Promise(function (resolve) {
      element.addEventListener('animationend', resolveAnimation)

      function resolveAnimation () {
        resolve()
        element.removeEventListener('animationend', resolveAnimation)
      }
    })

    if (loop === 0) {
      for (const property in parameters.to) {
        element.style[property] = parameters.to[property]
      }
    }

    element.style.animationPlayState = 'paused'
  }
}

/**
 * Animate all the elements of the target.
 * @param {NodeList} elements
 * @param {object} parameters
 * @returns {Promise<void[]>}
 */
async function animateAll (elements, parameters) {
  const styleElement = window.document.createElement('style')
  const animationName = createKeyFrame(styleElement, parameters)

  window.document.head.appendChild(styleElement)

  await Promise.all(Array.from(elements).map(function (element, i) {
    return animate(element, copyObject(parameters), animationName, i)
  }))

  styleElement.remove()
}
