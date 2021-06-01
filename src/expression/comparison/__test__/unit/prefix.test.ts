import {
  identityEvaluable,
  undefinedOperand,
} from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { collection, reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { KIND, prefix } from '../../prefix'

describe('expression - comparison - prefix', () => {
  const testCases: [Evaluable, boolean][] = [
    // Truthy
    [prefix(value('a'), value('abc')), true],
    [prefix(value('a'), value('a')), true],
    // Falsy
    [prefix(value('b'), value('abc')), false],
    [prefix(value('b'), value('')), false],
    // Falsy - non-comparable types
    [prefix(value('a'), value(1)), false],
    [prefix(value('a'), value(true)), false],
    [prefix(value('a'), value(false)), false],
    [prefix(value('a'), value(null)), false],
    [prefix(value('a'), undefinedOperand()), false],
    [prefix(value('a'), collection([value(0)])), false],
    [prefix(value('a'), collection([value('0')])), false],
    [prefix(value(1), value('a')), false],
  ]

  describe('evaluate', () => {
    it.each(testCases)('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Evaluable, 'self' | boolean]>([
      [prefix(value(10), identityEvaluable()), 'self'],
      [prefix(identityEvaluable(), value(10)), 'self'],
      [prefix(identityEvaluable(), identityEvaluable()), 'self'],
      ...testCases,
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(
        `${expected == 'self' ? evaluable : expected}`
      )
    })
  })

  describe('serialize', () => {
    it.each<[Evaluable, unknown[]]>([
      [prefix(value('prefix'), reference('ref')), ['KIND', 'prefix', '$ref']],
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
    it.each([[prefix(value('prefix'), reference('ref')), '(<"prefix">{ref})']])(
      '%p should be %p',
      (evaluable, expected) => {
        expect(evaluable.toString()).toBe(expected)
      }
    )
  })
})
