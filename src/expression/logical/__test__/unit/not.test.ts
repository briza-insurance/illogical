import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Evaluable } from '../../../../common/evaluable.js'
import { Operand } from '../../../../operand/index.js'
import { Reference } from '../../../../operand/reference.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { Not } from '../../not.js'

describe('Expression - Logical - Not', () => {
  describe('evaluate', () => {
    test.each([
      // Truthy
      [operand(false), true],
      // Falsy
      [operand(true), false],
    ] as [Evaluable, boolean][])(
      '%p should evaluate as %p',
      (operand, expected) => {
        expect(new Not(operand).evaluate({})).toBe(expected)
      }
    )

    test.each([[[]], [[operand(true), operand(false)]], [[operand(0)]]] as [
      Evaluable[],
    ][])('%p should throw', (operands) => {
      expect(() => new Not(...operands).evaluate({})).toThrowError()
    })
  })

  describe('simplify', () => {
    it.each<[Not, Evaluable | boolean]>([
      [new Not(notSimplified()), new Not(notSimplified())],
      [new Not(operand(false)), true],
      [new Not(operand(true)), false],
    ])('%p should simplify to %p', (and, expected) => {
      expect(and.simplify({}, new Set([]))).toEqual(expected)
    })
  })

  describe('serialize', () => {
    it.each<[Operand, [Input]]>([
      [new Reference('test'), ['$test']],
      [new Value(10), [10]],
    ])('%p should serialize to %p', (operands, expected) => {
      expect(new Not(operands).serialize(defaultOptions)).toEqual([
        'NOT',
        ...expected,
      ])
    })
  })
})
