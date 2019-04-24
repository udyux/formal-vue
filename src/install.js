import createForm from './factory'

export default Vue => {
  const persistentStore = new Vue({
    data: { states: {} },
    methods: {
      bindState(id, formVM) {
        formVM.unbindState = () => this.$delete(this.states, id)
        formVM.model = this.states[id] || this.$set(this.states, id, formVM.model)
      }
    }
  })

  Vue.mixin({
    beforeCreate() {
      if (!this.$options.form) return
      if (!this.$options.computed) this.$options.computed = {}
      this.$options.computed.$form = createForm(Vue, this, this.$options.form)
    },

    created() {
      if (!this.$options.form) return
      const { keepAlive, name } = this.$options.form
      if (keepAlive && name) persistentStore.bindState(name, this.$form)
    },

    destroyed() {
      if (!this.$options.form) return
      this.$form.$destroy()
    }
  })
}
