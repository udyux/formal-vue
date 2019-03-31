import { createLocalVue, mount } from '@vue/test-utils'
import FormalVue from '@/index'
import UserRegister from './UserRegister.vue'
import UserRegisterPersistent from './UserRegisterPersistent.vue'

const $store = {
  state: {
    user: { id: 1, email: 'example@email.com', phone: '8000000000' }
  }
}

export const getForm = (mixin = {}) => {
  const localVue = createLocalVue()
  localVue.use(FormalVue)
  return mount(UserRegister, { localVue, mocks: { $store }, ...mixin })
}

export const getPersistentForm = (mixin = {}) => {
  const localVue = createLocalVue()
  localVue.use(FormalVue)
  return mount(UserRegisterPersistent, { localVue, mocks: { $store }, ...mixin })
}
