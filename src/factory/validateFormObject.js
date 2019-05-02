import { requiredProps, propTypes } from '../constants'
import FormalError from '../models/FormalError'

const { invalidForm } = FormalError

export default form => {
  if (process.env.NODE_ENV === 'production') return form

  const checkPropTypes = (expected, [key, type]) => {
    const gotType = typeof form[key]
    const isNotDefined = gotType === 'undefined'
    if (isNotDefined || type.indexOf(gotType) >= 0) return expected
    return [...expected, `\n"${key}" expected "${type}" but got "${gotType}"`]
  }

  const missingProps = requiredProps.filter(prop => !form[prop])
  if (typeof form.submit === 'object' && !form.submit.onSubmit) missingProps.push('submit.onSubmit')
  if (missingProps.length) throw new FormalError(invalidForm`Missing required prop ${missingProps}`)

  const invalidProps = propTypes.reduce(checkPropTypes, [])
  if (invalidProps.length) throw new FormalError(invalidForm`Invalid prop-type ${invalidProps}`)

  return form
}
