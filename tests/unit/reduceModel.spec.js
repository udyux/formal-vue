import createModel from '@/factory/reduceModel'
import UserRegister from './mocks/baseForm'

describe('reduceModel.js', () => {
  describe('reduceModel(model: Object) => fieldMaps: Object', () => {
    const $form = createModel(UserRegister.model)
    const fieldsArray = Object.values($form.model)

    describe('$form.model: Object', () => {
      it('has four fields', () => {
        expect(fieldsArray.length).toBe(4)
      })

      it('has valid field objects', () => {
        const props = ['validate', 'isEmpty', 'isValid', 'isMissing', 'reset', 'value']
        expect(fieldsArray.every(field => props.every(prop => field[prop] !== undefined))).toBeTruthy()
      })

      it('has three required fields', () => {
        expect(fieldsArray.filter(({ isRequired }) => isRequired).length).toBe(3)
      })

      describe.each(Object.keys($form.model))('$form.model.%s.value', key => {
        it('is a string', () => {
          expect(typeof $form.model[key].value).toBe('string')
        })
      })
    })

    describe('$form.validators: Array', () => {
      it('has four validators', () => {
        expect($form.validators.length).toBe(4)
      })
    })

    describe('$form.valueMaps: Map', () => {
      it('has one entry', () => {
        expect($form.valueMaps.size).toBe(1)
      })
    })

    describe('$form.observers.format: Map', () => {
      it('has one entry', () => {
        expect($form.observers.format.size).toBe(1)
      })
    })

    describe('$form.observers.validation: Map', () => {
      it('has one entry', () => {
        expect($form.observers.validation.size).toBe(1)
      })
    })
  })
})
