import { Reference } from '../../reference'

describe('Operand - Value', () => {
  describe('constructor', () => {
    test.each([
      ['']
    ])('arguments %p should throw', (value) => {
      expect(() => new Reference(value)).toThrowError()
    })
  })

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
    ])('%p should evaluate as %p', (value, expected) => {
      expect(new Reference(value).evaluate({
        RefA: 1,
        // RefB = undefined
        RefC: {
          subA: 2,
          subB: {
            subSubA: 3
          }
        }
      })).toBe(expected)
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
