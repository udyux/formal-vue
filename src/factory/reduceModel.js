import { events } from '../constants'
import { isRegExp, returnNullValue, returnTrueValue } from '../helpers'

export default modelDefinition =>
  Object.keys(modelDefinition).reduce(
    ($form, field) => {
      const {
        initialValue = returnNullValue,
        isRequired = false,
        validate: validationHandler = returnTrueValue,
        ...options
      } = modelDefinition[field]

      const handleValidation = isRegExp(validationHandler)
        ? values => validationHandler.test(values[field])
        : validationHandler

      const getValidationResult = (values, model) => {
        const value = values[field]
        const { isEmpty } = model[field]
        const isValid = (isEmpty && !isRequired) || (!isEmpty && handleValidation(values))
        return { field, value, isValid, isMissing: isRequired && isEmpty }
      }

      const validate = function() {
        const result = getValidationResult(this.values, this.model)
        this.model[field].isValid = result.isValid
        this.model[field].isMissing = result.isMissing
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
        return getValidationResult(values, this.model)
      }

      $form.validators.push(validate)

      $form.model[field] = {
        isRequired,
        validate,
        isEmpty: true,
        isValid: true,
        isMissing: false,
        reset: initialValue,
        value: initialValue()
      }

      if (options.validateOnChange) $form.observers.validation.set(field, validate)
      if (options.compute) $form.computedFieldMap.set(field, options.compute)

      if (options.format) {
        $form.observers.format.set(field, function() {
          this.model[field].value = options.format(this.safeValuePairs)
        })
      }

      return $form
    },
    {
      model: {},
      validators: [],
      computedFieldMap: new Map(),
      observers: { format: new Map(), validation: new Map() }
    }
  )
