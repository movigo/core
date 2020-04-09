import { checkParameterTypes, getElement } from './utils'

/**
 *
 * @param {string} target
 * @returns {object}
 */
export function target (target) {
  checkParameterTypes(arguments, ['string'])

  const options = {
    element: getElement(target),
    actions: []
  }

  return getActionFunctions(options)
}

/**
 *
 * @param {object} options
 * @returns {object}
 */
function getActionFunctions (options) {
  function wrap (fun, value) {
    checkParameterTypes([value], ['number'])

    return fun(value, options)
  }

  return {
    translateX: (value) => wrap(translateX, value),
    translateY: (value) => wrap(translateY, value)
  }
}

function translateX (value, options) {
  options.actions.push(`translateX(${value}px)`)

  return {
    ...getActionFunctions(options),
    animate: () => animate(options),
  }
}

function translateY (value, options) {
  options.actions.push(`translateY(${value}px)`)

  return {
    ...getActionFunctions(options),
    animate: () => animate(options),
  }
}

function animate (options) {
  const length = options.actions.length

  for (let i = 0; i < length; ++i) {
    options.element.style.transform = options.actions[i]
  }
}
