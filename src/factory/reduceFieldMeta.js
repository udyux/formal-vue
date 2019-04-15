import { isFunction } from '../helpers'

export default (context, meta = {}) =>
  Object.entries(meta).reduce((metaData, [key, value]) => {
    const enumerable = true
    const getter = isFunction(value) && { get: () => value.call(context), enumerable }
    return Object.defineProperty(metaData, key, getter || { enumerable, value, writable: true })
  }, {})
