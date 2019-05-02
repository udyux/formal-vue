import copyProps from 'copy-props'
import { events } from '../constants'
import { returnValue } from '../helpers'
import FormalError from '../models/FormalError'
import bindForm from './bindForm'
import reduceModel from './reduceModel'
import createSubmitMethod from './submitFactory'
import validateForm from './validateFormObject'

const { bindingError } = FormalError

export default (Vue, context, form) => {
  const { initialState, name, submit, model: modelShape, keepAlive = false } = validateForm(form)
  const { computedFieldMap, model, validators, ...bindings } = reduceModel(modelShape)

  const formVM = new Vue({
    name: `Formal.${name}`,

    data() {
      return {
        model,
        errors: {},
        isDirty: false,
        isPersistent: keepAlive,
        isSubmitPending: false,
        unbindState: () => {}
      }
    },

    computed: {
      safeValuePairs() {
        const clone = copyProps(this.model)
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
      bindForm(this, { events, ...bindings })
      this.resetDirtyState()
    },

    beforeDestroy() {
      if (!keepAlive) this.unbindState()
    },

    methods: {
      submit: createSubmitMethod(context, submit, validators),

      onSubmit() {
        const { onError = returnValue } = submit
        this.submit().catch(onError)
      },

      bind(field) {
        if (!this.model[field]) throw new FormalError(bindingError`${field} is undefined`)
        return this.model[field].value
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

      resetDirtyState() {
        this.isDirty = false

        this.$once(events.changed, () => {
          this.isDirty = true
        })
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
