import { expectedSubmitValues, getForm, getPersistentForm } from './mocks'

describe('FormalVue methods', () => {
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

      it('did not receive an error', done => {
        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.error).toBeNull()
          done()
        })
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

  describe('$form.onSubmit() => void', () => {
    describe('submit an invalid form using a delegated click event', () => {
      const wrapper = getForm({ attachToDocument: true })
      wrapper.find('#submit').trigger('click')

      it('emitted the "form-validated" event', () => {
        expect(wrapper.emitted()['form-validated']).toBeDefined()
      })

      it('emitted the "submit-error" event', () => {
        expect(wrapper.emitted()['submit-error']).toBeDefined()
      })

      it('did not emit the "form-submitted" event', () => {
        expect(wrapper.emitted()['form-submitted']).toBeUndefined()
      })
    })
  })

  describe('$form.resetDirtyState() => void', () => {
    const wrapper = getForm()
    wrapper.vm.$form.isDirty = true

    it('sets dirty state from true to false', () => {
      expect(wrapper.vm.$form.isDirty).toBe(true)
      wrapper.vm.$form.resetDirtyState()
      expect(wrapper.vm.$form.isDirty).toBe(false)
    })

    it('added the watcher', () => {
      wrapper.find('#email').setValue('a')
      expect(wrapper.vm.$form.isDirty).toBe(true)
    })
  })

  describe('$form.fill(fillFields: Object) => void', () => {
    const wrapper = getForm()
    wrapper.vm.$form.fill({ email: 'a@a.a', password: 'Pass1234', id: 1 })

    it('set email to "a@a.a"', () => {
      expect(wrapper.vm.$form.model.email.value).toBe('a@a.a')
    })

    it('set password to "Pass1234"', () => {
      expect(wrapper.vm.$form.model.password.value).toBe('Pass1234')
    })

    it('did not set an "id" field', () => {
      expect(wrapper.vm.$form.model.id).toBeUndefined()
    })
  })

  describe('$form.reset() => void', () => {
    const wrapper = getForm()
    wrapper.vm.$form.fill({ email: 'a@a.a', password: 'Pass1234', confirmPassword: 'Pass1234', phone: '9009009000' })
    wrapper.vm.$form.reset()

    it('reset all values to empty strings', () => {
      expect(Object.values(wrapper.vm.$form.values).every(v => v === '')).toBe(true)
    })
  })

  describe('$form.validate() => Boolean', () => {
    describe('validate an invalid form', () => {
      const wrapper = getForm()

      it('returns false', () => {
        expect(wrapper.vm.$form.validate()).toBe(false)
      })

      it('registered two errors', () => {
        expect(Object.keys(wrapper.vm.$form.errors).length).toBe(2)
      })
    })

    describe('validate a valid form', () => {
      const wrapper = getForm()
      wrapper.find('#password').setValue('Pass1234')
      wrapper.find('#confirm-password').setValue('Pass1234')

      it('returns true', () => {
        expect(wrapper.vm.$form.validate()).toBe(true)
      })

      it('registered no errors', () => {
        expect(Object.keys(wrapper.vm.$form.errors).length).toBe(0)
      })
    })
  })

  describe('$form.validateFields(fields: Array) => Boolean', () => {
    const wrapper = getForm()

    describe('validate one valid field and one invalid field', () => {
      it('returns false', () => {
        expect(wrapper.vm.$form.validateFields(['email', 'password'])).toBe(false)
      })

      it('registered one error', () => {
        expect(Object.keys(wrapper.vm.$form.errors).length).toBe(1)
      })
    })

    describe('validate two valid fields', () => {
      it('returns true', () => {
        expect(wrapper.vm.$form.validateFields(['email', 'phone'])).toBe(true)
      })

      it('still has only one error', () => {
        expect(Object.keys(wrapper.vm.$form.errors).length).toBe(1)
      })
    })
  })
})
