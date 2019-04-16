import inputs from '@/models/inputs'

const match = {
  // lazy email validation
  email: /^[^\s\n]+@[^\s\n]+\.[a-z0-9]{2,}$/,
  // > 8 chars, > 0 lower, > 0 upper, > 0 num
  password: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
  // 10 or 11 digits
  phone: /^\d{10,11}$/
}

const substitute = {
  // format to 000-000-0000
  phonePrefixes: [/((?<!\d{6,})\d{3}(?=\d))/g, '$1-'],
  // remove non digits
  nonDigits: [/\D/g, '']
}

export default {
  model: {
    email: inputs.text.isRequired({
      validate: match.email,
      meta: { label: 'Email' }
    }),

    password: inputs.text.isRequired({
      validate: ({ password }) => match.password.test(password),
      meta: {
        hash() {
          return (this.model.email.value.length + 1) * 144
        }
      }
    }),

    confirmPassword: inputs.text.isRequired({
      validate: ({ password, confirmPassword }) => password === confirmPassword,
      validateOnChange: true
    }),

    phone: inputs.text({
      validate: ({ phone }) => match.phone.test(phone),
      format: ({ phone }) => phone.replace(...substitute.nonDigits).replace(...substitute.phonePrefixes),
      compute: ({ phone }) => phone.replace(...substitute.nonDigits)
    })
  }
}
