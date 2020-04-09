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
 * Check the parameter types and throw a type error if a parameter is not of the correct type.
 * @param {*[]} parameters
 * @param {string[]} types
 */
export function checkParameterTypes (parameters, types) {
  const length = parameters.length

  for (let i = 0; i < length; ++i) {
    const type = types[i]
    const parameter = parameters[i]

    if (typeof parameter !== type) {
      throw TypeError(`${capitalize(getOrdinalNumeral(i + 1))} parameter is not a ${type}.`)
    }
  }
}

/**
 * Return the ordinal numeral of the correspondent number.
 * @param {number} n
 * @returns {string}
 */
export function getOrdinalNumeral (n) {
  switch (n) {
    case 1:
      return 'first'
    case 2:
      return 'second'
    case 3:
      return 'third'
    case 4:
      return 'fourth'
  }
}

/**
 * Return the string with the first letter capitalized.
 * @param {string} s
 * @returns {string}
 */
export function capitalize (s) {
  return s.charAt(0).toUpperCase() + s.toLowerCase().slice(1)
}
