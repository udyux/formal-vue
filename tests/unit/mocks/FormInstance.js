import { createLocalVue } from '@vue/test-utils'
import FormalVue from '@/'
import UserRegisterForm from './UserRegisterForm'

const localVue = createLocalVue()

localVue.use(FormalVue)

export default new localVue({ form: UserRegisterForm })
