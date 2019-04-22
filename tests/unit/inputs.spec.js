import _get from 'lodash.get'
import { inputs } from '@/index'

const testCases = [
  ['checkbox', Boolean],
  ['checkbox.group', Array],
  ['file', Object],
  ['number', Number],
  ['radio', Array],
  ['select', String],
  ['select.multiple', Array],
  ['text', String]
]

describe('inputs.js', () => {
  describe.each(testCases)('inputs.%s(options?: Object) => Object', (field, constructor) => {
    const result = _get(inputs, field)({ validateOnChange: true })
    const value = result.initialValue()

    describe('result.initialValue() => Any', () => {
      it(`returns type ${constructor.name}`, () => {
        expect(value.constructor.name).toBe(constructor.name)
      })
    })

    describe('result.validateOnChange?: Boolean', () => {
      it('is true', () => {
        expect(result.validateOnChange).toBe(true)
      })
    })

    describe('result.isRequired?: Boolean', () => {
      it('is falsy', () => {
        expect(field.isRequired).toBeFalsy()
      })
    })
  })

  describe.each(testCases)('inputs.%s.isRequired(options?: Object) => Object', (field, constructor) => {
    const result = _get(inputs, field).isRequired({ format: v => String(v) })
    const value = result.initialValue()
    const tag = String(constructor())

    describe('result.initialValue() => Any', () => {
      it(`returns type ${constructor.name}`, () => {
        expect(value.constructor.name).toBe(constructor.name)
      })
    })

    describe('result.isRequired: Boolean', () => {
      it('is true', () => {
        expect(result.isRequired).toBe(true)
      })
    })

    describe('result.format(value: Any) => Any', () => {
      it(`formats value to ${tag.valueOf()}`, () => {
        expect(result.format(value)).toBe(tag)
      })
    })
  })
})
