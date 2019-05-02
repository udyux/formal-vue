export default class FormalError extends Error {
  static invalidForm = ([error], props) => ({
    error: 'invalid-form',
    message: `[Formal] ${error.trim()}${props.length > 1 ? 's' : ''}: ${props.join(', ')}`
  })

  static bindingError = (errors, field) => ({
    error: 'undefined-binding',
    message: `[Formal] Could not bind field: ${field} ${errors[1].trim()}.`
  })

  static invalidFields = {
    error: 'invalid-fields',
    message: '[Formal] The form contains invalid fields.'
  }

  static responseError = {
    error: 'response-error',
    message: '[Formal] The form submission responded with an error.'
  }

  static submitPending = {
    error: 'submit-pending',
    message: '[Formal] The form was already submitted and has not responded yet.'
  }

  static unhandledRejection = {
    error: 'unhandled-rejection',
    message: '[Formal] The form submission encountered an unhandled error.'
  }

  constructor({ error, message }, data = {}) {
    super(message)
    this.error = error
    this.data = data

    if (Error.captureStackTrace) Error.captureStackTrace(this, FormalError)
  }
}
