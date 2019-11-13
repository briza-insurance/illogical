import { Value } from '../../value'

describe('Condition Engine - Operand - Value', () => {
  test('evaluate', () => {
    let tests = [
      { value: 1, expected: 1 },
      { value: '1', expected: '1' },
      { value: true, expected: true },
      { value: [1, 2], expected: [1, 2] },
      { value: ['1', '2'], expected: ['1', '2'] },
      { value: undefined, expected: undefined },
      { value: null, expected: null },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(new Value(test.value).evaluate({}))
        .toEqual(test.expected)
    }
  })

  test('toString', () => {
    let tests = [
      { value: 1, expected: '1' },
      { value: '1', expected: '"1"' },
      { value: true, expected: 'true' },
      { value: [1, 2], expected: '[1, 2]' },
      { value: ['1', '2'], expected: '["1", "2"]' },
      { value: undefined, expected: 'undefined' },
      { value: null, expected: 'null' },
    ]

    for (const test of tests) {
      // @ts-ignore
      expect(new Value(test.value).toString())
        .toBe(test.expected)
    }
  })
})