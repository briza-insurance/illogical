import {
  identityEvaluable,
  undefinedOperand,
} from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { collection, reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { KIND, lt } from '../../lt'

describe('expression - comparison - less than', () => {
  const testCases: [Evaluable, boolean][] = [
    // Truthy
    [lt(value(0), value(1)), true],
    [lt(value(0.0), value(1.0)), true],
    // Falsy
    [lt(value(1), value(1)), false],
    [lt(value(1), value(0)), false],
    [lt(value(1.0), value(1.0)), false],
    [lt(value(1.0), value(0.0)), false],
    // Falsy - non-comparable types
    [lt(value(0), value('1')), false],
    [lt(value(0), value(true)), false],
    [lt(value(0), value(false)), false],
    [lt(value(0), value(null)), false],
    [lt(value(0), undefinedOperand()), false],
    [lt(value(0), collection([value(0)])), false],
    [lt(value(0), collection([value('0')])), false],
  ]

  describe('evaluate', () => {
    it.each(testCases)('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Evaluable, 'self' | boolean]>([
      [lt(value(10), identityEvaluable()), 'self'],
      [lt(identityEvaluable(), value(10)), 'self'],
      [lt(identityEvaluable(), identityEvaluable()), 'self'],
      ...testCases,
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(
        `${expected == 'self' ? evaluable : expected}`
      )
    })
  })

  describe('serialize', () => {
    it.each<[Evaluable, unknown[]]>([
      [lt(value(10), reference('ref')), ['KIND', 10, '$ref']],
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
    it.each([[lt(value(10), reference('ref')), '(10 < {ref})']])(
      '%p should be %p',
      (evaluable, expected) => {
        expect(evaluable.toString()).toBe(expected)
      }
    )
  })
})
