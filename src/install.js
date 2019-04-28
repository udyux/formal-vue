import createForm from './factory'
import { uniqueId } from './helpers'

export default Vue => {
  const formStore = new Vue({
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
      const name = this.$options.form.name || uniqueId()
      formStore.bindState(name, this.$form)
    },

    destroyed() {
      if (!this.$options.form) return
      this.$form.$destroy()
    }
  })
}
