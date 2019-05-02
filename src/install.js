import createForm from './factory'
import { uniqueId } from './helpers'

export default Vue => {
  const [major, minor] = Vue.version.split('.').map(Number)
  const inject = major < 2 || minor < 5 ? {} : { $parentForm: { default: null } }

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
    inject,
    provide: {},
    computed: {},
    beforeCreate() {
      if (!this.$options.form) return
      const formVM = createForm(Vue, this, this.$options.form)
      this.$options.computed.$form = formVM
      this.$options.provide.$parentForm = formVM()
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
