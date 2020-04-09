import { capitalize, getOrdinalNumeral, } from './utils'

/**
 * Check the parameter types and throw a type error if a parameter is not of the correct type.
 * @param {IArguments} parameters
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
