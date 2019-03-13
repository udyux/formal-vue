import { isEmpty, returnNullValue, returnTrueValue, returnValue } from '@/utils/helpers'

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

describe.each([[''], ['a'], [[]], [[1, 2]], [{}], [{ a: 1 }], [true], [false], [undefined], [null]])(
  'returnValue(%p)',
  value => {
    it(`returns ${JSON.stringify(value)}`, () => {
      expect(returnValue(value)).toBe(value)
    })
  }
)

describe('returnNullValue()', () => {
  it('returns null', () => {
    expect(returnNullValue()).toBeNull()
  })
})

describe('returnTrueValue()', () => {
  it('returns true', () => {
    expect(returnTrueValue()).toBeTruthy()
  })
})
