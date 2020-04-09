import { checkParameterTypes, getElement } from './utils'

/**
 *
 * @param {string} target
 * @returns {object}
 */
export function target (target) {
  checkParameterTypes(arguments, ['string'])

  return getTransformFunctions(getElement(target))
}

/**
 * Return transform properties as functions.
 * @param {Element} element
 * @param {string} transform
 * @returns {*}
 */
function getTransformFunctions (element, transform = '') {
  return [
    'translateX', 'translateY',
    'rotate',
    'scale'
  ].reduce(function (accumulator, transformFunction) {
    accumulator[transformFunction] = function (...values) {
      checkParameterTypes(values, 'string')

      const updatedTransform = transform + `${transformFunction}(${values.join(',')}) `

      return {
        ...getTransformFunctions(element, updatedTransform),
        animate: () => animate(element, updatedTransform)
      }
    }

    return accumulator
  }, {})
}

async function animate (element, transform) {
  const duration = .5

  element.style.transition = `transform ${duration}s linear`
  element.style.transform = transform

  return new Promise(function (resolve) {
    element.ontransitionend = resolve
  })
}
