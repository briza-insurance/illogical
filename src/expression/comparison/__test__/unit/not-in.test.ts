import { Value } from '../../../../operand/value'
import { Reference } from '../../../../operand/reference'
import { NotIn } from '../../not-in'

describe('Condition Engine - Expression - Comparison - Not In', () => {
  describe('evaluate', () => {

    // Test value types against value types
    test('value type', () => {
      let tests = [
        // Truthy
        { left: new Value(0), right: new Value([1, 2]), expected: true },
        { left: new Value('0'), right: new Value(['1', '2']), expected: true },
        // Truthy - Bi-directional
        { left: new Value([1, 2]), right: new Value(0), expected: true },
        { left: new Value(['1', '2']), right: new Value('0'), expected: true },
        // Truthy - non-comparable types
        { left: new Value('0'), right: new Value([1, 2]), expected: true },
        { left: new Value(0), right: new Value(['1', '2']), expected: true },
        // Falsy - explicit
        { left: new Value(1), right: new Value([1, 2]), expected: false },
        { left: new Value('1'), right: new Value(['1', '2']), expected: false },
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new NotIn(test.left, test.right).evaluate({}))
          .toBe(test.expected)
      }

      let exceptions = [
        // None of array
        { left: new Value(1), right: new Value(1) },
        // Both of array
        { left: new Value([1]), right: new Value([1]) },
      ]

      for (const exception of exceptions) {
        // @ts-ignore
        expect(() => new NotIn(exception.left, exception.right).evaluate({}))
          .toThrowError()
      }
    })

    // Test reference types against reference types
    test('reference type', () => {
      let tests = [
        // Truthy
        { left: new Reference('RefA'), right: new Reference('RefB'), expected: true },
        { left: new Reference('RefC'), right: new Reference('RefD'), expected: true },
        // Truthy - non-comparable types
        { left: new Reference('RefA'), right: new Reference('RefD'), expected: true },
        { left: new Reference('RefC'), right: new Reference('RefB'), expected: true },
        { left: new Reference('RefA'), right: new Reference('RefG'), expected: true },
        // Falsy - explicit
        { left: new Reference('RefE'), right: new Reference('RefB'), expected: false },
        { left: new Reference('RefF'), right: new Reference('RefD'), expected: false },
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new NotIn(test.left, test.right).evaluate({
          RefA: 1,
          RefB: [0, 2],
          RefC: '1',
          RefD: ['0', '2'],
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
        expect(() => new NotIn(exception.left, exception.right).evaluate({
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
        { left: new Reference('RefA'), right: new Value([1]), expected: true },
        { left: new Reference('RefB'), right: new Value(['1']), expected: true },
        // Truthy - non-comparable types
        { left: new Reference('RefA'), right: new Value(['1']), expected: true },
        { left: new Reference('RefB'), right: new Value([1]), expected: true },
        { left: new Reference('RefC'), right: new Value([1]), expected: true },
        // Falsy - explicit
        { left: new Reference('RefA'), right: new Value([0]), expected: false },
        { left: new Reference('RefB'), right: new Value(['0']), expected: false },
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new NotIn(test.left, test.right).evaluate({
          RefA: 0,
          RefB: '0',
          // RefC = undefined
        }))
          .toBe(test.expected)
      }

      let exceptions = [
        // None of array
        { left: new Reference('RefA'), right: new Value(1) },
        // Both of array
        { left: new Reference('RefB'), right: new Value([1]) },
      ]

      for (const exception of exceptions) {
        // @ts-ignore
        expect(() => new NotIn(exception.left, exception.right).evaluate({
          RefA: 1,
          RefB: [1],
        }))
          .toThrowError()
      }
    })
  })

  test('toString', () => {
    let tests = [
      { left: new Value(0), right: new Value([1, 2]), expected: '(0 not in [1, 2])' },
      { left: new Value([1, 2]), right: new Value(0), expected: '(0 not in [1, 2])' },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(new NotIn(test.left, test.right).toString())
        .toBe(test.expected)
    }
  })
})