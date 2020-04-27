// List of all available actions with types ('<functionName>: <parameterTypes>').
export const availableActions = {
  from: 'object',
  to: 'object'
}

/**
 * Return a copy of available action functions.
 * @returns {string[]}
 */
export function actions () {
  return Object.keys(availableActions)
}
