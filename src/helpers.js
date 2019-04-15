export const isRegExp = value => {
  const safeValue = value || ''
  return safeValue.constructor.name === RegExp.name
}

export const isFunction = value => typeof value === 'function'

export const isEmpty = (value = null) => {
  if (value === null || value === undefined) return true

  const isBoolean = typeof value === 'boolean'
  const isNumber = typeof value === 'number'
  const isObject = !Array.isArray(value) && typeof value === 'object'
  const isImpliedValue = isBoolean || isNumber || isFunction(value)
  const isEmptyObject = isObject && !isRegExp(value) && Object.keys(value).length === 0
  return isEmptyObject || (!isImpliedValue && !isObject && !value.length)
}

export const returnNullValue = () => null

export const returnTrueValue = () => true

export const returnValue = v => v
