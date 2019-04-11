import { isEmpty, isRegExp, returnNullValue, returnTrueValue, returnValue } from '@/helpers'

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
      [/(\d+)/g, false],
      [true, false],
      [false, false],
      [null, true],
      [undefined, true],
      [{}, true],
      [[], true],
      ['', true]
    ])('isEmpty(%p)', (value, isTrue) => {
      it(isTrue ? 'is empty' : 'is not empty', () => {
        expect(isEmpty(value)).toBe(isTrue)
      })
    })
  })

  describe('isRegExp(value: Any) => Boolean', () => {
    describe.each([
      [null, false],
      [undefined, false],
      [false, false],
      [true, false],
      [0, false],
      [1, false],
      ['', false],
      [[], false],
      [{}, false],
      [/(\d+)/g, true],
      [new RegExp('/(\\d+)/g'), true]
    ])('isRegExp(%p)', (value, isTrue) => {
      it(isTrue ? 'is a regular expression' : 'is not a regular expression', () => {
        expect(isRegExp(value)).toBe(isTrue)
      })
    })
  })
})
