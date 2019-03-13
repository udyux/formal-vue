import { events } from '../constants'
import { returnNullValue, returnTrueValue } from '../utils/helpers'

export default model =>
  Object.keys(model).reduce(
    ($form, field) => {
      const {
        initialValue = returnNullValue,
        isRequired = false,
        validate: handleValidation = returnTrueValue,
        ...options
      } = model[field]

      const getValidationResult = (values, fields) => {
        const value = values[field]
        const { isEmpty } = fields[field]
        const isValid = (isEmpty && !isRequired) || (!isEmpty && handleValidation(values))
        return { field, value, isValid, isMissing: isRequired && isEmpty }
      }

      const validate = function() {
        const result = getValidationResult(this.values, this.fields)
        this.fields[field].isValid = result.isValid
        this.fields[field].isMissing = result.isMissing
        this.$emit(events.fieldValidated, result)

        if (result.isValid) {
          this.$delete(this.errors, field)
        } else {
          this.errors[field] = result
          this.$emit(events.fieldError, result)
        }

        return result.isValid
      }

      validate.withValues = function(values) {
        return getValidationResult(values, this.fields)
      }

      $form.validators.push(validate)

      $form.fields[field] = {
        isRequired,
        validate,
        isEmpty: true,
        isValid: true,
        isMissing: false,
        reset: initialValue,
        value: initialValue()
      }

      if (options.validateOnChange) $form.observers.validation.set(field, validate)
      if (options.transform) $form.valueMaps.set(field, options.transform)

      if (options.format) {
        $form.observers.format.set(field, function() {
          this.fields[field].value = options.format(this.safeValuePairs)
        })
      }

      return $form
    },
    {
      fields: {},
      validators: [],
      valueMaps: new Map(),
      observers: { format: new Map(), validation: new Map() }
    }
  )
