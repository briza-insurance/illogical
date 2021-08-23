import { notSimplified, operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'
import { Operand } from '../../../../operand'
import { Reference } from '../../../../operand/reference'
import { Value } from '../../../../operand/value'
import { Input } from '../../../../parser'
import { defaultOptions } from '../../../../parser/options'
import { Or } from '../../or'

describe('Expression - Logical - Or', () => {
  describe('evaluate', () => {
    test.each([
      // Truthy
      [[operand(true), operand(false)], true],
      [[operand(false), operand(true)], true],
      [[operand(true), operand(true)], true],
      // Falsy
      [[operand(false), operand(false)], false],
    ] as [Evaluable[], boolean][])(
      '%p should evaluate as %p',
      (operands, expected) => {
        expect(new Or(operands).evaluate({})).toBe(expected)
      }
    )

    test.each([[[]]] as [Evaluable[]][])('%p should throw', (operands) => {
      expect(() => new Or(operands).evaluate({})).toThrowError()
    })
  })

  describe('simplify', () => {
    it.each<[Or, Evaluable | boolean]>([
      [new Or([notSimplified(), operand(false)]), notSimplified()],
      [new Or([notSimplified(), operand(true), notSimplified()]), true],
      [new Or([operand(false), operand(true)]), true],
      [new Or([operand(false), operand(false)]), false],
      [
        new Or([notSimplified(), operand(false), notSimplified()]),
        new Or([notSimplified(), notSimplified()]),
      ],
      [
        new Or([operand(false), new Or([operand(false), notSimplified()])]),
        notSimplified(),
      ],
    ])('%p should simplify to %p', (and, expected) => {
      expect(and.simplify({}, [])).toEqual(expected)
    })
  })

  describe('serialize', () => {
    it.each<[[Operand, Operand], [Input, Input]]>([
      [
        [new Value(10), new Reference('test')],
        [10, '$test'],
      ],
    ])('%p should serialize to %p', (operands, expected) => {
      expect(new Or(operands).serialize(defaultOptions)).toEqual([
        'OR',
        ...expected,
      ])
    })
  })
})
