import { value } from '../../../../operand'
import { not } from '../..'

describe('expression - logical', () => {
  test('serialize', () => {
    expect(() =>
      not(value(true)).serialize({
        operatorMapping: new Map(),
      })
    ).toThrowError()

    expect(() => not(value(true)).serialize()).toThrowError()
  })
})
