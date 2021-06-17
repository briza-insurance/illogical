import {
  identityEvaluable,
  undefinedOperand,
} from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { collection, reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { gt, KIND } from '../../gt'

describe('expression - comparison - greater than', () => {
  const testCases: [Evaluable, boolean][] = [
    // Truthy
    [gt(value(1), value(0)), true],
    [gt(value(1.0), value(0.0)), true],
    // Falsy
    [gt(value(0), value(1)), false],
    [gt(value(0.0), value(1.0)), false],
    [gt(value(1), value(1)), false],
    [gt(value(1.0), value(1.0)), false],
    // Falsy - non-comparable types
    [gt(value(1), value('0')), false],
    [gt(value(1), value(true)), false],
    [gt(value(1), value(false)), false],
    [gt(value(1), value(null)), false],
    [gt(value(1), undefinedOperand()), false],
    [gt(value(1), collection([value(0)])), false],
    [gt(value(1), collection([value('0')])), false],
  ]

  describe('evaluate', () => {
    it.each(testCases)('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Evaluable, 'self' | boolean]>([
      [gt(value(10), identityEvaluable()), 'self'],
      [gt(identityEvaluable(), value(10)), 'self'],
      [gt(identityEvaluable(), identityEvaluable()), 'self'],
      ...testCases,
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(
        `${expected == 'self' ? evaluable : expected}`
      )
    })
  })

  describe('serialize', () => {
    it.each<[Evaluable, unknown[]]>([
      [gt(value(10), reference('ref')), ['>', 10, '$ref']],
    ])('%p should be serialized to %p', (evaluable, expected) => {
      expect(
        evaluable.serialize({
          reference: defaultReferenceSerializeOptions,
          operatorMapping: new Map([[KIND, '>']]),
        })
      ).toEqual(expected)
    })
  })

  describe('toString', () => {
    it.each([[gt(value(10), reference('ref')), '(10 > {ref})']])(
      '%p should be %p',
      (evaluable, expected) => {
        expect(evaluable.toString()).toBe(expected)
      }
    )
  })
})
