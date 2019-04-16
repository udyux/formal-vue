import UserRegister from './UserRegister.vue'
import UserRegisterPersistent from './UserRegisterPersistent.vue'
import { createFormFactory } from './utils'

export const validValues = {
  email: 'example@email.com',
  phone: '8000000000',
  password: 'Pass1234',
  confirmPassword: 'Pass1234'
}

export const expectedSubmitValues = {
  email: 'example@email.com',
  phone: '8000000000',
  password: 'Pass1234',
  confirmPassword: 'Pass1234'
}

export const metaFields = [['email', 'label', 'Email'], ['password', 'hash', 2592]]
export const getForm = createFormFactory(UserRegister)
export const getPersistentForm = createFormFactory(UserRegisterPersistent)
