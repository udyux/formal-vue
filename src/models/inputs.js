const wrapRequired = model =>
  Object.defineProperty(model, 'isRequired', { value: (options = {}) => model({ ...options, isRequired: true }) })

const modelWrapperReducer = (model, [key, mixin]) =>
  Object.defineProperty(model, key, { value: wrapRequired((options = {}) => model({ ...mixin, ...options })) })

const defineModel = (initialValue, mixins = {}) =>
  Object.entries(mixins).reduce(
    modelWrapperReducer,
    wrapRequired((options = {}) => ({ initialValue, ...options }))
  )

export default {
  checkbox: defineModel(Boolean, { group: { initialValue: Array } }),
  file: defineModel(Object),
  null: defineModel(),
  number: defineModel(Number),
  radio: defineModel(Array),
  select: defineModel(String, { multiple: { initialValue: Array } }),
  text: defineModel(String)
}
