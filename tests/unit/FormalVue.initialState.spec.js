import { events } from '@/constants'
import { getForm, getPersistentForm } from './mocks/formInstanceFactory'

describe('FormalVue initial-state', () => {
  describe('mounted instance', () => {
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

      describe('$form.computedValues: Object', () => {
        it('has one field', () => {
          expect(Object.keys($form.computedValues).length).toBe(1)
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
})
