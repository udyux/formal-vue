import { isFunction } from '../helpers'

export default ($form, unloadGuard, $window = window) => {
  if (!unloadGuard) return

  const beforeUnload = e => {
    if (!$form.isDirty) return
    e.preventDefault()
    e.returnValue = 'Leave page? Your changes might be lost.'
    return e.returnValue
  }

  const removeGuards = [() => $window.removeEventListener('beforeunload', beforeUnload)]
  $window.addEventListener('beforeunload', beforeUnload)

  if ($form.$router && isFunction(unloadGuard)) {
    removeGuards.push(
      $form.$router.beforeEach((to, from, next) => (!$form.isDirty ? next() : unloadGuard.call($form, to, from, next)))
    )
  }

  return () => removeGuards.forEach(remove => remove())
}
