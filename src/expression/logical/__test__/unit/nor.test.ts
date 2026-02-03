import { notSimplified, operand } from '../../../../__test__/helpers.js'
import { Evaluable } from '../../../../common/evaluable.js'
import { Operand } from '../../../../operand/index.js'
import { Reference } from '../../../../operand/reference.js'
import { Value } from '../../../../operand/value.js'
import { Input } from '../../../../parser/index.js'
import { defaultOptions } from '../../../../parser/options.js'
import { And } from '../../and.js'
import { Nor } from '../../nor.js'
import { Not } from '../../not.js'

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
      [
        new Nor([operand(false), new Nor([operand(false), notSimplified()])]),
        new Not(new Not(notSimplified())),
      ],
      [
        new Nor([operand(false), new And([operand(true), notSimplified()])]),
        new Not(notSimplified()),
      ],
    ])('%p should simplify to %p', (nor, expected) => {
      expect(nor.simplify({}, new Set([]))).toEqual(expected)
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
