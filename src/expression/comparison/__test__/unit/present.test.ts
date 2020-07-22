import { Present } from '../../present'
import { Value } from '../../../../operand/value'
import { Collection } from '../../../../operand/collection'
import { Reference } from '../../../../operand/reference'

type TestTuple = [Value | Collection | Reference, boolean]

describe('Condition Engine - Expression - Comparison - Undefined', () => {
  describe('constructor', () => {
    // @ts-ignore
    expect(() => new Present())
      .toThrowError()
    // @ts-ignore
    expect(() => new Present(5, 5))
      .toThrowError()
  })

  it.each<TestTuple>(
    [
      // Falsy
      [new Value(null), false],
      // Truthy
      [new Value(0), true],
      [new Value(false), true],
      [new Value('apples'), true],
      [new Value(12), true],
      [new Collection([new Value(1)]), true],
      [new Collection([new Value(null)]), true]
    ]
  )('value type', (operand, expected) => {
    expect(new Present(operand).evaluate({})).toBe(expected)
  })

  it.each<TestTuple>(
    [
      // Falsy
      [new Reference('RefE'), false],
      [new Reference('RefH'), false],
      [new Reference('RefJ'), false],
      // Truthy
      [new Reference('RefA'), true],
      [new Reference('RefB'), true],
      [new Reference('RefC'), true],
      [new Reference('RefD'), true],
      [new Reference('RefF'), true],
      [new Reference('RefG'), true],
      [new Reference('RefI'), true],
    ]
  )('reference type', (operand, expected) => {
    const context = {
      RefA: 1,
      RefB: '1',
      RefC: true,
      RefD: false,
      // RefE = undefined
      RefF: [1],
      RefG: ['1'],
      RefH: undefined,
      RefI: 0,
      RefJ: null,
    }

    expect(new Present(operand).evaluate(context)).toBe(expected)
  })
})
