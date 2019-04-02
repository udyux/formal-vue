import { getForm, getPersistentForm } from './mocks'

describe('FormalVue events', () => {
  describe('$form.isDirty: Boolean', () => {
    describe('trigger the "changed" event once', () => {
      const wrapper = getForm()
      const initialDirtyState = wrapper.vm.$form.isDirty
      wrapper.find('#email').setValue('')

      it('went from clean to dirty', () => {
        expect(initialDirtyState).toBe(false)
        expect(wrapper.vm.$form.isDirty).toBe(true)
      })
    })
  })

  describe('events.changed => fieldData: Object', () => {
    describe('change one field to and empty string', () => {
      const wrapper = getForm()
      wrapper.find('#email').setValue('')

      it('emitted the "changed" event', () => {
        expect(wrapper.emitted().changed).toBeDefined()
      })

      it('is an empty field', () => {
        expect(wrapper.emitted().changed[0][0].isEmpty).toBe(true)
      })

      it('has a value of ""', () => {
        expect(wrapper.emitted().changed[0][0].value).toBe('')
      })
    })

    describe('change one field to a non empty string', () => {
      const wrapper = getForm()
      wrapper.find('#password').setValue('a')

      it('emitted the "changed" event', () => {
        expect(wrapper.emitted().changed).toBeDefined()
      })

      it('is not an empty field', () => {
        expect(wrapper.emitted().changed[0][0].isEmpty).toBe(false)
      })

      it('has a value of "a"', () => {
        expect(wrapper.emitted().changed[0][0].value).toBe('a')
      })
    })

    describe('change two fields', () => {
      const wrapper = getForm()
      wrapper.find('#email').setValue('')
      wrapper.find('#password').setValue('a')

      it('emitted the "changed" event twice', () => {
        expect(wrapper.emitted().changed.length).toBe(2)
      })
    })
  })

  describe('events.fieldValidated => fieldData: Object', () => {
    describe('trigger a field validator', () => {
      const wrapper = getForm()
      wrapper.vm.$form.model.phone.validate()

      it('emitted the "field-validated" event', () => {
        expect(wrapper.emitted()['field-validated']).toBeDefined()
      })

      it('is valid', () => {
        expect(wrapper.emitted()['field-validated'][0][0].isValid).toBe(true)
      })

      it('did not register an error', () => {
        expect(wrapper.vm.$form.errors.phone).toBeUndefined()
      })
    })
  })

  describe('events.fieldError => fieldData: Object', () => {
    describe('change one field that is validated on change', () => {
      const wrapper = getForm()
      wrapper.find('#confirm-password').setValue('a')

      it('emitted the "field-error" event', () => {
        expect(wrapper.emitted()['field-error']).toBeTruthy()
      })

      it('is not valid', () => {
        expect(wrapper.emitted()['field-error'][0][0].isValid).toBe(false)
      })

      it('registered an error', () => {
        expect(wrapper.vm.$form.errors.confirmPassword).toBeDefined()
      })
    })
  })

  describe('events.beforeSubmit => values: Object', () => {
    describe('submit the form', () => {
      const wrapper = getForm()
      wrapper.vm.$form.submit().catch(err => err)

      it('emitted the "before-submit" event', () => {
        expect(wrapper.emitted()['before-submit']).toBeDefined()
      })

      it('has all expected fields', () => {
        const receivedFields = Object.keys(wrapper.emitted()['before-submit'][0][0])
        const expectedFields = ['email', 'password', 'confirmPassword', 'phone']
        expect(expectedFields.every(field => receivedFields.indexOf(field) >= 0)).toBe(true)
      })
    })
  })

  describe('events.formValidated => { isValid: Boolean, errors: Array }', () => {
    describe('submit the form', () => {
      const wrapper = getForm()
      wrapper.vm.$form.submit().catch(err => err)

      it('emitted the "form-validated" event', () => {
        expect(wrapper.emitted()['form-validated']).toBeDefined()
      })

      it('is not valid', () => {
        expect(wrapper.emitted()['form-validated'][0][0].isValid).toBe(false)
      })

      it('has two errors', () => {
        expect(wrapper.emitted()['form-validated'][0][0].errors.length).toBe(2)
      })

      it('registered two errors', () => {
        expect(Object.keys(wrapper.vm.$form.errors).length).toBe(2)
      })
    })
  })

  describe('events.submitError => { error: String, message: String, data: Any }', () => {
    describe('submit an invalid form', () => {
      const wrapper = getForm()
      wrapper.vm.$form.submit().catch(err => err)

      it('emitted the "submit-error" event', () => {
        expect(wrapper.emitted()['submit-error']).toBeDefined()
      })

      it('emitted an "invalid-fields" error', () => {
        expect(wrapper.emitted()['submit-error'][0][0].error).toBe('invalid-fields')
      })
    })

    describe('submit a pending form', () => {
      const wrapper = getForm()
      wrapper.vm.$form.isSubmitPending = true
      wrapper.vm.$form.submit().catch(err => err)

      it('emitted the "submit-error" event', () => {
        expect(wrapper.emitted()['submit-error']).toBeDefined()
      })

      it('emitted a "submit-pending" error', () => {
        expect(wrapper.emitted()['submit-error'][0][0].error).toBe('submit-pending')
      })
    })
  })

  describe('events.formSubmitted: => response: Any', () => {
    describe('submit a valid form', () => {
      const wrapper = getPersistentForm()
      wrapper.vm.$form.submit()

      it('did not emit the "submit-error" event', () => {
        expect(wrapper.emitted()['submit-error']).toBeUndefined()
      })

      it('emitted the "form-submitted" event', () => {
        expect(wrapper.emitted()['form-submitted']).toBeDefined()
      })

      it('emitted the event once', () => {
        expect(wrapper.emitted()['form-submitted'].length).toBe(1)
      })
    })
  })
})

// describe('click the submit button', () => {
//   const wrapper = getForm({ attachToDocument: true })
//   wrapper.find('#submit').trigger('click')

//   it('emitted the "form-validated" event', () => {
//     expect(wrapper.emitted()['form-validated']).toBeDefined()
//   })
// })
