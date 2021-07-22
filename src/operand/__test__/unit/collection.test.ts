import { defaultOptions } from '../../../parser/options'
import { Collection } from '../../collection'
import { Reference } from '../../reference'
import { Value } from '../../value'

describe('Operand - Collection', () => {
  describe('evaluate', () => {
    test.each([
      [[new Value(1)], [1]],
      [[new Value('1')], ['1']],
      [[new Value(true)], [true]],
      [[new Reference('RefA')], ['A']],
      [
        [new Value(1), new Reference('RefA')],
        [1, 'A'],
      ],
    ])('%p should evaluate as %p', (value, expected) => {
      expect(
        new Collection(value).evaluate({
          RefA: 'A',
        })
      ).toStrictEqual(expected)
    })

    test.each([[1], ['1'], [true], [undefined], [null]])(
      '%p should throw',
      (value) => {
        expect(() =>
          new Collection(value as unknown as []).evaluate({})
        ).toThrowError()
      }
    )
  })

  describe('simplify', () => {
    test.each<[(Value | Reference)[], 'self' | unknown[]]>([
      [[new Reference('test'), new Value(10)], 'self'],
      [
        [new Reference('refA'), new Value(10)],
        [20, 10],
      ],
      [
        [new Value(20), new Value(10)],
        [20, 10],
      ],
    ])('%p should simplify to %p', (value, expected) => {
      const collection = new Collection(value).simplify({ refA: 20 }, [])
      if (expected === 'self') {
        expect(collection).toBe(collection)
      } else {
        expect(collection).toEqual(expected)
      }
    })
  })

  describe('serialize', () => {
    test.each<[(Value | Reference)[], (number | string)[]]>([
      [
        [new Reference('test'), new Value(10)],
        ['$test', 10],
      ],
      [
        [new Reference('refA'), new Value(10)],
        ['$refA', 10],
      ],
      [
        [new Reference('refA'), new Value('testing')],
        ['$refA', 'testing'],
      ],
      [
        [new Value(20), new Value(10)],
        [20, 10],
      ],
    ])('%p should serialize to %p', (value, expected) => {
      expect(new Collection(value).serialize(defaultOptions)).toEqual(expected)
    })
  })

  describe('toString', () => {
    test.each([
      [[new Value(1)], '[1]'],
      [[new Value('1')], '["1"]'],
      [[new Value(true)], '[true]'],
      [[new Reference('RefA')], '[{RefA}]'],
      [[new Value(1), new Reference('RefA')], '[1, {RefA}]'],
    ])('%p should be %p', (value, expected) => {
      expect(new Collection(value).toString()).toBe(expected)
    })
  })
})
