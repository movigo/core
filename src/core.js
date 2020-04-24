import { availableOptions } from './options'
import { availableProperties, availableTransformations } from './actions'
import {
  camelCaseToDashCase,
  checkBuiltInTypes,
  checkCSSPropertyValue,
  copyObject,
  createID,
  getElements,
  isDomElementOrNodeList
} from './utils'

/**
 * First chaining function to select DOM element (target) to animate.
 * Return an object with all the action functions.
 * @param {string | Element | NodeList} elements
 * @returns {object}
 */
export function target (elements) {
  // Default options.
  const options = {
    duration: .5,
    delay: 0,
    easing: 'linear',
    loop: 0
  }

  if (isDomElementOrNodeList(elements)) {
    return getAllChainFunctions(elements.length ? elements : [elements], options, {})
  }

  checkBuiltInTypes(elements, 'string')

  return getAllChainFunctions(getElements(elements), options, {})
}

/**
 * Create an object of functions user for the function chaining.
 * @param {NodeList} elements
 * @param {object} options
 * @param {object} properties
 * @returns {object}
 */
function getAllChainFunctions (elements, options, properties) {
  return {
    // Action functions.
    ...createTransformFunctions(elements, options, properties),
    ...createPropertyFunctions(elements, options, properties),
    // Option functions.
    ...createOptionFunctions(elements, options, properties),
    // Animate function.
    animate: () => animateAll(elements, options, properties)
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
 * @param {NodeList} elements
 * @param {object} options
 * @param {object} properties
 * @returns {object}
 */
function createTransformFunctions (elements, options, properties) {
  return createChainFunctions(availableTransformations, function transformFunction (values, transformation) {
    const value = `${transformation}(${values.join(',')})`

    checkCSSPropertyValue('transform', value)

    // Make a copy of properties object to save state in different function chains.
    const propertiesCopy = copyObject(properties)
    propertiesCopy['transform'] = propertiesCopy['transform'] ? `${propertiesCopy['transform']} ${value}` : value

    return getAllChainFunctions(elements, options, propertiesCopy)
  })
}

/**
 * Create the property chain functions (other CSS properties).
 * @param {NodeList} elements
 * @param {object} options
 * @param {object} properties
 * @returns {object}
 */
function createPropertyFunctions (elements, options, properties) {
  return createChainFunctions(availableProperties, function addPropertyFunction ([value], property) {
    checkCSSPropertyValue(property, value)

    // Make a copy of properties' object to save state in different function chains.
    const propertiesCopy = copyObject(properties)
    propertiesCopy[property] = value

    return getAllChainFunctions(elements, options, propertiesCopy)
  })
}

/**
 * Create the option chain functions.
 * @param {NodeList} elements
 * @param {object} options
 * @param {object} properties
 * @returns {object}
 */
function createOptionFunctions (elements, options, properties) {
  // Option functions always take only one parameter.
  return createChainFunctions(Object.keys(availableOptions), function addOptionFunction ([value], option, i) {
    checkBuiltInTypes(value, `${Object.values(availableOptions)[i]} function`)

    // Make a copy of options' object to save state in different function chains.
    const optionsCopy = copyObject(options)

    if (typeof value === 'function') {
      optionsCopy[option] = Array.from(elements).map(function (target, ii) {
        const newValue = value(ii, target)

        checkBuiltInTypes(newValue, Object.values(availableOptions)[i])

        return newValue
      })
    } else {
      // If there is not value set option to 'true'.
      optionsCopy[option] = value
    }

    return getAllChainFunctions(elements, optionsCopy, properties)
  })
}

/**
 * Return actual properties of computed style object.
 * @param {Element} element
 * @param {object} properties
 * @returns {object}
 */
function getActualProperties (element, properties) {
  const computedStyle = window.getComputedStyle(element)

  return Object.keys(properties).reduce(function (accumulator, property) {
    accumulator[property] = computedStyle[property]

    return accumulator
  }, {})
}

/**
 *
 * @param {Element} styleElement
 * @param {object} properties
 * @returns {string}
 */
function createKeyFrame (styleElement, properties) {
  const animationName = createID()

  styleElement.innerHTML += `@keyframes ${animationName} {
    to { ${Object.keys(properties).map(p => `${camelCaseToDashCase(p)}: ${properties[p]}`).join(';')} }
  }`

  return animationName
}

/**
 *
 * @param {object} options
 * @param {number} i
 */
function mapSpecificOptions (options, i) {
  return Object.keys(options).reduce(function (accumulator, option) {
    accumulator[option] = Array.isArray(options[option]) ? options[option][i] : options[option]

    return accumulator
  }, {})
}

/**
 * Last chaining function that start the animation. Set CSS properties
 * creating transitions and return a promise resolved when the animation ends.
 * @param {Element} element
 * @param {object} options
 * @param {object} properties
 * @param {string} animationName
 * @param {number} i
 * @returns {Promise<void>}
 */
async function animate (element, options, properties, animationName, i) {
  if (element.style.animationPlayState !== 'running') {
    // Map any specific options.
    const { duration, easing, delay, loop } = mapSpecificOptions(options, i)

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
      for (const property in properties) {
        element.style[property] = properties[property]
      }
    }

    element.style.animationPlayState = 'paused'
  }
}

/**
 *
 * @param {NodeList} elements
 * @param {object} options
 * @param {object} properties
 * @returns {Promise<void[]>}
 */
async function animateAll (elements, options, properties) {
  const styleElement = window.document.createElement('style')
  const animationName = createKeyFrame(styleElement, properties)

  window.document.head.appendChild(styleElement)

  await Promise.all(Array.from(elements).map(function (element, i) {
    return animate(element, copyObject(options), copyObject(properties), animationName, i)
  }))

  styleElement.remove()
}
