import { Value } from '../../../../operand/value'
import { Reference } from '../../../../operand/reference'
import { LessThanOrEqual } from '../../le'
import { Collection } from '../../../../operand/collection'

describe('Condition Engine - Expression - Comparison - Less Than or Equal', () => {
  describe('constructor', () => {
    // @ts-ignore
    expect(() => new LessThanOrEqual())
      .toThrowError()
    // @ts-ignore
    expect(() => new LessThanOrEqual(5))
      .toThrowError()
    // @ts-ignore
    expect(() => new LessThanOrEqual(5, 5, 5))
      .toThrowError()
  })
  describe('evaluate', () => {

    // Test value types against value types
    test('value type', () => {
      let tests = [
        // Truthy
        { left: new Value(0), right: new Value(1), expected: true },
        { left: new Value(1), right: new Value(1), expected: true },
        // Falsy - explicit
        { left: new Value(1), right: new Value(0), expected: false },
        // Falsy - non-comparable types
        { left: new Value(0), right: new Value('1'), expected: false },
        { left: new Value(0), right: new Value(true), expected: false },
        { left: new Value(0), right: new Value(false), expected: false },
        { left: new Value(0), right: new Collection([new Value(1)]), expected: false },
        { left: new Value(0), right: new Collection([new Value('1')]), expected: false },
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new LessThanOrEqual(test.left, test.right).evaluate({}))
          .toBe(test.expected)
      }
    })

    // Test reference types against reference types
    test('reference type', () => {
      let tests = [
        // Truthy
        { left: new Reference('RefA'), right: new Reference('RefB'), expected: true },
        { left: new Reference('RefA'), right: new Reference('RefA'), expected: true },
        // Falsy - explicit
        { left: new Reference('RefB'), right: new Reference('RefA'), expected: false },
        // Falsy - non-comparable types
        { left: new Reference('RefA'), right: new Reference('RefC'), expected: false },
        { left: new Reference('RefA'), right: new Reference('RefD'), expected: false },
        { left: new Reference('RefA'), right: new Reference('RefE'), expected: false },
        { left: new Reference('RefA'), right: new Reference('RefF'), expected: false },
        { left: new Reference('RefA'), right: new Reference('RefG'), expected: false },
        { left: new Reference('RefA'), right: new Reference('RefH'), expected: false },
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new LessThanOrEqual(test.left, test.right).evaluate({
          RefA: 0,
          RefB: 1,
          RefC: '1',
          RefD: true,
          RefE: false,
          // RefF = undefined
          RefG: [1],
          RefH: ['1'],
        }))
          .toBe(test.expected)
      }
    })

    // Test reference types against value types
    test('reference/value type', () => {
      let tests = [
        // Truthy
        { left: new Reference('RefA'), right: new Value(1), expected: true },
        { left: new Reference('RefA'), right: new Value(1), expected: true },
        // Falsy - explicit
        { left: new Reference('RefB'), right: new Value(0), expected: false },
        // Falsy - non-comparable types
        { left: new Reference('RefA'), right: new Value('1'), expected: false },
        { left: new Reference('RefA'), right: new Value(true), expected: false },
        { left: new Reference('RefA'), right: new Value(false), expected: false },
        { left: new Reference('RefC'), right: new Value(1), expected: false },
        { left: new Reference('RefA'), right: new Collection([new Value(1)]), expected: false },
        { left: new Reference('RefA'), right: new Collection([new Value('1')]), expected: false },
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new LessThanOrEqual(test.left, test.right).evaluate({
          RefA: 0,
          RefB: 1,
          // RefC = undefined
        }))
          .toBe(test.expected)
      }
    })
  })
})
