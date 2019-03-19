import { isEmpty, returnNullValue, returnTrueValue, returnValue } from '@/helpers'

describe('helpers.js', () => {
  describe('returnNullValue() => null', () => {
    it('returns `null`', () => {
      expect(returnNullValue()).toBeNull()
    })
  })

  describe('returnTrueValue() => true', () => {
    it('returns `true`', () => {
      expect(returnTrueValue()).toBe(true)
    })
  })

  describe('returnValue(value: Any) => value: Any', () => {
    describe.each([undefined, null, 0, 1.1, '', 'a', [], {}, [1, 'a'], { a: 1 }, () => {}])('returnValue(%p)', arg => {
      it(`returns ${arg}`, () => {
        expect(returnValue(arg)).toBe(arg)
      })
    })

    describe("returnValue('a', 1)", () => {
      it('returns the first argument', () => {
        expect(returnValue('a', 1)).toBe('a')
      })
    })
  })

  describe('isEmpty(value: Any) => Boolean', () => {
    describe.each([
      [0, false],
      [1.1, false],
      [-1, false],
      ['1', false],
      [['1'], false],
      [{ a: '1' }, false],
      [null, true],
      [undefined, true],
      [{}, true],
      [[], true],
      ['', true]
    ])('isEmpty(%p)', (value, empty) => {
      it(empty ? 'is empty' : 'is not empty', () => {
        expect(isEmpty(value)).toBe(empty)
      })
    })
  })
})
