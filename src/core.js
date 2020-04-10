import { checkBuiltInTypes, getElement, isDomElement } from './utils'

// List of all available transformations.
const transformations = [
  'matrix',
  'translate', 'translateX', 'translateY', 'translateZ',
  'scale', 'scaleX', 'scaleY', 'scaleZ',
  'rotate', 'rotateX', 'rotateY', 'rotateZ',
  'skew', 'skewX', 'skewY'
]

/**
 *
 * @param {string | Element} target
 * @returns {object}
 */
export function target (target) {
  if (isDomElement(target)) {
    return getTransformFunctions(target)
  }

  checkBuiltInTypes([target], ['string'])

  return getTransformFunctions(getElement(target))
}

/**
 * Return transform properties as functions.
 * @param {Element} target
 * @param {string} transformProperty
 * @returns {object}
 */
function getTransformFunctions (target, transformProperty = '') {
  return transformations.reduce(addTransformFunction.bind(null, target, transformProperty), {})
}

/**
 *
 * @param target
 * @param transformProperty
 * @param accumulator
 * @param transformation
 * @returns {object}
 */
function addTransformFunction (target, transformProperty, accumulator, transformation) {
  accumulator[transformation] = transformFunction.bind(null, target, transformProperty, transformation)

  return accumulator
}

/**
 *
 * @param target
 * @param transformProperty
 * @param transformation
 * @param values
 * @returns {object}
 */
function transformFunction (target, transformProperty, transformation, ...values) {
  checkBuiltInTypes(values, 'string')

  const updatedTransform = transformProperty + `${transformation}(${values.join(',')}) `

  return {
    ...getTransformFunctions(target, updatedTransform),
    animate: () => animate(target, updatedTransform)
  }
}

/**
 *
 * @param target
 * @param transformProperty
 * @returns {Promise<unknown>}
 */
async function animate (target, transformProperty) {
  const duration = .5

  console.log(transformProperty)

  target.style.transition = `transform ${duration}s linear`
  target.style.transform = transformProperty

  return new Promise(function (resolve) {
    target.ontransitionend = resolve
  })
}

/**
 * Return a copy of available transformation list.
 * @returns {string[]}
 */
export function availableTransformations () {
  return transformations.slice()
}
