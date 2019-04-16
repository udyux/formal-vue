import { isEmpty } from '../helpers'
import reduceFieldMeta from './reduceFieldMeta'

export default ($form, { events, observers, metaMap }) => {
  $form.$on(events.formValidated, ({ errors }) => {
    $form.errors = errors.reduce((errorMap, error) => ({ ...errorMap, [error.field]: error }), [])
  })

  observers.format.forEach((handler, field) => {
    $form.$watch(`model.${field}.value`, handler.bind($form), { immediate: true })
  })

  observers.validation.forEach((handler, field) => {
    $form.$watch(`values.${field}`, handler.bind($form))
  })

  Object.keys($form.model).forEach(field => {
    const { validate } = $form.model[field]
    $form.model[field].validate = () => validate.call($form)
    $form.model[field].isEmpty = isEmpty($form.values[field])

    $form.$watch(`values.${field}`, (value, valueBefore) => {
      if (value === valueBefore) return
      $form.model[field].isEmpty = isEmpty(value)
      $form.$emit(events.changed, { field, ...$form.model[field], value })
    })
  })

  metaMap.forEach((meta, field) => {
    $form.model[field].meta = reduceFieldMeta($form, meta)
  })
}
