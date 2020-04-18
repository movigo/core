// List of all available properties.
export const availableProperties = [
  'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom',
  'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
  'border', 'borderRadius',
  'left', 'right', 'top', 'bottom',
  'width', 'height',
  'color', 'backgroundColor',
  'opacity',
]

// List of all available transformations (additional properties).
export const availableTransformations = [
  'matrix',
  'translate', 'translateX', 'translateY', 'translateZ',
  'scale', 'scaleX', 'scaleY', 'scaleZ',
  'rotate', 'rotateX', 'rotateY', 'rotateZ',
  'skew', 'skewX', 'skewY'
]

/**
 * Return a copy of available action functions.
 * @returns {string[]}
 */
export function actions () {
  return [
    ...availableTransformations.slice(),
    ...availableProperties.slice()
  ]
}
