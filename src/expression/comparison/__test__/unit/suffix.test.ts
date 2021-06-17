import {
  identityEvaluable,
  undefinedOperand,
} from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { collection, reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { KIND, suffix } from '../../suffix'

describe('expression - comparison - suffix', () => {
  const testCases: [Evaluable, boolean][] = [
    // Truthy
    [suffix(value('abc'), value('c')), true],
    [suffix(value('a'), value('a')), true],
    // Falsy
    [suffix(value('abc'), value('a')), false],
    [suffix(value(''), value('a')), false],
    // Falsy - non-comparable types
    [suffix(value('a'), value(1)), false],
    [suffix(value('a'), value(true)), false],
    [suffix(value('a'), value(false)), false],
    [suffix(value('a'), value(null)), false],
    [suffix(value('a'), undefinedOperand()), false],
    [suffix(value('a'), collection([value(0)])), false],
    [suffix(value('a'), collection([value('0')])), false],
    [suffix(value(1), value('a')), false],
  ]

  describe('evaluate', () => {
    it.each(testCases)('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Evaluable, 'self' | boolean]>([
      [suffix(value(10), identityEvaluable()), 'self'],
      [suffix(identityEvaluable(), value(10)), 'self'],
      [suffix(identityEvaluable(), identityEvaluable()), 'self'],
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
        suffix(value('value'), reference('suffix')),
        ['KIND', 'value', '$suffix'],
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
      [suffix(value('value'), reference('suffix')), '("value"<{suffix}>)'],
    ])('%p should be %p', (evaluable, expected) => {
      expect(evaluable.toString()).toBe(expected)
    })
  })
})
