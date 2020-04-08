import { getElement } from './utils'

/**
 * Return a function to transform an element.
 * @param {string} target
 * @returns {function(...[*]=)}
 */
export function animate (target) {
  const element = getElement(target)

  return function (transform) {
    element.style.transform = transform
  }
}
