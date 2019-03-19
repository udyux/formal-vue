<template>
  <form @submit.prevent="$form.submit">
    <input v-model="$form.model.email.value" type="text" />
    <input v-model="$form.model.password.value" type="password" />
    <input v-model="$form.model.confirmPassword.value" type="password" />
    <input v-model="$form.model.phone.value" type="text" />
  </form>
</template>

<script>
import UserRegisterForm from './UserRegisterForm'

export default {
  name: 'UserRegister',
  form: UserRegisterForm
}
</script>
