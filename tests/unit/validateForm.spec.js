import validateForm from '@/utils/validateForm'

const name = 'Form'
const keepAlive = true
const model = {}
const submit = () => {}
const initialState = {}

describe.each([
  ['initialState and submit as functions', { initialState() {}, submit }],
  ['initialState and submit as objects', { initialState, submit: { onSubmit() {} } }]
])('validate form with %s', (desc, mixin) => {
  it('should return the form', () => {
    expect(validateForm({ name, keepAlive, model, ...mixin })).toBeTruthy()
  })
})

describe.each([['name', { model, submit }], ['submit', { name, model }], ['model', { name, submit }]])(
  'validate form with missing prop %p',
  (desc, form) => {
    it('throws', () => {
      expect(() => validateForm(form)).toThrow(/^\[Formal] Missing required prop/)
    })
  }
)

describe.each([
  ['name', { name: 1 }],
  ['submit', { submit: 'a' }],
  ['model', { model: 'a' }],
  ['initialState', { initialState: 'a' }],
  ['keepAlive', { keepAlive: 'a' }]
])('validate form with invalid prop %p', (desc, mixin) => {
  it('throws', () => {
    expect(() => validateForm({ name, model, submit, ...mixin })).toThrow(/^\[Formal] Invalid prop-type/)
  })
})
