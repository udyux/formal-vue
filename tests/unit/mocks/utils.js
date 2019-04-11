import { createLocalVue, mount } from '@vue/test-utils'
import FormalVue from '@/index'
import { events } from '@/constants'

const mocks = {
  $http: () => ({
    post: (data = {}) => ({ data })
  }),
  $store: {
    state: {
      user: { id: 1, email: 'example@email.com', phone: '8000000000' }
    }
  }
}

export const createFormFactory = component => {
  const getter = (mixin = {}) => {
    const localVue = createLocalVue()
    localVue.use(FormalVue)
    return mount(component, { localVue, mocks, ...mixin })
  }

  getter.factory = (mixin = {}) => {
    const localVue = createLocalVue()
    localVue.use(FormalVue)
    return () => mount(component, { localVue, mocks, ...mixin })
  }

  return getter
}

export function echoEvents() {
  Object.values(events).forEach(event => {
    this.$form.$on(event, payload => {
      this.$emit(event, payload)
    })
  })
}
