import _cloneDeep from 'lodash.clonedeep'

import { events } from '../constants'
import { returnValue } from '../utils/helpers'

export default (context, submit) => {
  const onSubmit = submit.onSubmit || submit
  const { onError, onSuccess = returnValue } = submit

  return function() {
    if (this.isSubmitPending) return Promise.reject(new Error('Already submitting'))

    const values = _cloneDeep(this.values)
    this.$emit(events.beforeSubmit, values)
    this.isSubmitPending = true

    const invalidFields = Object.values(this.fields)
      .map(({ validate }) => validate.withValues.call(this, values))
      .filter(({ isValid }) => !isValid)

    const isValid = !invalidFields.length
    this.$emit(events.formValidated, { isValid, errors: invalidFields })

    const handleSubmit = (resolve, reject) => {
      if (!isValid) return reject(invalidFields)
      const result = onSubmit.call(context, { ...values, ...this.computedValues }, resolve, reject)
      if (result !== undefined) result.then(resolve).catch(reject)
    }

    const handleSuccess = response => {
      this.$emit(events.formSubmitted, response)
      this.isSubmitPending = false
      if (this.unbindState) this.unbindState()
      return Promise.resolve(onSuccess.call(this, response))
    }

    const handleError = error => {
      this.$emit(events.submitError, error)
      this.isSubmitPending = false
      if (onError) onError.call(this, error)
      return Promise.resolve({ error })
    }

    return new Promise(handleSubmit).then(handleSuccess).catch(handleError)
  }
}
