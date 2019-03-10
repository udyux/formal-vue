import { events } from '../definitions'
import { handlers } from '../helpers'

const formatterFactory = (field, formatter) =>
  function() {
    this.fields[field].value = formatter(this.safeValuePairs)
  }

const getModelReducerState = () => ({
  fields: {},
  validators: [],
  valueMaps: new Map(),
  observers: { format: new Map(), validation: new Map() }
})

export default model =>
  Object.keys(model).reduce(($form, field) => {
    const {
      initialValue = handlers.nullValue,
      isRequired = false,
      validate: handleValidation = handlers.trueValue,
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

    if (options.format) $form.observers.format.set(field, formatterFactory(field, options.format))
    if (options.validateOnChange) $form.observers.validation.set(field, validate)
    if (options.transform) $form.valueMaps.set(field, options.transform)

    return $form
  }, getModelReducerState())
