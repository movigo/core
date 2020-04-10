/**
 * Return a DOM element.
 * @param {string} target
 * @returns {Element}
 */
export function getElement (target) {
  const element = window.document.querySelector(target)

  if (element === null) {
    throw Error(`'${target}' selector is not valid or the element does not exist.`)
  }

  return element
}

/**
 * Check the built-in parameter types and throw a type error if a parameter is not of the correct type.
 * @param {*[]} parameters
 * @param {string[] | string} types
 */
export function checkBuiltInTypes (parameters, types) {
  const length = parameters.length

  for (let i = 0; i < length; ++i) {
    const type = (Array.isArray(types) ? types[i] : types).split(' ')

    if (!type.includes(typeof parameters[i])) {
      throw TypeError(`'${parameters[i]}' parameter is not a ${type}.`)
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
