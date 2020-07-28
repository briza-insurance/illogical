import { Value } from '../../value'
import { Reference } from '../../reference'
import { Collection } from '../../collection'

describe('Operand - Collection', () => {
  describe('evaluate', () => {
    test.each([
      [[new Value(1)], [1]],
      [[new Value('1')], ['1']],
      [[new Value(true)], [true]],
      [[new Reference('RefA')], ['A']],
      [[new Value(1), new Reference('RefA')], [1, 'A']]
    ])('%p should evaluate as %p', (value, expected) => {
      expect(new Collection(value).evaluate({
        RefA: 'A'
      })).toStrictEqual(expected)
    })

    test.each([
      [1],
      ['1'],
      [true],
      [undefined],
      [null]
    ])('%p should throw', (value) => {
      expect(() => new Collection(value as unknown as []).evaluate({})).toThrowError()
    })
  })

  describe('toString', () => {
    test.each([
      [[new Value(1)], '[1]'],
      [[new Value('1')], '["1"]'],
      [[new Value(true)], '[true]'],
      [[new Reference('RefA')], '[{RefA}]'],
      [[new Value(1), new Reference('RefA')], '[1, {RefA}]']
    ])('%p should be %p', (value, expected) => {
      expect(new Collection(value).toString()).toBe(expected)
    })
  })
})