import createFormalInstance from './core'
import { uniqueId, isVue } from './helpers'

export default Vue => {
  const inject = isVue(Vue, { minVersion: '2.5' }) ? { $parentForm: { default: null } } : {}

  const formStore = new Vue({
    data: { states: {} },
    methods: {
      bindState(id, FormalVM) {
        FormalVM.model = this.states[id] || this.$set(this.states, id, FormalVM.model)
        return () => this.$delete(this.states, id)
      }
    }
  })

  Vue.mixin({
    inject,
    provide: {},
    computed: {},
    beforeCreate() {
      if (!this.$options.form) return
      const FormalVM = createFormalInstance(Vue, this, this.$options.form)
      this.$options.computed.$form = FormalVM
      this.$options.provide.$parentForm = FormalVM()
    },

    created() {
      if (!this.$options.form) return
      const name = this.$options.form.name || uniqueId()
      this.$form.unbindState = formStore.bindState(name, this.$form)
    },

    destroyed() {
      if (!this.$options.form) return
      this.$form.$destroy()
    }
  })
}
