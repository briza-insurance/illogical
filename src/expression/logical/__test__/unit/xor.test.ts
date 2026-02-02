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
import { Xor } from '../../xor.js'

describe('Expression - Logical - Xor', () => {
  describe('evaluate', () => {
    test.each([
      // Truthy
      [[operand(true), operand(false)], true],
      [[operand(false), operand(true)], true],
      // Falsy
      [[operand(true), operand(true)], false],
      [[operand(false), operand(false)], false],
    ] as [Evaluable[], boolean][])(
      '%p should evaluate as %p',
      (operands, expected) => {
        expect(new Xor(operands).evaluate({})).toBe(expected)
      }
    )

    test.each([[[]]] as [Evaluable[]][])('%p should throw', (operands) => {
      expect(() => new Xor(operands).evaluate({})).toThrowError()
    })
  })

  describe('simplify', () => {
    it.each<[Xor, Evaluable | boolean]>([
      [new Xor([notSimplified(), operand(false)]), notSimplified()],
      [
        new Xor([notSimplified(), operand(true), notSimplified()]),
        new Nor([notSimplified(), notSimplified()]),
      ],
      [
        new Xor([notSimplified(), operand(true), operand(false)]),
        new Not(notSimplified()),
      ],
      [new Xor([operand(false), operand(true)]), true],
      [new Xor([operand(false), operand(false)]), false],
      [new Xor([operand(true), operand(true), operand(true)]), false],
      [new Xor([operand(true), notSimplified(), operand(true)]), false],
      [
        new Xor([notSimplified(), operand(false), notSimplified()]),
        new Xor([notSimplified(), notSimplified()]),
      ],
      [
        new Xor([
          new And([notSimplified(), operand(true)]),
          operand(true),
          operand(false),
        ]),
        new Not(notSimplified()),
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
      expect(new Xor(operands).serialize(defaultOptions)).toEqual([
        'XOR',
        ...expected,
      ])
    })
  })
})
