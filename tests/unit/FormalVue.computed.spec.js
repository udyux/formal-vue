import _cloneDeep from 'lodash.clonedeep'

import { getForm } from './mocks/formInstanceFactory'

describe('FormalVue computed props', () => {
  describe('$form.values: Object', () => {
    const wrapper = getForm()

    it('has four fields', () => {
      expect(Object.keys(wrapper.vm.$form.values).length).toBe(4)
    })

    it('contains transformed values', () => {
      expect(wrapper.vm.$form.model.phone.value).toBe('800-000-0000')
      expect(wrapper.vm.$form.values.phone).toBe('8000000000')
    })
  })

  describe('$form.safeValuePairs: Object', () => {
    const wrapper = getForm()
    const modelClone = _cloneDeep(wrapper.vm.$form.model)
    wrapper.vm.$form.safeValuePairs.password = 'a'

    it('has four fields', () => {
      expect(Object.keys(wrapper.vm.$form.safeValuePairs).length).toBe(4)
    })

    it('does not mutate the original values', () => {
      expect(wrapper.vm.$form.model.password.value).toBe(modelClone.password.value)
    })
  })

  describe('$form.computedValues: Object', () => {
    const wrapper = getForm()

    it('has one field', () => {
      expect(Object.keys(wrapper.vm.$form.computedValues).length).toBe(1)
    })

    it('has the expected computed value', () => {
      expect(wrapper.vm.$form.computedValues.phone).toBe('+18000000000')
    })
  })
})
