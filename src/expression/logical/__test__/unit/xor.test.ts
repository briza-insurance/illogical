import { identityEvaluable } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { Logical } from '../..'
import { nor, not } from '../..'
import { KIND, xor } from '../../xor'

describe('expression - logical - xor', () => {
  describe('constructor', () => {
    it.each<[Evaluable[]]>([[[]], [[value(1)]]])(
      '%p should throw',
      (operands) => {
        expect(() => xor(...operands)).toThrowError()
      }
    )
  })

  describe('evaluate', () => {
    it.each([
      [xor(value(true), value(false)), true],
      [xor(value(false), value(true)), true],
      [xor(value(false), value(true), value(true)), false],
      [xor(value(true), value(true)), false],
      [xor(value(false), value(false)), false],
    ])('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Logical, Evaluable | boolean]>([
      [xor(identityEvaluable(), value(false)), identityEvaluable()],
      [
        xor(identityEvaluable(), value(true), identityEvaluable()),
        nor(identityEvaluable(), identityEvaluable()),
      ],
      [
        xor(identityEvaluable(), value(true), value(false)),
        not(identityEvaluable()),
      ],
      [xor(value(false), value(true)), true],
      [xor(value(false), value(false)), false],
      [xor(value(true), value(true), value(true)), false],
      [xor(value(true), identityEvaluable(), value(true)), false],
      [
        xor(identityEvaluable(), value(false), identityEvaluable()),
        xor(identityEvaluable(), identityEvaluable()),
      ],
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(`${expected}`)
    })
  })

  describe('serialize', () => {
    it.each<[Logical, unknown[]]>([
      [xor(value(10), reference('test')), [10, '$test']],
    ])('%p should serialize to %p', (evaluable, expected) => {
      expect(
        evaluable.serialize({
          reference: defaultReferenceSerializeOptions,
          operatorMapping: new Map([[KIND, 'XOR']]),
        })
      ).toEqual(['XOR', ...expected])
    })
  })

  describe('toString', () => {
    it.each([
      [xor(value(10), reference('ref'), value(5)), '(10 XOR {ref} XOR 5)'],
    ])('%p should be %p', (evaluable, expected) => {
      expect(evaluable.toString()).toBe(expected)
    })
  })
})
