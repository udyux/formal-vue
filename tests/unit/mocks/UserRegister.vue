<template>
  <form @submit.prevent="$form.onSubmit">
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

export default {
  name: 'MockForm',
  beforeMount: echoEvents,

  form: {
    ...baseForm,
    name: 'UserRegister',
    initialState() {
      return this.$store.state.user
    },
    submit(values) {
      return Promise.resolve({ values, user: this.$store.state.user.id, success: true })
    }
  }
}
</script>
