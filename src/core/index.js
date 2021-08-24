import copyProps from 'copy-props'
import { events } from '../constants'
import { returnValue } from '../helpers'
import FormalError from '../models/FormalError'
import bindFormEvents from './bindFormEvents'
import createSubmitMethod from './createSubmitMethod'
import createUnloadGuard from './createUnloadGuard'
import { reduceFieldValues, reduceModel } from './reducers'
import validateForm from './validateFormObject'

const { bindingError } = FormalError

export default (Vue, context, form) => {
  const { initialState, name, submit, model, unloadGuard = false, keepAlive = false } = validateForm(form)
  const bindings = reduceModel(model)

  const FormalVM = new Vue({
    name: `Formal.${name}`,

    data() {
      return {
        errors: {},
        isDirty: false,
        isSubmitPending: false,
        model: bindings.model,
        unbindState: () => {},
        removeUnloadGuard: () => {}
      }
    },

    computed: {
      values() {
        const safeValues = copyProps(reduceFieldValues(this.model))
        return Object.keys(this.model).reduce(
          (values, field) => ({
            ...values,
            [field]: bindings.computedOutputMap.has(field)
              ? bindings.computedOutputMap.get(field)(safeValues)
              : safeValues[field]
          }),
          {}
        )
      }
    },

    created() {
      const initialStateModel = typeof initialState === 'function' ? initialState.call(context) : initialState
      this.fill(initialStateModel)
      bindFormEvents(this, { events, ...bindings })
      this.resetDirtyState()
      this.removeUnloadGuard = createUnloadGuard(this, unloadGuard)
    },

    beforeDestroy() {
      if (!keepAlive && this.unbindState) this.unbindState()
      this.removeUnloadGuard()
    },

    methods: {
      submit: createSubmitMethod(context, submit, bindings.validators),

      onSubmit() {
        const { onError = returnValue } = submit
        this.submit().catch(onError)
      },

      bind(field) {
        if (!this.model[field]) throw new FormalError(bindingError`${field} is undefined`)
        return this.model[field].value
      },

      fill(fillFields = {}) {
        Object.entries(fillFields).forEach(([field, value]) => {
          if (this.model[field] !== undefined) this.model[field].value = value
        })
      },

      reset() {
        Object.entries(this.model).forEach(([field, { reset }]) => {
          this.model[field].value = reset()
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
        const isValid = bindings.validators.map(validate => validate.call(this)).every(result => result)
        this.$emit(events.formValidated, { isValid, errors: Object.values(this.errors) })
        return isValid
      },

      validateFields(fields = []) {
        return fields.every(field => this.model[field] && this.model[field].validate())
      }
    }
  })

  return function() {
    return FormalVM
  }
}
