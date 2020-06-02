import { Value } from '../../../../operand/value'
import { Reference } from '../../../../operand/reference'
import { Undefined } from '../../../predicate/undefined'

describe('Condition Engine - Expression - Predicate - Undefined', () => {
  describe('constructor', () => {
    // @ts-ignore
    expect(() => new Undefined())
      .toThrowError()
    // @ts-ignore
    expect(() => new Undefined(5, 5))
      .toThrowError()
  })
  describe('evaluate', () => {

    // Test value types against value types
    test('value type', () => {
      // As value cannot be undefined, all tests should be falsy.
      let tests = [
        // Falsy
        { operand: new Value(1), expected: false },
        { operand: new Value('1'), expected: false },
        { operand: new Value(true), expected: false },
        { operand: new Value([1]), expected: false },
        { operand: new Value(['1']), right:undefined, expected: false },
        { operand: new Value(true), expected: false },
        { operand: new Value(false), expected: false }
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new Undefined(test.operand).evaluate({}))
          .toBe(test.expected)
      }
    })

    // Test reference types against reference types
    test('reference type', () => {
      let tests = [
        // Falsy
        { operand: new Reference('RefA'), expected: false },
        { operand: new Reference('RefB'), expected: false },
        { operand: new Reference('RefC'), expected: false },
        { operand: new Reference('RefD'), expected: false },
        { operand: new Reference('RefF'), expected: false },
        { operand: new Reference('RefG'), expected: false },
        // Truthy
        { operand: new Reference('RefE'), expected: true },
        { operand: new Reference('RefH'), expected: true }
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new Undefined(test.operand).evaluate({
          RefA: 1,
          RefB: '1',
          RefC: true,
          RefD: false,
          // RefE = undefined
          RefF: [1],
          RefG: ['1'],
          RefH: undefined
        }))
          .toBe(test.expected)
      }
    })
  })
})