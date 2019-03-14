import fieldTypes from '@/fieldTypes'

const $store = {
  testUser: { id: 1, email: 'dev@udy.io', phone: '4189225529' }
}

export const match = {
  // lazy email validation
  email: /^[^\s\n]+@[^\s\n]+\.[a-z0-9]{2,}$/,
  // > 8 chars, > 0 lower, > 0 upper, > 0 num
  password: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
  // 10 or 11 digits
  phone: /^\d{10,11}$/
}

export const substitute = {
  // format to 000-000-0000
  phonePrefixes: [/((?<!\d{6,})\d{3}(?=\d))/g, '$1-'],
  // remove non digits
  nonDigits: [/\D/g, '']
}

export default {
  name: 'UserRegister',
  keepAlive: true,

  model: {
    email: fieldTypes.string.isRequired({
      validate: ({ email }) => match.email.test(email)
    }),

    password: fieldTypes.string.isRequired({
      validate: ({ password }) => match.password.test(password)
    }),

    confirmPassword: fieldTypes.string.isRequired({
      validate: ({ password, confirmPassword }) => password === confirmPassword,
      validateOnChange: true
    }),

    phone: fieldTypes.string({
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

  initialState() {
    return $store.state.user
  },

  submit(values) {
    // setTimeout(() => {
    //   resolve({ values, id: this.$store.state.testUser.id })
    // }, 1000)

    return Promise.resolve({ values })
  }
}
