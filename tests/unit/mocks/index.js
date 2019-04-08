import { createLocalVue, mount } from '@vue/test-utils'
import FormalVue from '@/index'
import UserRegister from './UserRegister.vue'
import UserRegisterPersistent from './UserRegisterPersistent.vue'

const $store = {
  state: {
    user: { id: 1, email: 'example@email.com', phone: '8000000000' }
  }
}

const getForm = (mixin = {}) => {
  const localVue = createLocalVue()
  localVue.use(FormalVue)
  return mount(UserRegister, { localVue, mocks: { $store }, ...mixin })
}

getForm.factory = (mixin = {}) => {
  const localVue = createLocalVue()
  localVue.use(FormalVue)
  return () => mount(UserRegister, { localVue, mocks: { $store }, ...mixin })
}

const getPersistentForm = (mixin = {}) => {
  const localVue = createLocalVue()
  localVue.use(FormalVue)
  return mount(UserRegisterPersistent, { localVue, mocks: { $store }, ...mixin })
}

getPersistentForm.factory = (mixin = {}) => {
  const localVue = createLocalVue()
  localVue.use(FormalVue)
  return () => mount(UserRegisterPersistent, { localVue, mocks: { $store }, ...mixin })
}

const validValues = {
  email: 'example@email.com',
  phone: '8000000000',
  password: 'Pass1234',
  confirmPassword: 'Pass1234'
}

const expectedSubmitValues = {
  email: 'example@email.com',
  phone: '8000000000',
  intlPhone: '+18000000000',
  password: 'Pass1234',
  confirmPassword: 'Pass1234'
}

export { getForm, getPersistentForm, validValues, expectedSubmitValues }
