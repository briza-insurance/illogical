import { identityEvaluable } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { collection, reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { KIND, notIn } from '../../not-in'

describe('expression - comparison - not in', () => {
  describe('constructor', () => {
    it.each([
      // Missing haystack
      [value(1), value(1)],
      // Double haystack
      [collection([value(1)]), collection([value(1)])],
    ])('%p and %p should throw', (left, right) => {
      expect(() => notIn(left, right).evaluate({})).toThrowError()
    })
  })

  const testCases: [Evaluable, boolean][] = [
    // Truthy
    [notIn(value(0), collection([value(1), value(2)])), true],
    [notIn(value('0'), collection([value('1'), value('2')])), true],
    [notIn(value(true), collection([value(false), value(false)])), true],
    // Truthy - Bi-directional
    [notIn(collection([value(1), value(2)]), value(0)), true],
    [notIn(collection([value('1'), value('2')]), value('0')), true],
    [notIn(collection([value(false), value(false)]), value(true)), true],
    // Truthy - non-comparable types
    [notIn(value('0'), collection([value(0), value(1)])), true],
    [notIn(value(0), collection([value('0'), value('1')])), true],
    // Falsy
    [notIn(value(1), collection([value(1), value(2)])), false],
    [notIn(value('1'), collection([value('1'), value('2')])), false],
    [notIn(value(false), collection([value(false), value(false)])), false],
  ]

  describe('evaluate', () => {
    it.each(testCases)('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Evaluable, 'self' | boolean]>([
      [notIn(value(10), collection([identityEvaluable()])), 'self'],
      [notIn(collection([identityEvaluable()]), value(10)), 'self'],
      [notIn(identityEvaluable(), collection([identityEvaluable()])), 'self'],
      ...testCases,
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(
        `${expected == 'self' ? evaluable : expected}`
      )
    })
  })

  describe('serialize', () => {
    it.each<[Evaluable, unknown[]]>([
      [
        notIn(value(10), collection([reference('ref')])),
        ['KIND', 10, ['$ref']],
      ],
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
      [notIn(value(10), collection([reference('ref')])), '(10 not in [{ref}])'],
      [notIn(collection([reference('ref')]), value(10)), '(10 not in [{ref}])'],
    ])('%p should be %p', (evaluable, expected) => {
      expect(evaluable.toString()).toBe(expected)
    })
  })
})
