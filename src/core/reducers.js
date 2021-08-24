import copyProps from 'copy-props'
import { isFunction, isRegExp, returnNullValue, returnTrueValue } from '../helpers'
import createFieldValidator from './createFieldValidator'

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

      const validate = createFieldValidator(getValidationResult, field)

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
      if (options.output) $form.computedOutputMap.set(field, options.output)
      if (options.meta) $form.metaMap.set(field, options.meta)

      if (options.mask) {
        $form.observers.masks.set(field, function() {
          this.model[field].value = options.mask(copyProps(reduceFieldValues(this.model)))
        })
      }

      return $form
    },
    {
      computedOutputMap: new Map(),
      metaMap: new Map(),
      model: {},
      observers: { masks: new Map(), validation: new Map() },
      validators: []
    }
  )
