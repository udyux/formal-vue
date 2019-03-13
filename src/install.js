import createForm from './factories/createForm'
import validateForm from './utils/validateForm'

export default Vue => {
  const persistentStore = new Vue({
    data: () => ({ states: {} }),
    methods: {
      bindState(id, formVM) {
        formVM.unbindState = () => this.$delete(this.states, id)
        return this.states[id] || this.$set(this.states, id, formVM.fields)
      }
    }
  })

  const createComputedProp = function(formDefinition) {
    const { keepAlive, ...form } = validateForm(formDefinition)
    form.initialState = typeof form.initialState === 'function' ? form.initialState.call(this) : form.initialState
    const formVM = new Vue(createForm(this, form))
    if (form.name && keepAlive) formVM.fields = persistentStore.bindState(form.name, formVM)

    return () => formVM
  }

  Vue.mixin({
    beforeCreate() {
      if (!this.$options.form) return
      if (!this.$options.computed) this.$options.computed = {}
      this.$options.computed.$form = createComputedProp.call(this, this.$options.form)
    },

    destroyed() {
      if (!this.$options.form) return
      this.$form.$destroy()
    }
  })
}
