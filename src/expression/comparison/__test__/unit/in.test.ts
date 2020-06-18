import { Value } from '../../../../operand/value'
import { Reference } from '../../../../operand/reference'
import { In } from '../../in'
import { Collection } from '../../../../operand/collection'

describe('Condition Engine - Expression - Comparison - In', () => {
  describe('constructor', () => {
    // @ts-ignore
    expect(() => new In())
      .toThrowError()
    // @ts-ignore
    expect(() => new In(5))
      .toThrowError()
    // @ts-ignore
    expect(() => new In(5, 5, 5))
      .toThrowError()
  })
  describe('evaluate', () => {

    // Test value types against value types
    test('value type', () => {
      let tests = [
        // Truthy
        { left: new Value(1), right: new Collection([new Value(1), new Value(2)]), expected: true },
        { left: new Value('1'), right: new Collection([new Value('1'), new Value('2')]), expected: true },
        // Truthy - Bi-directional
        { left: new Collection([new Value(1), new Value(2)]), right: new Value(1), expected: true },
        { left: new Collection([new Value('1'), new Value('2')]), right: new Value('1'), expected: true },
        // Falsy - explicit
        { left: new Value(0), right: new Collection([new Value(1), new Value(2)]), expected: false },
        { left: new Value('0'), right: new Collection([new Value('1'), new Value('2')]), expected: false },
        // Falsy - non-comparable types
        { left: new Value('0'), right: new Collection([new Value(1), new Value(2)]), expected: false },
        { left: new Value(0), right: new Collection([new Value('1'), new Value('2')]), expected: false },
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new In(test.left, test.right).evaluate({}))
          .toBe(test.expected)
      }

      let exceptions = [
        // None of array
        { left: new Value(1), right: new Value(1) },
        // Both of array
        { left: new Collection([new Value(1)]), right: new Collection([new Value(1)]) },
      ]

      for (const exception of exceptions) {
        // @ts-ignore
        expect(() => new In(exception.left, exception.right).evaluate({}))
          .toThrowError()
      }
    })

    // Test reference types against reference types
    test('reference type', () => {
      let tests = [
        // Truthy
        { left: new Reference('RefA'), right: new Reference('RefB'), expected: true },
        { left: new Reference('RefC'), right: new Reference('RefD'), expected: true },
        // Falsy - explicit
        { left: new Reference('RefE'), right: new Reference('RefB'), expected: false },
        { left: new Reference('RefF'), right: new Reference('RefD'), expected: false },
        // Falsy - non-comparable types
        { left: new Reference('RefA'), right: new Reference('RefD'), expected: false },
        { left: new Reference('RefC'), right: new Reference('RefB'), expected: false },
        { left: new Reference('RefA'), right: new Reference('RefG'), expected: false },
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new In(test.left, test.right).evaluate({
          RefA: 1,
          RefB: [1, 2],
          RefC: '1',
          RefD: ['1', '2'],
          RefE: 0,
          RefF: '0',
          // RefG = undefined
        }))
          .toBe(test.expected)
      }

      let exceptions = [
        // None of array
        { left: new Reference('RefA'), right: new Reference('RefA') },
        // Both of array
        { left: new Reference('RefB'), right: new Reference('RefB') },
      ]

      for (const exception of exceptions) {
        // @ts-ignore
        expect(() => new In(exception.left, exception.right).evaluate({
          RefA: 1,
          RefB: [1, 2],
        }))
          .toThrowError()
      }
    })

    // Test reference types against value types
    test('reference/value type', () => {
      let tests = [
        // Truthy
        { left: new Reference('RefA'), right: new Collection([new Value(1)]), expected: true },
        { left: new Reference('RefB'), right: new Collection([new Value('1')]), expected: true },
        // Falsy - explicit
        { left: new Reference('RefA'), right: new Collection([new Value(0)]), expected: false },
        { left: new Reference('RefB'), right: new Collection([new Value('0')]), expected: false },
        // Falsy - non-comparable types
        { left: new Reference('RefA'), right: new Collection([new Value('1')]), expected: false },
        { left: new Reference('RefB'), right: new Collection([new Value(1)]), expected: false },
        { left: new Reference('RefC'), right: new Collection([new Value(1)]), expected: false },
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new In(test.left, test.right).evaluate({
          RefA: 1,
          RefB: '1',
          // RefC = undefined
        }))
          .toBe(test.expected)
      }

      let exceptions = [
        // None of array
        { left: new Reference('RefA'), right: new Value(1) },
        // Both of array
        { left: new Reference('RefB'), right: new Collection([new Value(1)]) },
      ]

      for (const exception of exceptions) {
        // @ts-ignore
        expect(() => new In(exception.left, exception.right).evaluate({
          RefA: 1,
          RefB: [1],
        }))
          .toThrowError()
      }
    })
  })

  test('toString', () => {
    let tests = [
      { left: new Value(0), right: new Collection([new Value(1), new Value(2)]), expected: '(0 in [1, 2])' },
      { left: new Collection([new Value(1), new Value(2)]), right: new Value(0), expected: '(0 in [1, 2])' },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(new In(test.left, test.right).toString())
        .toBe(test.expected)
    }
  })
})
