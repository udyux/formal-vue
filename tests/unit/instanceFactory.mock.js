import Vue from 'vue'
import FormalVue from '@/'
import UserRegister from './UserRegister.mock'

Vue.use(FormalVue)

export default new Vue({ form: UserRegister })
