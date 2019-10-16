import { Reference } from '../../reference'

describe('Condition Engine - Operand - Value', () => {
  test('constructor', () => {
    let exceptions = [
      { value: '' },
    ]

    for (const exception of exceptions) {
      // @ts-ignore
      expect(() => new Reference(exception.value).evaluate())
        .toThrowError()
    }
  })

  test('evaluate', () => {
    let tests = [
      // Existing
      { value: 'RefA', expected: 1 },
      // Missing
      { value: 'RefB', expected: undefined },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(new Reference(test.value).evaluate({
        RefA: 1,
        // RefB = undefined
      }))
        .toEqual(test.expected)
    }
  })

  test('toString', () => {
    // @ts-ignore
    expect(new Reference('key').toString())
      .toBe('{key}')
  })
})