export const requiredProps = ['model', 'submit']

export const events = {
  beforeSubmit: 'before-submit',
  changed: 'changed',
  fieldError: 'field-error',
  fieldValidated: 'field-validated',
  formSubmitted: 'form-submitted',
  formValidated: 'form-validated',
  submitError: 'submit-error'
}

export const propTypes = [
  ['initialState', 'function|object'],
  ['keepAlive', 'boolean'],
  ['model', 'object'],
  ['name', 'string'],
  ['submit', 'function|object'],
  ['unloadGuard', 'boolean|function']
]
