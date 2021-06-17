import {
  isEvaluable,
  isEvaluatedPrimitive,
  isEvaluatedValue,
} from '../../evaluable'

describe('evaluable', () => {
  describe('isEvaluable', () => {
    test.each([
      // Truthy
      [
        {
          evaluate: () => undefined,
        },
        true,
      ],
      // Falsy
      ['value', false],
      [1, false],
      [null, false],
      [undefined, false],
      [{}, false],
      [() => true, false],
      [[], false],
      [Symbol(), false],
    ])('%p should evaluate as %p', (value, expected) => {
      expect(isEvaluable(value)).toBe(expected)
    })
  })

  describe('isEvaluatedPrimitive', () => {
    test.each([
      // Truthy
      [true, true],
      [false, true],
      ['value', true],
      [1, true],
      [null, true],
      // Falsy
      [undefined, false],
      [{}, false],
      [() => true, false],
      [[], false],
      [Symbol(), false],
    ])('%p should evaluate as %p', (value, expected) => {
      expect(isEvaluatedPrimitive(value)).toBe(expected)
    })
  })

  describe('isEvaluatedValue', () => {
    test.each([
      // Truthy
      [true, true],
      [false, true],
      ['value', true],
      [1, true],
      [null, true],
      [undefined, true],
      // Falsy
      [{}, false],
      [() => true, false],
      [[], false],
      [Symbol(), false],
    ])('%p should evaluate as %p', (value, expected) => {
      expect(isEvaluatedValue(value)).toBe(expected)
    })
  })
})
