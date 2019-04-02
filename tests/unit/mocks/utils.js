import { events } from '@/constants'

export function echoEvents() {
  Object.values(events).forEach(event => {
    this.$form.$on(event, payload => {
      this.$emit(event, payload)
    })
  })
}
