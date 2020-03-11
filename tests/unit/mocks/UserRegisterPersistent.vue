<template>
  <form @submit.prevent="submit">
    <input id="email" v-model="$form.model.email.value" type="text" />
    <input id="password" v-model="$form.model.password.value" type="password" />
    <input id="confirm-password" v-model="$form.model.confirmPassword.value" type="password" />
    <input id="phone" v-model="$form.model.phone.value" type="text" />
    <button id="submit" type="submit" />
  </form>
</template>

<script>
import baseForm from './baseForm'
import { echoEvents } from './utils'
import { validValues } from './values'

export default {
  name: 'MockForm',

  data() {
    return { error: null, result: null }
  },

  beforeMount: echoEvents,

  form: {
    ...baseForm,
    name: 'UserRegisterPersistent',
    keepAlive: true,
    initialState() {
      return validValues
    },
    submit(values) {
      return Promise.resolve({ values, user: this.$store.state.user.id, success: true })
    }
  },

  methods: {
    submit() {
      this.$form
        .submit()
        .then(result => {
          this.result = result
        })
        .catch(error => {
          this.error = error
        })
    }
  }
}
</script>
