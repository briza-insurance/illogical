import { notSimplified, operand } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../common/evaluable'
import { Operand } from '../../../../operand'
import { Reference } from '../../../../operand/reference'
import { Value } from '../../../../operand/value'
import { Input } from '../../../../parser'
import { defaultOptions } from '../../../../parser/options'
import { Nor } from '../../nor'
import { Not } from '../../not'

describe('Expression - Logical - Nor', () => {
  describe('evaluate', () => {
    test.each([
      // Truthy
      [[operand(false), operand(false)], true],
      // Falsy
      [[operand(true), operand(false)], false],
      [[operand(false), operand(true)], false],
      [[operand(true), operand(true)], false],
    ] as [Evaluable[], boolean][])(
      '%p should evaluate as %p',
      (operands, expected) => {
        expect(new Nor(operands).evaluate({})).toBe(expected)
      }
    )

    test.each([[[]]] as [Evaluable[]][])('%p should throw', (operands) => {
      expect(() => new Nor(operands).evaluate({})).toThrowError()
    })
  })

  describe('simplify', () => {
    it.each<[Nor, Evaluable | boolean]>([
      [new Nor([notSimplified(), operand(false)]), new Not(notSimplified())],
      [new Nor([notSimplified(), operand(true), notSimplified()]), false],
      [new Nor([operand(false), operand(false)]), true],
      [
        new Nor([notSimplified(), operand(false), notSimplified()]),
        new Nor([notSimplified(), notSimplified()]),
      ],
    ])('%p should simplify to %p', (nor, expected) => {
      expect(nor.simplify({}, [])).toEqual(expected)
    })
  })

  describe('serialize', () => {
    it.each<[[Operand, Operand], [Input, Input]]>([
      [
        [new Value(10), new Reference('test')],
        [10, '$test'],
      ],
    ])('%p should serialize to %p', (operands, expected) => {
      expect(new Nor(operands).serialize(defaultOptions)).toEqual([
        'NOR',
        ...expected,
      ])
    })
  })
})
