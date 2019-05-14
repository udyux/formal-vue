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

export const isVue = ($Vue, { minVersion, isInstance, isConstructor }) => {
  const isVueConstructor = isFunction($Vue) && $Vue.name === 'Vue'
  const isVueInstance = isObject($Vue) && $Vue._isVue
  const isVue = isVueConstructor || isVueInstance

  if (!isVue || (!minVersion && !isInstance && !isConstructor)) return isVue
  if (!minVersion) return isInstance ? isVueInstance : isVueConstructor

  const reduceVersion = str =>
    str
      .replace(/[A-Za-z-]/g, '')
      .split('.')
      .map(Number)

  const constructor = isVueConstructor ? $Vue : $Vue.constructor
  const [qMajor = 0, qMinor = 0, qPatch = 0] = reduceVersion(minVersion)
  const [vMajor, vMinor, vPatch] = reduceVersion(constructor.version)
  return vMajor >= qMajor && vMinor >= qMinor && vPatch >= qPatch
}
