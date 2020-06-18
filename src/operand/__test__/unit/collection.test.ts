import { Value } from '../../value'
import { Reference } from '../../reference'
import { Collection } from '../../collection'

describe('Condition Engine - Operand - Collection', () => {
  test('constructor', () => {
    let exceptions = [
      { value: 1 },
      { value: '1' },
      { value: true },
      { value: undefined },
      { value: null }
    ]

    for (const exception of exceptions) {
      // @ts-ignore
      expect(() => new Reference(exception.value).evaluate())
        .toThrowError()
    }
  })

  test('evaluate', () => {
    let tests = [
      { value: [new Value(1)], expected: [1] },
      { value: [new Value('1')], expected: ['1'] },
      { value: [new Value(true)], expected: [true] },
      { value: [new Reference('RefA')], expected: ['A'] },
      { value: [new Value(1), new Reference('RefA')], expected: [1, 'A'] }
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(new Collection(test.value).evaluate({
        RefA: 'A'
      }))
        .toEqual(test.expected)
    }
  })

  test('toString', () => {
    let tests = [
      { value: [new Value(1)], expected: '[1]' },
      { value: [new Value('1')], expected: '["1"]' },
      { value: [new Value(true)], expected: '[true]' },
      { value: [new Reference('RefA')], expected: '[{RefA}]' },
      { value: [new Value(1), new Reference('RefA')], expected: '[1, {RefA}]' }
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(new Collection(test.value).toString())
        .toBe(test.expected)
    }
  })
})