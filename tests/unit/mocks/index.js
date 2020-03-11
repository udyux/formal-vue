import UserRegister from './UserRegister.vue'
import UserRegisterPersistent from './UserRegisterPersistent.vue'
import { createFormFactory } from './utils'

export * from './values'

export const getForm = createFormFactory(UserRegister)

export const getPersistentForm = createFormFactory(UserRegisterPersistent)
