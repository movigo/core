/**
 * Return a DOM element.
 * @param {string} selector
 * @returns {Element}
 */
export function getElement (selector) {
  const element = window.document.querySelector(selector)

  if (element === null) {
    throw Error(`'${selector}' selector is not valid or the element does not exist.`)
  }

  return element
}

/**
 * Check the parameter types and throw a type error if a parameter is not of the correct type.
 * @param {*[]} parameters
 * @param {string} type
 */
export function checkBuiltInTypes (parameters, type) {
  const length = parameters.length

  for (let i = 0; i < length; ++i) {
    if (!type.includes(typeof parameters[i])) {
      throw TypeError(`'${parameters[i]}' value is not a ${type.split(' ').join(' or a ')}.`)
    }
  }
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
 * Return true if the value passed as parameter is a DOM element.
 * @param {Element} value
 * @returns {boolean}
 */
export function isDomElement (value) {
  return !!value.nodeType
}

/**
 * Convert camel case string to dash case string.
 * @param {string} s
 * @returns {string}
 */
export function camelCaseToDashCase (s) {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
