import { identityEvaluable } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { Logical } from '../..'
import { and, KIND } from '../../and'

describe('expression - logical - and', () => {
  describe('constructor', () => {
    it.each<[Evaluable[]]>([[[]], [[value(1)]]])(
      '%p should throw',
      (operands) => {
        expect(() => and(...operands)).toThrowError()
      }
    )
  })

  describe('evaluate', () => {
    it.each([
      [and(value(true), value(true)), true],
      [and(value(true), value(false)), false],
      [and(value(false), value(true)), false],
      [and(value(false), value(false)), false],
    ])('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Logical, Evaluable | boolean]>([
      [and(identityEvaluable(), value(true)), identityEvaluable()],
      [and(identityEvaluable(), value(false), identityEvaluable()), false],
      [and(value(true), value(true)), true],
      [
        and(identityEvaluable(), value(true), identityEvaluable()),
        and(identityEvaluable(), identityEvaluable()),
      ],
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(`${expected}`)
    })
  })

  describe('serialize', () => {
    it.each<[Logical, unknown[]]>([
      [and(value(10), reference('test')), ['AND', 10, '$test']],
    ])('%p should serialize to %p', (evaluable, expected) => {
      expect(
        evaluable.serialize({
          reference: defaultReferenceSerializeOptions,
          operatorMapping: new Map([[KIND, 'AND']]),
        })
      ).toEqual(expected)
    })
  })

  describe('toString', () => {
    it.each([
      [and(value(10), reference('ref'), value(5)), '(10 AND {ref} AND 5)'],
    ])('%p should be %p', (evaluable, expected) => {
      expect(evaluable.toString()).toBe(expected)
    })
  })
})
