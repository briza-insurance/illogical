import createIllogical, { Expression } from '../..'
import { asExpected } from '../../common/utils'
import { eq, ne } from '../../expression/comparison'
import { and, KIND_AND } from '../../expression/logical'
import { reference, value } from '../../operand'

describe('illogical', () => {
  const illogical = createIllogical()
  const context = {
    refA: 'resolvedA',
  }

  describe('evaluate', () => {
    it.each([
      [1, 1],
      [true, true],
      ['value', 'value'],
      ['$refA', 'resolvedA'],
      [null, null],
      [['==', 1, 1], true],
      [['==', '$refA', 'resolvedA'], true],
      [['AND', ['==', 1, 1], ['!=', 2, 1]], true],
    ])('%p should evaluate as %p', (expression, expected) => {
      expect(illogical.evaluate(expression, context)).toBe(expected)
    })

    it.each([undefined, () => true, {}, [], Symbol(), new Date()])(
      '%p should throw',
      (expression) => {
        expect(() =>
          illogical.evaluate(asExpected<Expression>(expression), context)
        ).toThrowError()
      }
    )
  })

  describe('parse', () => {
    it.each([
      [1, value(1)],
      [true, value(true)],
      ['value', value('value')],
      ['$refA', reference('refA')],
      [null, value(null)],
      [['==', 1, 1], eq(value(1), value(1))],
      [['==', '$refA', 'resolvedA'], eq(reference('refA'), value('resolvedA'))],
      [
        ['AND', ['==', 1, 1], ['!=', 2, 1]],
        and(eq(value(1), value(1)), ne(value(2), value(1))),
      ],
    ])('%p should parse as %p', (expression, expected) => {
      expect(`${illogical.parse(expression)}`).toBe(`${expected}`)
    })

    it.each([undefined, () => true, {}, [], Symbol(), new Date()])(
      '%p should throw',
      (expression) => {
        expect(() =>
          illogical.parse(asExpected<Expression>(expression))
        ).toThrowError()
      }
    )
  })

  describe('statement', () => {
    it.each([
      [1, '1'],
      [true, 'true'],
      ['value', '"value"'],
      ['$refA', '{refA}'],
      [null, 'null'],
      [['==', 1, 1], '(1 == 1)'],
      [['==', '$refA', 'resolvedA'], '({refA} == "resolvedA")'],
      [['AND', ['==', 1, 1], ['!=', 2, 1]], '((1 == 1) AND (2 != 1))'],
    ])('%p should create statement %p', (expression, expected) => {
      expect(illogical.statement(expression)).toBe(expected)
    })

    it.each([undefined, () => true, {}, [], Symbol(), new Date()])(
      '%p should throw',
      (expression) => {
        expect(() =>
          illogical.statement(asExpected<Expression>(expression))
        ).toThrowError()
      }
    )
  })

  describe('simplify', () => {
    it.each([
      [1, 1],
      [true, true],
      ['value', 'value'],
      ['$refA', 'resolvedA'],
      ['$undefined', '$undefined'],
      [null, null],
      [['==', 1, 1], true],
      [['==', '$refA', 'resolvedA'], true],
      [
        ['==', '$undefined', 'resolvedA'],
        ['==', '$undefined', 'resolvedA'],
      ],
      [
        ['AND', ['==', 1, 1], ['!=', '$undefined', 2]],
        ['!=', '$undefined', 2],
      ],
    ])('%p should simplify as %p', (expression, expected) => {
      expect(illogical.simplify(expression, context)).toStrictEqual(expected)
    })

    it('should use ignored path', () => {
      expect(
        illogical.simplify(
          ['AND', ['==', '$refA', 1], ['!=', '$refB', 2]],
          context,
          ['refB']
        )
      ).toStrictEqual(false)
    })

    it.each([undefined, () => true, {}, [], Symbol(), new Date()])(
      '%p should throw',
      (expression) => {
        expect(() =>
          illogical.simplify(asExpected<Expression>(expression), context)
        ).toThrowError()
      }
    )
  })

  it('should use custom options', () => {
    expect(
      createIllogical({ operatorMapping: new Map([[KIND_AND, '&']]) }).evaluate(
        ['&', 1, 1],
        {}
      )
    ).toBe(true)
  })
})
