import validateForm from '@/factory/validateForm'

const name = 'Form'
const keepAlive = true
const model = {}
const submit = () => {}
const initialState = {}

describe('validateForm.js', () => {
  describe('validateForm(form: Object) => form: Object, throws', () => {
    describe.each([{ initialState() {}, submit }, { initialState, submit: { onSubmit() {} } }])(
      'validateForm(%p)',
      mixin => {
        const form = { name, keepAlive, model, ...mixin }
        it('returns the form', () => {
          expect(validateForm(form)).toBe(form)
        })
      }
    )

    describe.each([{ model, submit }, { name, model }, { name, submit }, { name, model, submit: {} }])(
      'validateForm(%p)',
      form => {
        it('throws a missing required prop error', () => {
          expect(() => validateForm(form)).toThrow(/^\[Formal] Missing required prop/)
        })
      }
    )

    describe.each([{ name: 1 }, { submit: 'a' }, { model: 'a' }, { initialState: 'a' }, { keepAlive: 'a' }])(
      'validateForm(%p)',
      mixin => {
        it('throws an invalid prop error', () => {
          expect(() => validateForm({ name, model, submit, ...mixin })).toThrow(/^\[Formal] Invalid prop-type/)
        })
      }
    )
  })
})
