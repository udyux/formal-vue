const modelMixinFactory = initialValue => {
  const modelMixin = (mixin = {}) => ({ initialValue, ...mixin })
  modelMixin.isRequired = (mixin = {}) => modelMixin({ ...mixin, isRequired: true })
  return modelMixin
}

export default {
  array: modelMixinFactory(Array),
  boolean: modelMixinFactory(Boolean),
  number: modelMixinFactory(Number),
  object: modelMixinFactory(Object),
  string: modelMixinFactory(String)
}
