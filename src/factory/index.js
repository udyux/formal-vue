import _cloneDeep from 'lodash.clonedeep'

import { events, packageName } from '../constants'
import { isEmpty, returnValue } from '../helpers'
import reduceModel from './reduceModel'
import createSubmitMethod from './submitFactory'
import validateForm from './validateForm'

export default (Vue, context, form) => {
  const { computed, initialState, model: modelShape, name, submit } = validateForm(form)
  const { model, observers, validators, valueMaps } = reduceModel(modelShape)

  const formVM = new Vue({
    name: `${packageName}.${name}`,

    data() {
      return {
        events,
        errors: {},
        model: _cloneDeep(model),
        isDirty: false,
        isSubmitPending: false,
        unbindState: null
      }
    },

    computed: {
      values() {
        return Object.keys(this.model).reduce(
          (values, field) => ({
            ...values,
            [field]: valueMaps.has(field) ? valueMaps.get(field)(this.safeValuePairs) : this.safeValuePairs[field]
          }),
          {}
        )
      },

      computedValues() {
        if (!computed) return {}
        return Object.keys(computed).reduce(
          (computedValues, field) => ({
            ...computedValues,
            [field]: computed[field].call(this)
          }),
          {}
        )
      },

      safeValuePairs() {
        const clone = _cloneDeep(this.model)
        return Object.keys(clone).reduce((values, field) => ({ ...values, [field]: clone[field].value }), {})
      }
    },

    created() {
      const initialStateModel = typeof initialState === 'function' ? initialState.call(context) : initialState
      this.fill(initialStateModel)

      this.$on(events.formValidated, ({ errors }) => {
        this.errors = errors.reduce((errorMap, error) => ({ ...errorMap, [error.field]: error }), [])
      })

      observers.format.forEach((handler, field) => {
        this.$watch(`model.${field}.value`, handler.bind(this), { immediate: true })
      })

      observers.validation.forEach((handler, field) => {
        this.$watch(`values.${field}`, handler.bind(this))
      })

      Object.keys(this.model).forEach(field => {
        const { validate } = this.model[field]
        this.model[field].validate = () => validate.call(this)
        this.model[field].isEmpty = isEmpty(this.values[field])

        this.$watch(`values.${field}`, (value, valueBefore) => {
          if (value === valueBefore) return
          this.model[field].isEmpty = isEmpty(value)
          this.$emit(events.changed, { field, ...this.model[field], value })
        })
      })

      this.resetDirtyState()
    },

    methods: {
      submit: createSubmitMethod(context, submit, validators),

      onSubmit() {
        const { onError = returnValue } = submit
        this.submit().catch(onError)
      },

      resetDirtyState() {
        this.isDirty = false

        this.$once(events.changed, () => {
          this.isDirty = true
        })
      },

      fill(fillFields = {}) {
        Object.keys(fillFields).forEach(field => {
          if (this.model[field] !== undefined) this.model[field].value = fillFields[field]
        })
      },

      reset() {
        Object.keys(this.model).forEach(field => {
          this.model[field].value = this.model[field].reset()
        })

        this.errors = {}
        this.resetDirtyState()
      },

      validate() {
        const isValid = validators.map(validate => validate.call(this)).every(result => result)
        this.$emit(events.formValidated, { isValid, errors: Object.values(this.errors) })
        return isValid
      },

      validateFields(fields = []) {
        return fields.every(field => this.model[field] && this.model[field].validate())
      }
    }
  })

  return function() {
    return formVM
  }
}
