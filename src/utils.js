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
 * Check the built-in parameter types and throw a type error if a parameter is not of the correct type.
 * @param {*[]} parameters
 * @param {string} type
 */
export function checkBuiltInTypes (parameters, type) {
  const length = parameters.length

  for (let i = 0; i < length; ++i) {
    if (!type.includes(typeof parameters[i])) {
      throw TypeError(`'${parameters[i]}' value is not a ${type}.`)
    }
  }
}

/**
 * Return true if the value passed as parameter is a DOM element.
 * @param {Element} value
 * @returns {boolean}
 */
export function isDomElement (value) {
  return !!value.nodeType
}
