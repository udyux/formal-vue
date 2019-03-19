import createSubmitMethod from '@/factory/submitFactory'

describe('submitFactory.js', () => {
  describe('createSubmitMethod(context: VueComponent, submit: Function | Object) => Function', () => {
    it('returns a function', () => {
      expect(typeof createSubmitMethod({}, () => {})).toBe('function')
    })
  })
})
