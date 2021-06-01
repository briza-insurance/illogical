import { identityEvaluable } from '../../../../__test__/helpers'
import { Evaluable } from '../../../../evaluable'
import { collection, reference, value } from '../../../../operand'
import { defaultReferenceSerializeOptions } from '../../../../operand/reference'
import { KIND, overlap } from '../../overlap'

describe('expression - comparison - overlap', () => {
  describe('constructor', () => {
    it.each([
      // Missing haystack
      [value(1), value(1)],
      // Missing needle
      [value(1), collection([value(1)])],
    ])('%p and %p should throw', (left, right) => {
      expect(() => overlap(left, right).evaluate({})).toThrowError()
    })
  })

  const testCases: [Evaluable, boolean][] = [
    // Truthy
    [overlap(collection([value(1)]), collection([value(1), value(2)])), true],
    [
      overlap(
        collection([value(1), value(2)]),
        collection([value(1), value(2)])
      ),
      true,
    ],
    [
      overlap(
        collection([value('1'), value('3')]),
        collection([value('1'), value('2')])
      ),
      true,
    ],
    // Truthy - Bi-directional
    [
      overlap(
        collection([value(1), value(2), value(5)]),
        collection([value(1), value(3)])
      ),
      true,
    ],
    // Falsy
    [overlap(collection([value(0)]), collection([value(1), value(2)])), false],
    [
      overlap(collection([value('0')]), collection([value('1'), value('2')])),
      false,
    ],
    // Falsy - non-comparable types
    [
      overlap(collection([value('1')]), collection([value(1), value(2)])),
      false,
    ],
    [
      overlap(collection([value(1)]), collection([value('1'), value('2')])),
      false,
    ],
  ]

  describe('evaluate', () => {
    it.each(testCases)('%p should evaluate as %p', (evaluable, expected) => {
      expect(evaluable.evaluate({})).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Evaluable, 'self' | boolean]>([
      [
        overlap(collection([value(10)]), collection([identityEvaluable()])),
        'self',
      ],
      [
        overlap(collection([identityEvaluable()]), collection([value(10)])),
        'self',
      ],
      [
        overlap(
          collection([identityEvaluable()]),
          collection([identityEvaluable()])
        ),
        'self',
      ],
      ...testCases,
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({})}`).toBe(
        `${expected == 'self' ? evaluable : expected}`
      )
    })
  })

  describe('serialize', () => {
    it.each<[Evaluable, unknown[]]>([
      [
        overlap(collection([value(10)]), collection([reference('ref')])),
        ['KIND', [10], ['$ref']],
      ],
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
    it.each([
      [
        overlap(collection([value(10)]), collection([reference('ref')])),
        '([10] overlap [{ref}])',
      ],
    ])('%p should be %p', (evaluable, expected) => {
      expect(evaluable.toString()).toBe(expected)
    })
  })
})
