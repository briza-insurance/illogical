import { identityEvaluable } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { Logical } from '../..'
import { not } from '../../'
import { KIND, nor } from '../../nor'

describe('expression - logical - nor', () => {
  describe('constructor', () => {
    it.each<[Evaluable[]]>([[[]], [[value(1)]]])(
      '%p should throw',
      (operands) => {
        expect(() => nor(...operands)).toThrowError()
      }
    )
  })

  describe('evaluate', () => {
    it.each([
      [nor(value(false), value(false)), true],
      [nor(value(true), value(false)), false],
      [nor(value(false), value(true)), false],
      [nor(value(true), value(true)), false],
    ])('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Logical, Evaluable | boolean]>([
      [nor(identityEvaluable(), value(false)), not(identityEvaluable())],
      [nor(identityEvaluable(), value(true), identityEvaluable()), false],
      [nor(value(false), value(false)), true],
      [
        nor(identityEvaluable(), value(false), identityEvaluable()),
        nor(identityEvaluable(), identityEvaluable()),
      ],
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(`${expected}`)
    })
  })

  describe('serialize', () => {
    it.each<[Logical, unknown[]]>([
      [nor(value(10), reference('test')), [10, '$test']],
    ])('%p should serialize to %p', (evaluable, expected) => {
      expect(
        evaluable.serialize({
          reference: defaultReferenceSerializeOptions,
          operatorMapping: new Map([[KIND, 'NOR']]),
        })
      ).toEqual(['NOR', ...expected])
    })
  })

  describe('toString', () => {
    it.each([
      [nor(value(10), reference('ref'), value(5)), '(10 NOR {ref} NOR 5)'],
    ])('%p should be %p', (evaluable, expected) => {
      expect(evaluable.toString()).toBe(expected)
    })
  })
})
