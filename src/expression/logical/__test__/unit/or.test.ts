import { identityEvaluable } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { Logical } from '../..'
import { KIND, or } from '../../or'

describe('expression - logical - or', () => {
  describe('constructor', () => {
    it.each<[Evaluable[]]>([[[]], [[value(1)]]])(
      '%p should throw',
      (operands) => {
        expect(() => or(...operands)).toThrowError()
      }
    )
  })

  describe('evaluate', () => {
    it.each([
      [or(value(true), value(false)), true],
      [or(value(false), value(true)), true],
      [or(value(true), value(true)), true],
      [or(value(false), value(false)), false],
    ])('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Logical, Evaluable | boolean]>([
      [or(identityEvaluable(), value(false)), identityEvaluable()],
      [or(identityEvaluable(), value(true), identityEvaluable()), true],
      [or(value(false), value(true)), true],
      [or(value(false), value(false)), false],
      [
        or(identityEvaluable(), value(false), identityEvaluable()),
        or(identityEvaluable(), identityEvaluable()),
      ],
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(`${expected}`)
    })
  })

  describe('serialize', () => {
    it.each<[Logical, unknown[]]>([
      [or(value(10), reference('test')), [10, '$test']],
    ])('%p should serialize to %p', (evaluable, expected) => {
      expect(
        evaluable.serialize({
          reference: defaultReferenceSerializeOptions,
          operatorMapping: new Map([[KIND, 'OR']]),
        })
      ).toEqual(['OR', ...expected])
    })
  })

  describe('toString', () => {
    it.each([
      [or(value(10), reference('ref'), value(5)), '(10 OR {ref} OR 5)'],
    ])('%p should be %p', (evaluable, expected) => {
      expect(evaluable.toString()).toBe(expected)
    })
  })
})
