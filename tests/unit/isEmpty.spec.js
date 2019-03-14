import { isEmpty } from '@/utils/helpers'

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
])('is %p considered empty', (value, empty) => {
  it(empty ? 'is empty' : 'is not empty', () => {
    expect(isEmpty(value)).toBe(empty)
  })
})
