export const isFunction = value => typeof value === 'function'

export const isNumber = value => typeof value === 'number' && !isNaN(value)

export const isObject = value => value !== null && !Array.isArray(value) && typeof value === 'object'

export const isNullOrUndefined = (value = null) => value === null

export const isRegExp = value => {
  const safeValue = value || ''
  return safeValue.constructor.name === RegExp.name
}

export const isEmpty = (value = null) => {
  if (isNullOrUndefined(value)) return true

  const isValueObject = isObject(value)
  const isImpliedValue = isNumber(value) || isFunction(value) || value === true
  const isEmptyObject = isValueObject && !isRegExp(value) && Object.keys(value).length === 0
  return isEmptyObject || (!isImpliedValue && !isValueObject && !value.length)
}
