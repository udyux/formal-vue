import { requiredProps, propTypes } from './definitions'

const formatMessage = ([error], props) => `[Formal] ${error.trim()}${props.length > 1 ? 's' : ''}: ${props.join(', ')}`

export const validateFormShape = form => {
  if (process.env.NODE_ENV === 'production') return form

  const checkPropTypes = (expected, [key, type]) => {
    const gotType = typeof form[key]
    const isNotDefined = gotType === 'undefined'
    if (isNotDefined || type.indexOf(gotType) >= 0) return expected
    return [...expected, `\n"${key}" expected "${type}" but got "${gotType}"`]
  }

  const missingProps = requiredProps.filter(prop => !form[prop])
  if (typeof form.submit === 'object' && !form.submit.onSubmit) missingProps.push('submit.onSubmit')
  if (missingProps.length) throw formatMessage`Missing required prop ${missingProps}`

  const invalidProps = propTypes.reduce(checkPropTypes, [])
  if (invalidProps.length) throw formatMessage`Invalid prop-type ${invalidProps}`

  return form
}

export const handlers = {
  passDownValue: v => v,
  nullValue: () => null,
  trueValue: () => true
}

export const isEmptyValue = (value = null) =>
  value === null || (typeof value !== 'number' && typeof value !== 'object' && !value.length)
