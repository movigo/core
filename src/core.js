import { getElement } from './utils'
import { checkParameterTypes } from './errors'

/**
 * Return a function to transform an element.
 * @param {string} target
 * @returns {function(...[*]=)}
 */
export function animate (target) {
  checkParameterTypes(arguments, ['string'])

  const element = getElement(target)

  return function (transform) {
    element.style.transform = transform
  }
}
