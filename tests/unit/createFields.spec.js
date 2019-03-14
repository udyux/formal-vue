import createFields from '@/factories/createFields'
import UserRegister from './UserRegister.mock'

describe('createFields(UserRegister.model)', () => {
  const result = createFields(UserRegister.model)
  const fieldsArray = Object.values(result.fields)

  it('returns four fields', () => {
    expect(fieldsArray.length).toBe(4)
  })

  it('returns valid field objects', () => {
    const props = ['validate', 'isEmpty', 'isValid', 'isMissing', 'reset', 'value']
    expect(fieldsArray.every(field => props.every(prop => field[prop] !== undefined))).toBeTruthy()
  })

  it('returns three required fields', () => {
    expect(fieldsArray.filter(({ isRequired }) => isRequired).length).toBe(3)
  })

  it('returns four validators', () => {
    expect(result.validators.length).toBe(4)
  })

  it('returns one valueMap', () => {
    expect(result.valueMaps.size).toBe(1)
  })

  it('returns one format observer', () => {
    expect(result.observers.format.size).toBe(1)
  })

  it('returns one validation observer', () => {
    expect(result.observers.validation.size).toBe(1)
  })

  test('all returned fields have string values', () => {
    expect(fieldsArray.every(({ value }) => typeof value === 'string')).toBeTruthy()
  })
})
