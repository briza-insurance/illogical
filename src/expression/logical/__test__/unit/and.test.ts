import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Evaluable } from '../../../../common/evaluable.js'
import { Operand } from '../../../../operand/index.js'
import { Reference } from '../../../../operand/reference.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { And } from '../../and.js'

describe('Expression - Logical - And', () => {
  describe('evaluate', () => {
    test.each([
      // Truthy
      [[operand(true), operand(true)], true],
      // Falsy
      [[operand(true), operand(false)], false],
      [[operand(false), operand(true)], false],
      [[operand(false), operand(false)], false],
    ] as [Evaluable[], boolean][])(
      '%p should evaluate as %p',
      (operands, expected) => {
        expect(new And(operands).evaluate({})).toBe(expected)
      }
    )

    test.each([[[]]] as [Evaluable[]][])('%p should throw', (operands) => {
      expect(() => new And(operands).evaluate({})).toThrowError()
    })
  })

  describe('simplify', () => {
    it.each<[And, Evaluable | boolean]>([
      [new And([notSimplified(), operand(true)]), notSimplified()],
      [new And([notSimplified(), operand(false), notSimplified()]), false],
      [new And([operand(true), operand(true)]), true],
      [
        new And([notSimplified(), operand(true), notSimplified()]),
        new And([notSimplified(), notSimplified()]),
      ],
      [
        new And([operand(true), new And([operand(true), notSimplified()])]),
        notSimplified(),
      ],
    ])('%p should simplify to %p', (and, expected) => {
      expect(and.simplify({}, new Set([]))).toEqual(expected)
    })
  })

  describe('serialize', () => {
    it.each<[[Operand, Operand], [Input, Input]]>([
      [
        [new Value(10), new Reference('test')],
        [10, '$test'],
      ],
    ])('%p should serialize to %p', (operands, expected) => {
      expect(new And(operands).serialize(defaultOptions)).toEqual([
        'AND',
        ...expected,
      ])
    })
  })
})
