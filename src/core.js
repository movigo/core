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
 * First chaining function to select DOM element (target) to animate.
 * Return an object with all the action functions (without the last 'animate' function).
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
 * Return an object of functions, in which each function is a CSS transformation.
 * @param {Element} target
 * @param {string} transformProperty
 * @returns {object}
 */
function getTransformFunctions (target, transformProperty = '') {
  return transformations.reduce(addTransformFunction.bind(null, target, transformProperty), {})
}

/**
 * Add the transform function to an object of functions.
 * @param {Element} target
 * @param {string} transformProperty
 * @param {object} accumulator
 * @param {string} transformation
 * @returns {object}
 */
function addTransformFunction (target, transformProperty, accumulator, transformation) {
  accumulator[transformation] = transformFunction.bind(null, target, transformProperty, transformation)

  return accumulator
}

/**
 * Add the transformation in the transform property in CSS format and return the object of action functions.
 * @param {Element} target
 * @param {string} transformProperty
 * @param {string} transformation
 * @param {string[]} values
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
 * Last chaining function to start the animation. Set CSS properties and return a promise
 * resolved when the animation ends.
 * @param {Element} target
 * @param {string} transformProperty
 * @returns {Promise<*>}
 */
async function animate (target, transformProperty) {
  const duration = .5

  target.style.transition = `transform ${duration}s linear`
  target.style.transform = transformProperty

  return new Promise(function (resolve) {
    target.ontransitionend = resolve
  })
}

/**
 * Return a copy of available action functions.
 * @returns {string[]}
 */
export function actions () {
  return transformations.slice()
}
