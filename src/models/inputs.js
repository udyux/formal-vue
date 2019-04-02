const defineModel = initialValue => {
  const wrapRequired = model =>
    Object.defineProperty(model, 'isRequired', { value: (options = {}) => model({ ...options, isRequired: true }) })

  const model = wrapRequired((options = {}) => ({ initialValue, ...options }))

  const unwrap = () => model
  unwrap.mixin = (name, mixin) => {
    model[name] = wrapRequired((options = {}) => model({ ...mixin, ...options }))
    return unwrap
  }

  return unwrap
}

const types = {
  array: defineModel(Array),
  boolean: defineModel(Boolean),
  number: defineModel(Number),
  object: defineModel(Object),
  string: defineModel(String)
}

export default {
  checkbox: types.boolean.mixin('group', { initialValue: Array })(),
  file: types.object(),
  number: types.number(),
  radio: types.array(),
  select: types.string.mixin('multiple', { initialValue: Array })(),
  text: types.string()
}
