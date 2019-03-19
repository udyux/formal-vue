import modelTypes from '@/modelTypes'

const testCases = [['array', Array], ['boolean', Boolean], ['number', Number], ['object', Object], ['string', String]]

describe('modelTypes.js', () => {
  describe.each(testCases)('modelTypes.%s(mixin?: Object) => Object', (field, constructor) => {
    const result = modelTypes[field]({ validateOnChange: true })
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

  describe.each(testCases)('modelTypes.%s.isRequired(mixin?: Object) => Object', (field, constructor) => {
    const result = modelTypes[field].isRequired({ format: v => String(v) })
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
