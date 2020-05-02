import { availableActions } from './actions'
import { availableOptions } from './options'
import {
  camelCaseToDashCase,
  checkBuiltInTypes,
  checkCSSPropertyValue,
  copyObject,
  createID,
  getElements,
  isDomElementOrNodeList
} from './utils'

// Default parameters.
const defaultParameters = {
  duration: 0.3,
  delay: 0,
  easing: 'linear',
  loop: 0,
  from: {},
  to: {}
}

// Plugin functions.
export const pluginFunctions = []

/**
 *
 * @returns {object}
 */
export function parameters () {
  return copyObject(defaultParameters)
}

/**
 * Add a plugin in the library.
 * @param plugin
 */
export function addPlugin (plugin) {
  checkBuiltInTypes(plugin, 'function')

  pluginFunctions.push(plugin)
}

/**
 * First chaining function to select DOM element (target) to animate.
 * Return an object with all the action functions.
 * @param {string | Element | Element[] | NodeList} elements
 * @returns {object}
 */
export function target (elements) {
  if (isDomElementOrNodeList(elements)) {
    return getAllChainFunctions(elements.length ? elements : [elements], defaultParameters)
  }

  checkBuiltInTypes(elements, 'string')

  return getAllChainFunctions(getElements(elements), defaultParameters)
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
    ...createPluginFunctions(elements, parameters), // Plugin functions.
    animate: () => animateAll(elements, parameters), // Animate function.
    parameters: () => copyObject(parameters) // Return current parameters.
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
 * Create the action chain functions.
 * @param {NodeList} elements
 * @param {object} parameters
 * @returns {object}
 */
function createActionFunctions (elements, parameters) {
  return createChainFunctions(Object.keys(availableActions), function addActionFunction ([value], action, i) {
    // Make a copy of parameters' object to save state in different function chains.
    const parametersCopy = copyObject(parameters)
    const type = Object.values(availableActions)[i]

    function checks (value, type) {
      for (const entry of Object.entries(value)) {
        checkCSSPropertyValue(...entry)
      }

      return checkBuiltInTypes(value, type)
    }

    parametersCopy[action] = typeof value === 'function'
      ? Array.from(elements).map((target, ii) => checks(value(ii, target), type))
      : checks(value, type)

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
  return createChainFunctions(Object.keys(availableOptions), function addOptionFunction ([value], option, i) {
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
 * Create the plugin chain functions.
 * @param {NodeList} elements
 * @param {object} parameters
 * @returns {object}
 */
export function createPluginFunctions (elements, parameters) {
  return createChainFunctions(pluginFunctions.map(f => f.name), function addPluginFunction (values, functionName, i) {
    checkBuiltInTypes(pluginFunctions[i], 'function')

    // Make a copy of parameters' object to save state in different function chains.
    const parametersCopy = copyObject(parameters)
    pluginFunctions[i](elements, parametersCopy, ...values)

    return getAllChainFunctions(elements, parametersCopy)
  })
}

/**
 * Add a keyframe for the animations in the style element.
 * @param {HTMLStyleElement} styleElement
 * @param {object} from
 * @param {object} to
 * @returns {string}
 */
function createKeyFrame (styleElement, from, to) {
  const keyFrameName = createID(JSON.stringify({ ...from, ...to }))

  if (styleElement.sheet.rules) {
    for (const keyFrame of Array.from(styleElement.sheet.rules)) {
      if (keyFrame.name === keyFrameName) {
        return keyFrameName
      }
    }
  }

  styleElement.sheet.insertRule(`@keyframes ${keyFrameName} {
    from { ${Object.keys(from).map(p => `${camelCaseToDashCase(p)}: ${from[p]}`).join(';')} }
    to { ${Object.keys(to).map(p => `${camelCaseToDashCase(p)}: ${to[p]}`).join(';')} }
  }`)

  return keyFrameName
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
 * @param {HTMLStyleElement} styleElement
 * @param {number} i
 * @returns {Promise<void>}
 */
async function animate (element, parameters, styleElement, i) {
  if (element.style.animationPlayState !== 'running') {
    // Map any specific properties.
    const { duration, easing, delay, loop, from, to } = mapSpecificParameters(parameters, i)
    const keyFrameName = createKeyFrame(styleElement, from, to)

    element.style.animation = `${keyFrameName} ${duration}s ${easing} ${delay}s ${loop || 'infinite'}`
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
      for (const property in to) {
        element.style[property] = to[property]
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

  window.document.head.appendChild(styleElement)

  await Promise.all(Array.from(elements).map(function (element, i) {
    return animate(element, copyObject(parameters), styleElement, i)
  }))

  styleElement.remove()
}
