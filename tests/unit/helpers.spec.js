import {
  isEmpty,
  isFunction,
  isNullOrUndefined,
  isNumber,
  isObject,
  isRegExp,
  returnNullValue,
  returnTrueValue,
  returnValue
} from '@/helpers'

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
    describe.each([undefined, null, 0, 1, -1, 1.1, NaN, Infinity, '', 'a', [], {}, [1, 'a'], { a: 1 }, () => {}])(
      'returnValue(%p)',
      arg => {
        it(`returns ${arg}`, () => {
          expect(returnValue(arg)).toBe(arg)
        })
      }
    )

    describe("returnValue('a', 1)", () => {
      it('returns the first argument', () => {
        expect(returnValue('a', 1)).toBe('a')
      })
    })
  })

  describe('isEmpty(value: Any) => Boolean', () => {
    describe.each([
      [0, false],
      [1, false],
      [-1, false],
      [0.1, false],
      [1.1, false],
      [Infinity, false],
      ['1', false],
      [['1'], false],
      [{ a: '1' }, false],
      [/(\d+)/g, false],
      [function mock() {}, false],
      [() => {}, false],
      [true, false],
      [NaN, true],
      [false, true],
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
      [-1, false],
      [0.1, false],
      [1.1, false],
      [NaN, false],
      [Infinity, false],
      ['', false],
      [[], false],
      [{}, false],
      [() => {}, false],
      [/(\d+)/g, true],
      [new RegExp('/(\\d+)/g'), true]
    ])('isRegExp(%p)', (value, isTrue) => {
      it(isTrue ? 'is a regular expression' : 'is not a regular expression', () => {
        expect(isRegExp(value)).toBe(isTrue)
      })
    })
  })

  describe('isFunction(value: Any) => Boolean', () => {
    describe.each([
      [null, false],
      [undefined, false],
      [false, false],
      [true, false],
      [0, false],
      [1, false],
      [-1, false],
      [0.1, false],
      [1.1, false],
      [NaN, false],
      [Infinity, false],
      ['', false],
      [[], false],
      [{}, false],
      [/(\d+)/g, false],
      [new RegExp('/(\\d+)/g'), false],
      [function mock() {}, true],
      [() => {}, true]
    ])('isFunction(%p)', (value, isTrue) => {
      it(isTrue ? 'is a function' : 'is not a function', () => {
        expect(isFunction(value)).toBe(isTrue)
      })
    })
  })

  describe('isNullOrUndefined(value: Any) => Boolean', () => {
    describe.each([
      [false, false],
      [true, false],
      [0, false],
      [1, false],
      [-1, false],
      [0.1, false],
      [1.1, false],
      [NaN, false],
      [Infinity, false],
      ['', false],
      [[], false],
      [{}, false],
      [/(\d+)/g, false],
      [new RegExp('/(\\d+)/g'), false],
      [function mock() {}, false],
      [() => {}, false],
      [null, true],
      [undefined, true]
    ])('isNullOrUndefined(%p)', (value, isTrue) => {
      it(isTrue ? 'is null or undefined' : 'is not null or undefined', () => {
        expect(isNullOrUndefined(value)).toBe(isTrue)
      })
    })
  })

  describe('isNumber(value: Any) => Boolean', () => {
    describe.each([
      [null, false],
      [undefined, false],
      [false, false],
      [true, false],
      ['', false],
      [[], false],
      [{}, false],
      [/(\d+)/g, false],
      [new RegExp('/(\\d+)/g'), false],
      [function mock() {}, false],
      [() => {}, false],
      [NaN, false],
      [0, true],
      [1, true],
      [-1, true],
      [0.1, true],
      [1.1, true],
      [Infinity, true]
    ])('isNumber(%p)', (value, isTrue) => {
      it(isTrue ? 'is a number' : 'is not a number', () => {
        expect(isNumber(value)).toBe(isTrue)
      })
    })
  })

  describe('isObject(value: Any) => Boolean', () => {
    describe.each([
      [null, false],
      [undefined, false],
      [false, false],
      [true, false],
      [0, false],
      [1, false],
      [-1, false],
      [0.1, false],
      [1.1, false],
      [NaN, false],
      [Infinity, false],
      ['', false],
      [[], false],
      [['1'], false],
      [function mock() {}, false],
      [() => {}, false],
      [{}, true],
      [{ a: '1' }, true],
      [/(\d+)/g, true],
      [new RegExp('/(\\d+)/g'), true]
    ])('isObject(%p)', (value, isTrue) => {
      it(isTrue ? 'is an object' : 'is not an object', () => {
        expect(isObject(value)).toBe(isTrue)
      })
    })
  })
})
