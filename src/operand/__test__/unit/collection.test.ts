import { Evaluable, evaluable } from '../../../evaluable'
import { eq } from '../../../expression/comparison'
import { collection, reference, value } from '../..'
import {
  defaultEscapeCharacter,
  escapeOperator,
  isCollection,
  KIND,
  shouldBeEscaped,
} from '../../collection'
import { defaultReferenceSerializeOptions } from '../../reference'

describe('operand - collection', () => {
  describe('constructor', () => {
    it.each<[Evaluable[]]>([[[]], [[value(1), collection([value(1)])]]])(
      '%p should throw',
      (items) => {
        expect(() => collection(items)).toThrowError()
      }
    )
  })

  describe('evaluate', () => {
    it.each([
      [collection([value(1)]), [1]],
      [collection([value('1')]), ['1']],
      [collection([value(true)]), [true]],
      [collection([reference('RefA')]), ['A']],
      [collection([value(1), reference('RefA')]), [1, 'A']],
      [collection([eq(value(1), value(1)), reference('RefA')]), [true, 'A']],
    ])('%p should evaluate as %p', (evaluable, expected) => {
      expect(
        evaluable.evaluate({
          RefA: 'A',
        })
      ).toStrictEqual(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Evaluable, 'self' | unknown[]]>([
      [collection([reference('test'), value(10)]), 'self'],
      [collection([reference('refA'), value(10)]), [20, 10]],
      [collection([value(20), value(10)]), [20, 10]],
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({ refA: 20 })}`).toBe(
        `${expected == 'self' ? evaluable : expected}`
      )
    })
  })

  describe('serialize', () => {
    it.each<[Evaluable, (number | string)[]]>([
      [collection([reference('test'), value(10)]), ['$test', 10]],
      [collection([reference('refA'), value(10)]), ['$refA', 10]],
      [collection([reference('refA'), value('testing')]), ['$refA', 'testing']],
      [collection([value(20), value(10)]), [20, 10]],
      [
        collection([value('=='), value(10), value(10)]),
        [`${defaultEscapeCharacter}==`, 10, 10],
      ],
    ])('%p should be serialized to %p', (evaluable, expected) => {
      expect(
        evaluable.serialize({
          reference: defaultReferenceSerializeOptions,
          collection: {
            escapedOperators: new Set(['==']),
            escapeCharacter: defaultEscapeCharacter,
          },
        })
      ).toEqual(expected)
    })

    it('should use default serialization options', () => {
      expect(collection([value(20), value(10)]).serialize()).toStrictEqual([
        20, 10,
      ])
    })
  })

  describe('toString', () => {
    it.each([
      [collection([value(1)]), '[1]'],
      [collection([value('1')]), '["1"]'],
      [collection([value(true)]), '[true]'],
      [collection([reference('RefA')]), '[{RefA}]'],
      [collection([value(1), reference('RefA')]), '[1, {RefA}]'],
    ])('%p should be %p', (evaluable, expected) => {
      expect(evaluable.toString()).toBe(expected)
    })
  })

  describe('shouldBeEscaped', () => {
    const options1 = {
      escapedOperators: new Set<string>(['==']),
    }
    const options2 = { ...options1, escapeCharacter: '\\' }

    it.each([
      ['==', options2, true],
      ['==', undefined, false],
      ['==', options1, false],
      ['', options1, false],
    ])(
      '%p with options %p should be escaped: %p',
      (serialized, options, expected) => {
        expect(shouldBeEscaped(options)(serialized)).toBe(expected)
      }
    )
  })

  describe('escapeOperator', () => {
    const options = {
      escapedOperators: new Set<string>(),
      escapeCharacter: '\\',
    }

    it.each([
      ['==', options, '\\=='],
      ['==', undefined, '=='],
    ])(
      '%p with options %p should be escaped as %p',
      (serialized, options, expected) => {
        expect(escapeOperator(options)(serialized)).toBe(expected)
      }
    )
  })

  describe('isCollection', () => {
    const mock = (kind: symbol) =>
      evaluable({
        kind,
        evaluate: () => undefined,
        serialize: () => undefined,
        simplify: () => undefined,
        toString: () => 'undefined',
      })

    test.each([
      // Truthy
      [mock(KIND), true],
      // Falsy
      [mock(Symbol()), false],
    ])('%p should evaluate as %p', (value, expected) => {
      expect(isCollection(value)).toBe(expected)
    })
  })
})
