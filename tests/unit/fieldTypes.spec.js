import fieldTypes from '@/fieldTypes'

const { array, boolean, number, object, string } = fieldTypes

describe.each([
  ['array', array, Array],
  ['boolean', boolean, Boolean],
  ['number', number, Number],
  ['object', object, Object],
  ['string', string, String]
])('fieldTypes.%s()', (name, generator, constructor) => {
  const defaultField = generator({ validateOnChange: true })
  const requiredField = generator.isRequired({ format: v => String(v) })
  const value = defaultField.initialValue()
  const tag = String(constructor())

  test(`initialValue returns type ${constructor.name}`, () => {
    expect(value.constructor.name).toBe(constructor.name)
    expect(requiredField.initialValue().constructor.name).toBe(constructor.name)
  })

  test('default field should validate on change', () => {
    expect(defaultField.validateOnChange).toBeTruthy()
  })

  test('default field should not be required', () => {
    expect(defaultField.isRequired).toBeFalsy()
  })

  it('required field should be required', () => {
    expect(requiredField.isRequired).toBeTruthy()
  })

  it(`required field should format to ${tag}`, () => {
    expect(requiredField.format(value)).toBe(tag)
  })
})
