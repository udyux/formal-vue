import createSubmitMethod from '@/factory/createSubmitMethod'

describe('createSubmitMethod.js', () => {
  describe('createSubmitMethod(context: VueComponent, submit: Function | Object) => Function', () => {
    it('returns a function', () => {
      expect(typeof createSubmitMethod({}, () => {})).toBe('function')
    })
  })
})
