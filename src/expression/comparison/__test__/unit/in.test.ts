import { identityEvaluable } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { collection, reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { In, KIND } from '../../in'

describe('expression - comparison - in', () => {
  describe('constructor', () => {
    it.each([
      // Missing haystack
      [value(1), value(1)],
      // Double haystack
      [collection([value(1)]), collection([value(1)])],
    ])('%p and %p should throw', (left, right) => {
      expect(() => In(left, right).evaluate({})).toThrowError()
    })
  })

  const testCases: [Evaluable, boolean][] = [
    // Truthy
    [In(value(1), collection([value(1), value(2)])), true],
    [In(value('1'), collection([value('1'), value('2')])), true],
    [In(value(true), collection([value(true), value(false)])), true],
    // Truthy - Bi-directional
    [In(collection([value(1), value(2)]), value(1)), true],
    [In(collection([value('1'), value('2')]), value('1')), true],
    [In(collection([value(true), value(false)]), value(true)), true],
    // Falsy
    [In(value(0), collection([value(1), value(2)])), false],
    [In(value('0'), collection([value('1'), value('2')])), false],
    [In(value(true), collection([value(false), value(false)])), false],
    // Falsy - non-comparable types
    [In(value('0'), collection([value(0), value(1)])), false],
    [In(value(0), collection([value('0'), value('1')])), false],
  ]

  describe('evaluate', () => {
    it.each(testCases)('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Evaluable, 'self' | boolean]>([
      [In(value(10), collection([identityEvaluable()])), 'self'],
      [In(collection([identityEvaluable()]), value(10)), 'self'],
      [In(identityEvaluable(), collection([identityEvaluable()])), 'self'],
      ...testCases,
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(
        `${expected == 'self' ? evaluable : expected}`
      )
    })
  })

  describe('serialize', () => {
    it.each<[Evaluable, unknown[]]>([
      [In(value(10), collection([reference('ref')])), ['KIND', 10, ['$ref']]],
    ])('%p should be serialized to %p', (evaluable, expected) => {
      expect(
        evaluable.serialize({
          reference: defaultReferenceSerializeOptions,
          operatorMapping: new Map([[KIND, 'KIND']]),
        })
      ).toEqual(expected)
    })
  })

  describe('toString', () => {
    it.each([
      [In(value(10), collection([reference('ref')])), '(10 in [{ref}])'],
      [In(collection([reference('ref')]), value(10)), '(10 in [{ref}])'],
    ])('%p should be %p', (evaluable, expected) => {
      expect(evaluable.toString()).toBe(expected)
    })
  })
})
