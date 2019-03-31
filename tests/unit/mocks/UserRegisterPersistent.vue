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
import { UserRegisterPersistent } from './UserRegisterForm'
import { events } from '@/constants'

export default {
  name: 'UserRegisterPersistent',
  form: UserRegisterPersistent,
  beforeMount() {
    Object.values(events).forEach(event => {
      this.$form.$on(event, payload => {
        this.$emit(event, payload)
      })
    })
  },

  methods: {
    submit() {
      this.$form
        .submit()
        .then(result => result)
        .catch(error => error)
    }
  }
}
</script>
