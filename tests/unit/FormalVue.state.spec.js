import _cloneDeep from 'lodash.clonedeep'

import { events } from '@/constants'
import { getForm, getPersistentForm, validValues } from './mocks'

const originalEmail = validValues.email
const replacedEmail = 'something@original.io'

describe('FormalVue state', () => {
  describe('initial state', () => {
    const renderedForm = getForm()
    const persistentForm = getPersistentForm()

    it('renders a form element', () => {
      expect(renderedForm.contains('form')).toBeTruthy()
    })

    it('renders four inputs', () => {
      expect(renderedForm.findAll('input').length).toBe(4)
    })

    it('renders a button', () => {
      expect(renderedForm.contains('button')).toBeTruthy()
    })

    describe('vm.$form: FormalVue', () => {
      const { $form } = renderedForm.vm

      it('has a mounted form instance', () => {
        expect($form).toBeTruthy()
      })

      describe('$form.events: Object', () => {
        it('is the events constant', () => {
          expect($form.events).toBe(events)
        })
      })

      describe('$form.errors: Object', () => {
        it('is an empty object', () => {
          expect(Object.keys($form.errors).length).toBe(0)
        })
      })

      describe('$form.model: Object', () => {
        it('is an object', () => {
          expect(typeof $form.model).toBe('object')
        })

        it('has four fields', () => {
          expect(Object.keys($form.model).length).toBe(4)
        })

        describe('FormalVue.initialState(values: Object) => void', () => {
          describe.each([
            ['email', false, 'example@email.com', 'example@email.com'],
            ['password', true],
            ['confirmPassword', true],
            ['phone', false, '800-000-0000', '8000000000']
          ])('%p initial values', (field, empty, formattedValue = '', rawValue = '') => {
            describe(`$form.model.${field}.isEmpty: Boolean`, () => {
              it(empty ? 'is empty' : 'is not empty', () => {
                expect($form.model[field].isEmpty).toBe(empty)
              })
            })

            describe(`$form.model.${field}.value: Any`, () => {
              it(`is "${formattedValue}"`, () => {
                expect($form.model[field].value).toBe(formattedValue)
              })
            })

            describe(`$form.values.${field}: Any`, () => {
              it(`is "${rawValue}"`, () => {
                expect($form.values[field]).toBe(rawValue)
              })
            })
          })
        })
      })

      describe('$form.isDirty: Boolean', () => {
        it('is a boolean', () => {
          expect(typeof $form.isDirty).toBe('boolean')
        })

        it('is false', () => {
          expect($form.isDirty).toBeFalsy()
        })
      })

      describe('$form.isSubmitPending: Boolean', () => {
        it('is a boolean', () => {
          expect(typeof $form.isSubmitPending).toBe('boolean')
        })

        it('is false', () => {
          expect($form.isSubmitPending).toBeFalsy()
        })
      })

      describe('$form.values: Object', () => {
        it('has the same keys as $form.model', () => {
          expect(Object.keys($form.values).join()).toBe(Object.keys($form.model).join())
        })
      })

      describe('$form.safeValuePairs: Object', () => {
        it('has the same keys as $form.model', () => {
          expect(Object.keys($form.safeValuePairs).join()).toBe(Object.keys($form.model).join())
        })
      })

      describe.each([
        ['unbindState', '', 'void'],
        ['submit', '', 'Promise<Any>'],
        ['resetDirtyState', '', 'void'],
        ['fill', 'fillFields?: Object', 'void'],
        ['reset', '', 'void'],
        ['validate', '', 'Boolean']
      ])('$form.%s(%s) => %s', method => {
        it('is defined', () => {
          expect(persistentForm.vm.$form[method]).toBeDefined()
        })

        it('is a function', () => {
          expect(typeof persistentForm.vm.$form[method]).toBe('function')
        })
      })
    })
  })

  describe('computed props', () => {
    describe('$form.values: Object', () => {
      const wrapper = getForm()

      it('has four fields', () => {
        expect(Object.keys(wrapper.vm.$form.values).length).toBe(4)
      })

      it('contains computed values', () => {
        expect(wrapper.vm.$form.model.phone.value).toBe('800-000-0000')
        expect(wrapper.vm.$form.values.phone).toBe('8000000000')
      })
    })

    describe('$form.safeValuePairs: Object', () => {
      const wrapper = getForm()
      const modelClone = _cloneDeep(wrapper.vm.$form.model)
      wrapper.vm.$form.safeValuePairs.password = 'a'

      it('has four fields', () => {
        expect(Object.keys(wrapper.vm.$form.safeValuePairs).length).toBe(4)
      })

      it('does not mutate the original values', () => {
        expect(wrapper.vm.$form.model.password.value).toBe(modelClone.password.value)
      })
    })
  })

  describe('persistence', () => {
    describe('formDefinition.keepAlive?: Boolean', () => {
      describe('destroy and remount a persistent form', () => {
        const wrapperFactory = getPersistentForm.factory()
        const wrapper = wrapperFactory()
        wrapper.find('#email').setValue(replacedEmail)
        wrapper.destroy()

        it('mounts with the modified value', () => {
          expect(wrapperFactory().vm.$form.values.email).toBe(replacedEmail)
        })
      })

      describe('manually unbind then destroy and remount a persistent form', () => {
        const wrapperFactory = getPersistentForm.factory()
        const wrapper = wrapperFactory()
        wrapper.find('#email').setValue(replacedEmail)
        wrapper.vm.$form.unbindState()
        wrapper.destroy()

        it('mounts with the original value', () => {
          expect(wrapperFactory().vm.$form.values.email).toBe(originalEmail)
        })
      })

      describe('submit then destroy and remount a persistent form', () => {
        const wrapperFactory = getPersistentForm.factory()
        const wrapper = wrapperFactory()
        wrapper.find('#email').setValue(replacedEmail)
        wrapper.vm.$form.submit()

        it('mounts with the original value', done => {
          wrapper.vm.$nextTick(() => {
            wrapper.destroy()
            expect(wrapperFactory().vm.$form.values.email).toBe(originalEmail)
            done()
          })
        })
      })

      describe('destroy and remount a non-persistent form', () => {
        const wrapperFactory = getForm.factory()
        const wrapper = wrapperFactory()
        wrapper.find('#email').setValue(originalEmail)
        wrapper.destroy()

        it('mounts with the original value', () => {
          expect(wrapperFactory().vm.$form.values.email).toBe(originalEmail)
        })
      })
    })
  })
})
