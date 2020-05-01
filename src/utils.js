/**
 * Return a DOM element.
 * @param {string} selector
 * @returns {NodeList}
 */
export function getElements (selector) {
  const elements = window.document.querySelectorAll(selector)

  if (elements.length === 0) {
    throw Error(`'${selector}' selector is not valid or the element does not exist.`)
  }

  return elements
}

/**
 * Check the parameter types and throw a type error if the parameter is not of the correct type.
 * @param {*} parameter
 * @param {string} type
 * @returns {*}
 */
export function checkBuiltInTypes (parameter, type) {
  if (!type.includes(typeof parameter)) {
    throw TypeError(`'${parameter}' value is not a ${type.split(' ').join(' or a ')}.`)
  }

  return parameter
}

/**
 * Check the CSS property value and throw an error if it is not valid.
 * @param {string} property
 * @param {*} value
 */
export function checkCSSPropertyValue (property, value) {
  const element = window.document.createElement('div')

  element.style[property] = value

  if (!element.style[property]) {
    throw TypeError(`'${value}' is not a valid value for '${property}' CSS property.`)
  }

  element.remove()
}

/**
 * Return true if the value passed as parameter is a DOM element or a list of elements.
 * @param {Element | NodeList} elements
 * @returns {boolean}
 */
export function isDomElementOrNodeList (elements) {
  return elements.nodeType || (elements.length && Array.from(elements).every(element => element.nodeType))
}

/**
 * Convert camel case string to dash case string.
 * @param {string} s
 * @returns {string}
 */
export function camelCaseToDashCase (s) {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * Return a copy of an object, same content but different reference.
 * @param {object} object
 * @returns {object}
 */
export function copyObject (object) {
  return Object.assign({}, object)
}

/**
 * Create a content-based ID with an acceptable number of collisions.
 * @param {string} s
 * @returns {string}
 */
export function createID (s) {
  return '_' + s.split('').reduce(function (acc, c) {
    acc = ((acc << 5) - acc) + c.charCodeAt(0)
    return acc & acc
  }, 0)
}
