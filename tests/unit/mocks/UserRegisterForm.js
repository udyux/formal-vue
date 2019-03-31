import modelTypes from '@/models/modelTypes'

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

const form = {
  model: {
    email: modelTypes.string.isRequired({
      validate: ({ email }) => match.email.test(email)
    }),

    password: modelTypes.string.isRequired({
      validate: ({ password }) => match.password.test(password)
    }),

    confirmPassword: modelTypes.string.isRequired({
      validate: ({ password, confirmPassword }) => password === confirmPassword,
      validateOnChange: true
    }),

    phone: modelTypes.string({
      validate: ({ phone }) => match.phone.test(phone),
      format: ({ phone }) => phone.replace(...substitute.nonDigits).replace(...substitute.phonePrefixes),
      transform: ({ phone }) => phone.replace(...substitute.nonDigits)
    })
  },

  computed: {
    phone() {
      return `+1${this.values.phone}`
    }
  },

  submit(values) {
    return Promise.resolve({ values, user: this.$store.state.user.id, success: true })
  }
}

export const UserRegister = {
  name: 'UserRegister',
  initialState() {
    return this.$store.state.user
  },
  ...form
}

export const UserRegisterPersistent = {
  name: 'UserRegisterPersistent',
  keepAlive: true,
  initialState() {
    return { email: 'example@email.com', phone: '8000000000', password: 'Pass1234', confirmPassword: 'Pass1234' }
  },
  ...form
}
