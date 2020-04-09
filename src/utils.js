/**
 * Return a DOM element.
 * @param {string} target
 * @returns {Element}
 */
export function getElement (target) {
  return window.document.querySelector(target)
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
