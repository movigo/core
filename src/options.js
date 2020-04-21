// List of all available options with types ('<functionName>: <parameterTypes>').
export const availableOptions = {
  duration: 'number',
  delay: 'number',
  easing: 'string',
  loop: 'number undefined'
}

/**
 * Return a copy of available option functions.
 * @returns {string[]}
 */
export function options () {
  return Object.keys(availableOptions)
}
