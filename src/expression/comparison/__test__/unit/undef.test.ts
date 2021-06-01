import {
  identityEvaluable,
  undefinedOperand,
} from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { collection, reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { KIND, undef } from '../../undef'

describe('expression - comparison - undefined', () => {
  const testCases: [Evaluable, boolean][] = [
    // Truthy
    [undef(undefinedOperand()), true],
    // Falsy
    [undef(value(1)), false],
    [undef(value('1')), false],
    [undef(value(true)), false],
    [undef(value(false)), false],
    [undef(value(null)), false],
    [undef(collection([value(1)])), false],
    [undef(collection([value('1')])), false],
  ]

  describe('evaluate', () => {
    it.each(testCases)('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Evaluable, 'self' | boolean]>([
      [undef(identityEvaluable()), 'self'],
      ...testCases,
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(
        `${expected == 'self' ? evaluable : expected}`
      )
    })
  })

  describe('serialize', () => {
    it.each<[Evaluable, unknown[]]>([
      [undef(reference('ref')), ['KIND', '$ref']],
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
    it.each([[undef(reference('ref')), '({ref} is undefined)']])(
      '%p should be %p',
      (evaluable, expected) => {
        expect(evaluable.toString()).toBe(expected)
      }
    )
  })
})
