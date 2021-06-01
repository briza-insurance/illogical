import { Evaluable } from '../../../evaluable'
import {
  eq,
  ge,
  gt,
  In,
  KIND_EQ,
  KIND_GE,
  KIND_GT,
  KIND_IN,
  KIND_LE,
  KIND_LT,
  KIND_NE,
  KIND_NOT_IN,
  KIND_OVERLAP,
  KIND_PREFIX,
  KIND_PRESENT,
  KIND_SUFFIX,
  KIND_UNDEF,
  le,
  lt,
  ne,
  notIn,
  overlap,
  prefix,
  present,
  suffix,
  undef,
} from '../../../expression/comparison'
import {
  and,
  KIND_AND,
  KIND_NOR,
  KIND_NOT,
  KIND_OR,
  KIND_XOR,
  nor,
  not,
  or,
  xor,
} from '../../../expression/logical'
import { collection, reference, value } from '../../../operand'
import { defaultEscapeCharacter } from '../../../operand/collection'
import { defaultReferenceSerializeOptions } from '../../../operand/reference'
import { defaultOperatorMapping, defaultOptions } from '../../../options'
import { parser as createParser } from '../../'
import { isEscaped, toReferencePath } from '../../parser'

describe('Condition Engine - Parser', () => {
  describe('parse', () => {
    const parser = createParser(defaultOptions)
    const asReference = (path: string) =>
      defaultReferenceSerializeOptions.to(path)

    describe('toReferencePath', () => {
      const options = {
        from: (value: unknown) =>
          value === 'expected' ? 'expected' : undefined,
        to: () => '',
      }
      it.each([
        ['expected', 'expected'],
        ['unexpected', undefined],
        [1, undefined],
      ])('%p should be resolved as %p', (value, expected) => {
        expect(toReferencePath(options)(value)).toBe(expected)
      })
    })

    describe('isEscaped', () => {
      it.each([
        ['\\expected', '\\', true],
        ['unexpected', '\\', false],
        ['\\expected', undefined, false],
        [1, '\\', false],
      ])(
        '%p with %p escape character should be evaluated as %p',
        (value, escapeCharacter, expected) => {
          expect(isEscaped(escapeCharacter)(value)).toBe(expected)
        }
      )
    })

    describe('value', () => {
      it.each<[unknown, Evaluable]>([
        [1, value(1)],
        [true, value(true)],
        ['value', value('value')],
        [null, value(null)],
      ])('%p should be parsed as %p', (expression, expected) => {
        expect(parser.parse(expression).toString()).toBe(expected.toString())
      })
    })

    describe('reference', () => {
      it.each<[unknown, Evaluable]>([[asReference('path'), reference('path')]])(
        '%p should be parsed as %p',
        (expression, expected) => {
          expect(parser.parse(expression).toString()).toBe(expected.toString())
        }
      )
    })

    describe('collection', () => {
      it.each<[unknown, Evaluable]>([
        [[1], collection([value(1)])],
        [['value'], collection([value('value')])],
        [[true], collection([value(true)])],
        [[null], collection([value(null)])],
        [[asReference('path')], collection([reference('path')])],
        [
          [1, 'value', true, null, asReference('path')],
          collection([
            value(1),
            value('value'),
            value(true),
            value(null),
            reference('path'),
          ]),
        ],
        // Escaped
        [
          [
            `${defaultEscapeCharacter}${defaultOperatorMapping.get(KIND_EQ)}`,
            1,
            1,
          ],
          collection([
            value(`${defaultOperatorMapping.get(KIND_EQ)}`),
            value(1),
            value(1),
          ]),
        ],
      ])('%p should be parsed as %p', (expression, expected) => {
        expect(parser.parse(expression).toString()).toBe(expected.toString())
      })
    })

    describe('comparison', () => {
      it.each<[unknown, Evaluable]>([
        [[defaultOperatorMapping.get(KIND_EQ), 1, 1], eq(value(1), value(1))],
        [[defaultOperatorMapping.get(KIND_NE), 1, 1], ne(value(1), value(1))],
        [[defaultOperatorMapping.get(KIND_GE), 1, 1], ge(value(1), value(1))],
        [[defaultOperatorMapping.get(KIND_GT), 1, 1], gt(value(1), value(1))],
        [[defaultOperatorMapping.get(KIND_LE), 1, 1], le(value(1), value(1))],
        [[defaultOperatorMapping.get(KIND_LT), 1, 1], lt(value(1), value(1))],
        [
          [defaultOperatorMapping.get(KIND_IN), 1, [1]],
          In(value(1), collection([value(1)])),
        ],
        [
          [defaultOperatorMapping.get(KIND_NOT_IN), 1, [1]],
          notIn(value(1), collection([value(1)])),
        ],
        [
          [defaultOperatorMapping.get(KIND_OVERLAP), [1], [1]],
          overlap(collection([value(1)]), collection([value(1)])),
        ],
        [
          [defaultOperatorMapping.get(KIND_PREFIX), 'prefix', 'value'],
          prefix(value('prefix'), value('value')),
        ],
        [
          [defaultOperatorMapping.get(KIND_SUFFIX), 'value', 'suffix'],
          suffix(value('value'), value('suffix')),
        ],
        [[defaultOperatorMapping.get(KIND_PRESENT), 1], present(value(1))],
        [[defaultOperatorMapping.get(KIND_UNDEF), 1], undef(value(1))],
      ])('%p should be parsed as %p', (expression, expected) => {
        expect(parser.parse(expression).toString()).toBe(expected.toString())
      })
    })

    describe('logical', () => {
      it.each<[unknown, Evaluable]>([
        [
          [defaultOperatorMapping.get(KIND_AND), true, true],
          and(value(true), value(true)),
        ],
        [
          [defaultOperatorMapping.get(KIND_OR), true, true],
          or(value(true), value(true)),
        ],
        [
          [defaultOperatorMapping.get(KIND_NOR), false, false],
          nor(value(false), value(false)),
        ],
        [
          [defaultOperatorMapping.get(KIND_XOR), true, false],
          xor(value(true), value(false)),
        ],
        [[defaultOperatorMapping.get(KIND_NOT), true], not(value(true))],
      ])('%p should be parsed as %p', (expression, expected) => {
        expect(parser.parse(expression).toString()).toBe(expected.toString())
      })
    })

    describe('invalid', () => {
      it.each<[unknown]>([
        [undefined],
        [[]],
        [() => true],
        [{}],
        [Symbol()],
        [[defaultOperatorMapping.get(KIND_AND), () => true, true]],
      ])('%p should throw', (expression) => {
        expect(() => parser.parse(expression)).toThrowError()
      })
    })

    describe('recessiveness', () => {
      it.each<[unknown, Evaluable]>([
        [
          [
            defaultOperatorMapping.get(KIND_AND),
            [defaultOperatorMapping.get(KIND_EQ), asReference('path'), 1],
            [defaultOperatorMapping.get(KIND_NE), 1, 1],
          ],
          and(eq(reference('path'), value(1)), ne(value(1), value(1))),
        ],
        [
          [
            defaultOperatorMapping.get(KIND_IN),
            asReference('path'),
            [[defaultOperatorMapping.get(KIND_EQ), 1, 1], 1, 1],
          ],
          In(
            reference('path'),
            collection([eq(value(1), value(1)), value(1), value(1)])
          ),
        ],
        [
          [
            defaultOperatorMapping.get(KIND_AND),
            [defaultOperatorMapping.get(KIND_OR), asReference('path'), 1],
            [defaultOperatorMapping.get(KIND_NOR), 1, 1],
          ],
          and(or(reference('path'), value(1)), nor(value(1), value(1))),
        ],
      ])('%p should be parsed as %p', (expression, expected) => {
        expect(parser.parse(expression).toString()).toBe(expected.toString())
      })
    })
  })
})
