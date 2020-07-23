import { isNumber, isString, isObject } from '../../type-check'

describe('Condition Engine - Common - Type Check', () => {
  test('isNumber', () => {
    let tests = [
      // Truthy
      { value: 1, expected: true },
      { value: 1.0, expected: true },
      // Falsy
      { value: Infinity, expected: false },
      { value: -Infinity, expected: false },
      { value: '1', expected: false },
      { value: true, expected: false },
      { value: false, expected: false },
      { value: {}, expected: false },
      { value: () => {}, expected: false },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(isNumber(test.value))
        .toBe(test.expected)
    }
  })

  test('isString', () => {
    let tests = [
      // Truthy
      { value: '1', expected: true },
      { value: new String('1'), expected: true },
      // Falsy
      { value: 1, expected: false },
      { value: true, expected: false },
      { value: false, expected: false },
      { value: {}, expected: false },
      { value: () => {}, expected: false },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(isString(test.value))
        .toBe(test.expected)
    }
  })

  test('isObject', () => {
    let tests = [
      { value: {}, expected: true },
      { value: 'hi', expected: false },
      { value: 1, expected: false },
      { value: null, expected: false },
      { value: undefined, expected: false }
    ]

    for (const test of tests) {
      expect(isObject(test.value))
        .toBe(test.expected)
    }
  })
})
