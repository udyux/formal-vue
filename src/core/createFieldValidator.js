import { events } from '../constants'

export default (getValidationResult, field) =>
  function() {
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
