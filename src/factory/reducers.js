import copyProps from 'copy-props'
import { events } from '../constants'
import { isFunction, isRegExp, returnNullValue, returnTrueValue } from '../helpers'

export const reduceFieldValues = fields =>
  Object.entries(fields).reduce((values, [field, { value }]) => ({ ...values, [field]: value }), {})

export const reduceFieldMeta = (context, meta = {}) =>
  Object.entries(meta).reduce((metaData, [key, value]) => {
    const enumerable = true
    const getter = isFunction(value) && { get: () => value.call(context), enumerable }
    return Object.defineProperty(metaData, key, getter || { enumerable, value, writable: true })
  }, {})

export const reduceModel = formModel =>
  Object.keys(formModel).reduce(
    ($form, field) => {
      const {
        initialValue = returnNullValue,
        isRequired = false,
        validate: validationHandler = returnTrueValue,
        ...options
      } = formModel[field]

      const handleValidation = isRegExp(validationHandler)
        ? values => validationHandler.test(values[field])
        : validationHandler

      const getValidationResult = (values, model) => {
        const value = values[field]
        const { isEmpty } = model[field]
        const isMissing = isRequired && (isEmpty || value === false)
        const isValid = (isEmpty && !isRequired) || (!isMissing && handleValidation(values))
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
        meta: {},
        reset: initialValue,
        value: initialValue()
      }

      if (options.validateOnChange) $form.observers.validation.set(field, validate)
      if (options.compute) $form.computedFieldMap.set(field, options.compute)
      if (options.meta) $form.metaMap.set(field, options.meta)

      if (options.format) {
        $form.observers.format.set(field, function() {
          this.model[field].value = options.format(copyProps(reduceFieldValues(this.model)))
        })
      }

      return $form
    },
    {
      computedFieldMap: new Map(),
      metaMap: new Map(),
      model: {},
      observers: { format: new Map(), validation: new Map() },
      validators: []
    }
  )
