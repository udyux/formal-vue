import _cloneDeep from 'lodash.clonedeep'

import { events, packageName } from '../constants'
import { isEmpty, returnValue } from '../helpers'
import reduceFieldMeta from './reduceFieldMeta'
import reduceModel from './reduceModel'
import createSubmitMethod from './submitFactory'
import validateForm from './validateForm'

export default (Vue, context, form) => {
  const { initialState, name, submit, model: modelShape } = validateForm(form)
  const { computedFieldMap, metaMap, model, observers, validators } = reduceModel(modelShape)

  const formVM = new Vue({
    name: `${packageName}.${name}`,

    data() {
      return {
        events,
        model,
        errors: {},
        isDirty: false,
        isSubmitPending: false,
        meta: {},
        unbindState: null
      }
    },

    computed: {
      safeValuePairs() {
        const clone = _cloneDeep(this.model)
        return Object.keys(clone).reduce((values, field) => ({ ...values, [field]: clone[field].value }), {})
      },

      values() {
        return Object.keys(this.model).reduce((values, field) => {
          const fieldValue = computedFieldMap.has(field)
            ? computedFieldMap.get(field)(this.safeValuePairs)
            : this.safeValuePairs[field]
          return { ...values, [field]: fieldValue }
        }, {})
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

      metaMap.forEach((meta, field) => {
        this.meta[field] = reduceFieldMeta(this, meta)
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
