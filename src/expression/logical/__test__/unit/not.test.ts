import { identityEvaluable } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { Logical } from '../..'
import { KIND, not } from '../../not'

describe('expression - logical - not', () => {
  describe('evaluate', () => {
    it.each([
      [not(value(false)), true],
      [not(value(true)), false],
    ])('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })

    expect(() => not(value(1)).evaluate({})).toThrowError()
  })

  describe('simplify', () => {
    it.each<[Logical, Evaluable | boolean]>([
      [not(identityEvaluable()), not(identityEvaluable())],
      [not(value(false)), true],
      [not(value(true)), false],
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(`${expected}`)
    })

    expect(() => not(value(1)).simplify({})).toThrowError()
  })

  describe('serialize', () => {
    it.each<[Logical, unknown]>([
      [not(reference('test')), '$test'],
      [not(value(10)), 10],
    ])('%p should serialize to %p', (evaluable, expected) => {
      expect(
        evaluable.serialize({
          reference: defaultReferenceSerializeOptions,
          operatorMapping: new Map([[KIND, 'NOT']]),
        })
      ).toEqual(['NOT', expected])
    })
  })

  describe('toString', () => {
    it.each([[not(reference('ref')), '(NOT {ref})']])(
      '%p should be %p',
      (evaluable, expected) => {
        expect(evaluable.toString()).toBe(expected)
      }
    )
  })
})
