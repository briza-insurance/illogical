import Engine from '../../'
import { OPERATOR as OPERATOR_EQ } from '../../expression/comparison/eq'
import { OPERATOR as OPERATOR_NE } from '../../expression/comparison/ne'
import { OPERATOR as OPERATOR_GT } from '../../expression/comparison/gt'
import { OPERATOR as OPERATOR_GE } from '../../expression/comparison/ge'
import { OPERATOR as OPERATOR_LT } from '../../expression/comparison/lt'
import { OPERATOR as OPERATOR_LE } from '../../expression/comparison/le'
import { OPERATOR as OPERATOR_IN } from '../../expression/comparison/in'
import { OPERATOR as OPERATOR_NOT_IN } from '../../expression/comparison/not-in'
import { OPERATOR as OPERATOR_PREFIX } from '../../expression/comparison/prefix'
import { OPERATOR as OPERATOR_SUFFIX } from '../../expression/comparison/suffix'
import { OPERATOR as OPERATOR_AND } from '../../expression/logical/and'
import { OPERATOR as OPERATOR_OR } from '../../expression/logical/or'
import { OPERATOR as OPERATOR_NOR } from '../../expression/logical/nor'
import { OPERATOR as OPERATOR_XOR } from '../../expression/logical/xor'


describe('Condition Engine', () => {
  const engine = new Engine()
  test('evaluate', () => {
    const exceptions = [
      { expression: [OPERATOR_EQ]},
      { expression: [OPERATOR_EQ, 5]},
      { expression: [OPERATOR_EQ, 5, 5, 5]},
      { expression: [OPERATOR_NE]},
      { expression: [OPERATOR_GT]},
      { expression: [OPERATOR_GE]},
      { expression: [OPERATOR_LT]},
      { expression: [OPERATOR_LE]},
      { expression: [OPERATOR_IN]},
      { expression: [OPERATOR_NOT_IN]},
      { expression: [OPERATOR_PREFIX]},
      { expression: [OPERATOR_SUFFIX]},
      { expression: [OPERATOR_AND]},
      { expression: [OPERATOR_OR]},
      { expression: [OPERATOR_NOR]},
      { expression: [OPERATOR_XOR]},
    ]
  
    for (const exception of exceptions) {
      // @ts-ignore
      expect(() => engine.evaluate(exception.expression))
        .toThrowError()
    }
  })
  test('statement', () => {
    const exceptions = [
      { expression: [OPERATOR_EQ]},
      { expression: [OPERATOR_EQ, 5]},
      { expression: [OPERATOR_EQ, 5, 5, 5]},
      { expression: [OPERATOR_NE]},
      { expression: [OPERATOR_GT]},
      { expression: [OPERATOR_GE]},
      { expression: [OPERATOR_LT]},
      { expression: [OPERATOR_LE]},
      { expression: [OPERATOR_IN]},
      { expression: [OPERATOR_NOT_IN]},
      { expression: [OPERATOR_PREFIX]},
      { expression: [OPERATOR_SUFFIX]},
      { expression: [OPERATOR_AND]},
      { expression: [OPERATOR_OR]},
      { expression: [OPERATOR_NOR]},
      { expression: [OPERATOR_XOR]},
    ]
  
    for (const exception of exceptions) {
      // @ts-ignore
      expect(() => engine.statement(exception.expression))
        .toThrowError()
    }
  })
  test('parse', () => {
    const exceptions = [
      { expression: [OPERATOR_EQ]},
      { expression: [OPERATOR_EQ, 5]},
      { expression: [OPERATOR_EQ, 5, 5, 5]},
      { expression: [OPERATOR_NE]},
      { expression: [OPERATOR_GT]},
      { expression: [OPERATOR_GE]},
      { expression: [OPERATOR_LT]},
      { expression: [OPERATOR_LE]},
      { expression: [OPERATOR_IN]},
      { expression: [OPERATOR_NOT_IN]},
      { expression: [OPERATOR_PREFIX]},
      { expression: [OPERATOR_SUFFIX]},
      { expression: [OPERATOR_AND]},
      { expression: [OPERATOR_OR]},
      { expression: [OPERATOR_NOR]},
      { expression: [OPERATOR_XOR]},
    ]
  
    for (const exception of exceptions) {
      // @ts-ignore
      expect(() => engine.parse(exception.expression))
        .toThrowError()
    }
  })
})