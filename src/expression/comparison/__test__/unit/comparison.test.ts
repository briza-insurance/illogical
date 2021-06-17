import { value } from '../../../../operand'
import { eq } from '../..'

describe('expression - comparison', () => {
  test('serialize', () => {
    expect(() => eq(value(10), value(10)).serialize()).toThrowError()
  })
})
