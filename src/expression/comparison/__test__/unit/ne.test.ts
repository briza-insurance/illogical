import {permutation} from '../../../../__test__/helpers'

import {Value} from '../../../../operand/value'
import {Reference} from '../../../../operand/reference'
import {NotEqual} from '../../ne'
import { Collection } from '../../../../operand/collection'

describe('Condition Engine - Expression - Comparison - Not Equal', () => {
  describe('constructor', () => {
    // @ts-ignore
    expect(() => new NotEqual())
      .toThrowError()
    // @ts-ignore
    expect(() => new NotEqual(5))
      .toThrowError()
    // @ts-ignore
    expect(() => new NotEqual(5, 5, 5))
      .toThrowError()
  })
  describe('evaluate', () => {

    // Test value types against value types
    test('value type', () => {
      let validTypes = [1, '1', true, false]
      let validTypePermutations = permutation(validTypes)

      let tests = []

      // Implicit Truthy cases
      // Different types - across all permutations
      for (const permutation of validTypePermutations) {
        tests.push(
          {
            left: new Value(permutation[0]),
            right: new Value(permutation[1]),
            expected: true
          }
        )
      }
      // Explicit falsy cases
      // type A != type A
      for (const type of validTypes) {
        tests.push(
          {
            left: new Value(type),
            right: new Value(type),
            expected: false
          }
        )
      }

      tests = [...tests,
        // Truthy
        {left: new Value(1), right: new Value(10), expected: true},
        {left: new Value('1'), right: new Value('10'), expected: true},
        {left: new Value(true), right: new Value(false), expected: true},
        // Array types, truthy in any case
        {left: new Collection([new Value(1)]), right: new Collection([new Value(1)]), expected: true},
        {left: new Collection([new Value('1')]), right: new Collection([new Value('1')]), expected: true},
        {left: new Value(1), right: new Collection([new Value(1)]), expected: true},
        {left: new Value('1'), right: new Collection([new Value('1')]), expected: true},
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new NotEqual(test.left, test.right).evaluate({}))
          .toBe(test.expected)
      }
    })

    // Test reference types against reference types
    test('reference type', () => {
      let tests = [
        // Truthy
        {left: new Reference('RefA'), right: new Reference('RefB'), expected: true},
        {left: new Reference('RefA'), right: new Reference('RefC'), expected: true},
        {left: new Reference('RefC'), right: new Reference('RefD'), expected: true},
        {left: new Reference('RefD'), right: new Reference('RefE'), expected: true},
        // Array types, truthy in any case
        {left: new Reference('RefF'), right: new Reference('RefA'), expected: true},
        {left: new Reference('RefG'), right: new Reference('RefB'), expected: true},
        // Falsy
        {left: new Reference('RefA'), right: new Reference('RefA'), expected: false},
        {left: new Reference('RefB'), right: new Reference('RefB'), expected: false},
        {left: new Reference('RefC'), right: new Reference('RefC'), expected: false},
        {left: new Reference('RefD'), right: new Reference('RefD'), expected: false},
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new NotEqual(test.left, test.right).evaluate({
          RefA: 1,
          RefB: '1',
          RefC: true,
          RefD: false,
          // RefE = undefined
          RefF: [1],
          RefG: ['1'],
        }))
          .toBe(test.expected)
      }
    })

    // Test reference types against value types
    test('reference/value type', () => {
      let tests = [
        // Truthy
        {left: new Reference('RefA'), right: new Value('10'), expected: true},
        {left: new Reference('RefB'), right: new Value(10), expected: true},
        {left: new Reference('RefC'), right: new Value(false), expected: true},
        {left: new Reference('RefE'), right: new Value(false), expected: true},
        // Array types, truthy in any case
        {left: new Reference('RefF'), right: new Value(1), expected: true},
        {left: new Reference('RefG'), right: new Value('1'), expected: true},
        // Falsy
        {left: new Reference('RefA'), right: new Value(1), expected: false},
        {left: new Reference('RefB'), right: new Value('1'), expected: false},
        {left: new Reference('RefC'), right: new Value(true), expected: false},
        {left: new Reference('RefD'), right: new Value(false), expected: false},
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new NotEqual(test.left, test.right).evaluate({
          RefA: 1,
          RefB: '1',
          RefC: true,
          RefD: false,
          // RefE = undefined
          RefF: [1],
          RefG: ['1'],
        }))
          .toBe(test.expected)
      }
    })
  })
})
