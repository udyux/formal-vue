const fieldMixinFactory = initialValue => {
  const modelMixin = (mixin = {}) => ({ initialValue, ...mixin })
  modelMixin.isRequired = (mixin = {}) => modelMixin({ ...mixin, isRequired: true })
  return modelMixin
}

export default {
  array: fieldMixinFactory(Array),
  boolean: fieldMixinFactory(Boolean),
  number: fieldMixinFactory(Number),
  object: fieldMixinFactory(Object),
  string: fieldMixinFactory(String)
}
