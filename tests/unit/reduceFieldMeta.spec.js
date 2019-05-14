import { reduceFieldMeta } from '@/factory/reducers'

const context = {
  hashLevel: 144,
  data: {
    key: '',
    hash() {
      return this.hashLevel * (this.data.key.length + 1)
    }
  }
}

describe('reduceFieldMeta(context: VueComponent, metaData: Object) => Object', () => {
  const meta = reduceFieldMeta(context, context.data)

  it('has two fields', () => {
    expect(Object.keys(meta).length).toBe(2)
  })

  it('bound the computed property correctly', () => {
    expect(meta.hash).toBe(144)
  })

  it('correctly reads transformed context state', () => {
    context.data.key = 'string'
    expect(meta.hash).toBe(1008)
  })

  it('does not mutate bound context', () => {
    context.data.key = 'string'
    meta.key = ''

    expect(context.data.key).toBe('string')
    expect(meta.hash).toBe(1008)
    expect(meta.key).toBe('')
  })
})
