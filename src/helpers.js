export const isRegExp = value => {
  const safeValue = value || ''
  return safeValue.constructor.name === RegExp.name
}

export const isEmpty = (value = null) => {
  const isNull = value === null
  const isObject = typeof value === 'object' && !isNull
  const isBoolean = typeof value === 'boolean'
  const isNumber = typeof value === 'number'
  const isEmptyObject = isObject && !isRegExp(value) && Object.keys(value).length === 0
  return isNull || isEmptyObject || (!isBoolean && !isNumber && !isObject && !value.length)
}

export const returnNullValue = () => null

export const returnTrueValue = () => true

export const returnValue = v => v
