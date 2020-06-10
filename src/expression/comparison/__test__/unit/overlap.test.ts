import { Value } from '../../../../operand/value'
import { Reference } from '../../../../operand/reference'
import { Overlap } from '../../overlap'

describe('Condition Engine - Expression - Comparison - Overlap', () => {
  describe('constructor', () => {
    // @ts-ignore
    expect(() => new Overlap())
      .toThrowError()
    // @ts-ignore
    expect(() => new Overlap(5))
      .toThrowError()
    // @ts-ignore
    expect(() => new Overlap(5, 5, 5))
      .toThrowError()
  })
  describe('evaluate', () => {

    // Test value types against value types
    test('value type', () => {
      let tests = [
        // Truthy
        { left: new Value([1]), right: new Value([1, 2]), expected: true },
        { left: new Value([1, 2]), right: new Value([1, 2]), expected: true },
        { left: new Value(['1', '3']), right: new Value(['1', '2']), expected: true },
        // Truthy - Bi-directional
        { left: new Value([1, 2, 5]), right: new Value([1, 3]), expected: true },
        // Falsy - explicit
        { left: new Value([0]), right: new Value([1, 2]), expected: false },
        { left: new Value(['0']), right: new Value(['1', '2']), expected: false },
        // Falsy - non-comparable types
        { left: new Value(['1']), right: new Value([1, 2]), expected: false },
        { left: new Value([1]), right: new Value(['1', '2']), expected: false },
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new Overlap(test.left, test.right).evaluate({}))
          .toBe(test.expected)
      }

      let exceptions = [
        { left: new Value(1), right: new Value(1) },
        { left: new Value([1]), right: new Value(1) },
      ]

      for (const exception of exceptions) {
        // @ts-ignore
        expect(() => new Overlap(exception.left, exception.right).evaluate({}))
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
        expect(new Overlap(test.left, test.right).evaluate({
          RefA: [1, 3],
          RefB: [1, 2, 5],
          RefC: ['1'],
          RefD: ['1', '2'],
          RefE: [0],
          RefF: ['0'],
          // RefG = undefined
        }))
          .toBe(test.expected)
      }

      let exceptions = [
        { left: new Reference('RefA'), right: new Reference('RefA') },
        { left: new Reference('RefA'), right: new Reference('RefB') },
      ]

      for (const exception of exceptions) {
        // @ts-ignore
        expect(() => new Overlap(exception.left, exception.right).evaluate({
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
        // Falsy - explicit
        { left: new Reference('RefA'), right: new Value([0]), expected: false },
        { left: new Reference('RefB'), right: new Value(['0']), expected: false },
        // Falsy - non-comparable types
        { left: new Reference('RefA'), right: new Value(['1']), expected: false },
        { left: new Reference('RefB'), right: new Value([1]), expected: false },
        { left: new Reference('RefC'), right: new Value([1]), expected: false },
      ]

      for (const test of tests) {
        // @ts-ignore
        expect(new Overlap(test.left, test.right).evaluate({
          RefA: [1],
          RefB: ['1'],
          // RefC = undefined
        }))
          .toBe(test.expected)
      }

      let exceptions = [
        { left: new Reference('RefA'), right: new Value(1) },
        { left: new Reference('RefB'), right: new Value([1]) },
      ]

      for (const exception of exceptions) {
        // @ts-ignore
        expect(() => new Overlap(exception.left, exception.right).evaluate({
          RefA: [1],
          RefB: 1,
        }))
          .toThrowError()
      }
    })
  })

  test('toString', () => {
    let tests = [
      { left: new Value([0]), right: new Value([1, 2]), expected: '([0] overlap [1, 2])' },
      { left: new Value([1, 2]), right: new Value([0]), expected: '([1, 2] overlap [0])' },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(new Overlap(test.left, test.right).toString())
        .toBe(test.expected)
    }
  })
})