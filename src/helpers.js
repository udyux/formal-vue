export const isEmpty = (value = null) => {
  const isNull = value === null
  const isObject = typeof value === 'object' && !isNull
  const isEmptyObject = isObject && Object.keys(value).length === 0
  return isNull || isEmptyObject || (typeof value !== 'number' && !isObject && !value.length)
}

export const returnNullValue = () => null

export const returnTrueValue = () => true

export const returnValue = v => v
