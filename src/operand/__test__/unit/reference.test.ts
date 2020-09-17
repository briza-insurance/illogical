import { defaultOptions } from '../../../parser/options'
import { Reference } from '../../reference'

describe('Operand - Value', () => {
  describe('constructor', () => {
    test.each([
      ['']
    ])('arguments %p should throw', (value) => {
      expect(() => new Reference(value)).toThrowError()
    })
  })

  const context = {
    RefA: 1,
    // RefB = undefined
    RefC: {
      subA: 2,
      subB: {
        subSubA: 3
      }
    },
    RefD: 'A',
    RefE: 'D',
    RefF: 'subA',
    RefG: [
      'Apples',
      'Oranges',
      'Fish'
    ],
    RefH: [
      {
        subA: 1
      },
      {
        subA: 2
      }
    ],
    RefI: [
      ['A', 'B'],
      ['C', 'D']
    ],
    // This is to make sure the code returns undefined when it can't resolve a complex reference.
    // It applies to this test case: ['Ref{RefB}', undefined].
    // When RefB can't be resolved, it should return undefined right away instead of transforming
    // Ref{RefB} into `Refundefined`. To make sure this works as expected `Refundefined` is added
    // to the context here so for that test case it would resolve to 'A' instead of undefined if
    // the implementation was incorrect, and the test would fail.
    Refundefined: 'A'
  }

  describe('evaluate', () => {
    test.each([
      // Existing
      ['RefA', 1 ], 
      // Nested
      ['RefC.subA', 2 ],
      ['RefC.subB.subSubA', 3 ], 
      // Missing
      ['RefB', undefined ],
      ['RefC.subC', undefined ],
      ['RefC.subB.subSubB', undefined ],
      ['RefC.subA.subSubA', undefined ],
      // Array
      ['RefG[1]', 'Oranges'],
      ['RefI[0][1]', 'B'],
      ['RefI[0][5]', undefined],
      // Complex
      ['Ref{Ref{RefE}}', 1],
      ['RefC.{RefF}', 2],
      ['RefG[{RefC.sub{RefD}}]', 'Fish'],
      ['RefH[{RefA}].sub{RefD}', 2],
      ['RefA{RefA}', undefined],
      ['RefB.{RefA}', undefined],
      ['Ref{RefB}', undefined]
    ])('%p should evaluate as %p', (value, expected) => {
      expect(new Reference(value).evaluate(context)).toBe(expected)
    })
  })
  
  describe('simplify', () => {
    test.each([
      // Existing
      ['RefA', 1 ], 
      // Nested
      ['RefC.subA', 2 ],
      ['RefC.subB.subSubA', 3 ], 
      // Missing
      ['RefB', new Reference('RefB') ],
      ['RefC.subC', undefined ],
      ['RefC.subB.subSubB', undefined ],
      ['RefC.subA.subSubA', undefined ],
      // Array
      ['RefG[1]', 'Oranges'],
      ['RefI[0][1]', 'B'],
      ['RefI[0][5]', undefined],
      // Complex
      ['Ref{Ref{RefE}}', 1],
      ['RefC.{RefF}', 2],
      ['RefG[{RefC.sub{RefD}}]', 'Fish'],
      ['RefH[{RefA}].sub{RefD}', 2],
      ['RefA{RefA}', new Reference('RefA{RefA}')],
      ['RefB.{RefA}', new Reference('RefB.{RefA}')],
      ['Ref{RefB}', new Reference('Ref{RefB}')]
    ])('%p should simplify to %p', (value, expected) => {
      expect(new Reference(value).simplify(context)).toEqual(expected)
    })
  })

  describe('serialize', () => {
    test.each([
      // Existing
      ['RefA', '$RefA'], 
      // Nested
      ['RefC.subA', '$RefC.subA'],
      ['RefC.subB.subSubA', '$RefC.subB.subSubA'],
      // Missing
      ['RefB', '$RefB' ],
      ['RefC.subC', '$RefC.subC' ],
      ['RefC.subB.subSubB', '$RefC.subB.subSubB' ],
      ['RefC.subA.subSubA', '$RefC.subA.subSubA' ],
      // Array
      ['RefG[1]', '$RefG[1]'],
      ['RefI[0][1]', '$RefI[0][1]'],
      ['RefI[0][5]', '$RefI[0][5]'],
      // Complex
      ['Ref{Ref{RefE}}', '$Ref{Ref{RefE}}'],
      ['RefC.{RefF}', '$RefC.{RefF}'],
      ['RefG[{RefC.sub{RefD}}]', '$RefG[{RefC.sub{RefD}}]'],
      ['RefH[{RefA}].sub{RefD}', '$RefH[{RefA}].sub{RefD}'],
      ['RefA{RefA}', '$RefA{RefA}'],
      ['RefB.{RefA}', '$RefB.{RefA}'],
      ['Ref{RefB}', '$Ref{RefB}']
    ])('%p should serialize to %p', (value, expected) => {
      expect(new Reference(value).serialize(defaultOptions)).toEqual(expected)
    })
  })

  describe('toString', () => {
    test.each([
      ['key', '{key}'],
    ])('%p should be %p', (value, expected) => {
      expect(new Reference(value).toString()).toBe(expected)
    })
  })
})
