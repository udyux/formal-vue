import { expectedSubmitValues, getPersistentForm } from './mocks'

describe('FormalVue submit method', () => {
  describe('$form.submit() => Promise<response: Any>', () => {
    describe('submit a valid form using a delegated click event', () => {
      const wrapper = getPersistentForm({ attachToDocument: true })
      wrapper.find('#submit').trigger('click')

      it('emitted the "form-validated" event', () => {
        expect(wrapper.emitted()['form-validated']).toBeDefined()
      })

      it('emitted the "form-submitted" event', () => {
        expect(wrapper.emitted()['form-submitted']).toBeDefined()
      })

      it('did not emit the "submit-error" event', () => {
        expect(wrapper.emitted()['submit-error']).toBeUndefined()
      })

      it('received a successful response', done => {
        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.result.success).toBe(true)
          done()
        })
      })

      it('correctly bound the component\'s "this"', done => {
        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.result.user).toBe(1)
          done()
        })
      })

      it('received the expected values', done => {
        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.result.values).toMatchObject(expectedSubmitValues)
          done()
        })
      })
    })
  })
})
