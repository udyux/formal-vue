import _cloneDeep from 'lodash.clonedeep'

import { events, packageName } from '../constants'
import { isEmpty } from '../utils/helpers'
import createFields from './createFields'
import createSubmitMethod from './createSubmitMethod'

export default (context, { name, computed, initialState, model, submit }) => {
  const { fields, observers, validators, valueMaps } = createFields(model)

  return {
    name: `${packageName}.${name}`,

    data() {
      return {
        events,
        errors: {},
        fields: _cloneDeep(fields),
        isDirty: false,
        isSubmitPending: false,
        unbindState: null
      }
    },

    computed: {
      values() {
        return Object.keys(this.fields).reduce(
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
        const clone = _cloneDeep(this.fields)
        return Object.keys(clone).reduce((values, field) => ({ ...values, [field]: clone[field].value }), {})
      }
    },

    created() {
      this.fill(initialState)

      observers.format.forEach((handler, field) => {
        this.$watch(`fields.${field}.value`, handler.bind(this), { immediate: true })
      })

      observers.validation.forEach((handler, field) => {
        this.$watch(`values.${field}`, handler.bind(this))
      })

      Object.keys(this.fields).forEach(field => {
        this.fields[field].isEmpty = isEmpty(this.values[field])

        this.$watch(`values.${field}`, (value, valueBefore) => {
          if (value === valueBefore) return
          this.fields[field].isEmpty = isEmpty(value)
          this.$emit(events.changed, { field, ...this.fields[field], value })
        })
      })

      this.catchDirtyState()
    },

    methods: {
      submit: createSubmitMethod(context, submit),

      catchDirtyState() {
        this.isDirty = false

        this.$once(events.changed, () => {
          this.isDirty = true
        })
      },

      fill(fillFields = {}) {
        Object.keys(fillFields).forEach(field => {
          if (this.fields[field] !== undefined) this.fields[field].value = fillFields[field]
        })
      },

      reset() {
        Object.keys(this.fields).forEach(field => {
          this.fields[field].value = this.fields[field].reset()
        })

        this.catchDirtyState()
      },

      validate() {
        const isValid = validators.map(validate => validate.call(this)).every(result => result)
        this.$emit(events.formValidated, { isValid, errors: Object.values(this.errors) })
        return isValid
      }
    }
  }
}
