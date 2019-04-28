import copyProps from 'copy-props'
import FormalError from '@/models/FormalError'
import { events } from '../constants'
import { returnValue } from '../helpers'

const { invalidFields, responseError, submitPending, unhandledRejection } = FormalError

export default (context, submit, validators) => {
  const onSubmit = submit.onSubmit || submit
  const { onError, onSuccess = returnValue } = submit

  return function() {
    const handleSubmit = (resolve, reject) => {
      if (this.isSubmitPending) return reject(new FormalError(submitPending))

      const values = copyProps(this.values)
      this.$emit(events.beforeSubmit, values)
      this.isSubmitPending = true

      const invalidFieldMap = validators
        .map(validate => validate.withValues.call(this, values))
        .filter(({ isValid }) => !isValid)

      const isValid = !invalidFieldMap.length
      this.$emit(events.formValidated, { isValid, errors: invalidFieldMap })

      if (!isValid) return reject(new FormalError(invalidFields, { invalidFieldMap }))

      const rejectWrapper = data => reject(new FormalError(responseError, data))
      const result = onSubmit.call(context, values, resolve, rejectWrapper)
      if (result !== undefined) result.then(resolve).catch(rejectWrapper)
    }

    return new Promise(handleSubmit)
      .then(response => {
        this.$emit(events.formSubmitted, response)
        this.isSubmitPending = false
        this.unbindState()
        return Promise.resolve(onSuccess.call(context, response))
      })
      .catch(err => {
        const error = err instanceof FormalError ? err : new FormalError(unhandledRejection, err)
        this.$emit(events.submitError, error)
        this.isSubmitPending = false
        if (onError) onError.call(context, error)
        return Promise.reject(error)
      })
  }
}
