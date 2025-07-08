import {
  isEvaluable,
  OPERATOR_AND,
  OPERATOR_DIVIDE,
  OPERATOR_EQ,
  OPERATOR_GE,
  OPERATOR_GT,
  OPERATOR_IN,
  OPERATOR_LE,
  OPERATOR_LT,
  OPERATOR_MULTIPLY,
  OPERATOR_NE,
  OPERATOR_NOR,
  OPERATOR_NOT,
  OPERATOR_NOT_IN,
  OPERATOR_OR,
  OPERATOR_OVERLAP,
  OPERATOR_PREFIX,
  OPERATOR_PRESENT,
  OPERATOR_SUBTRACT,
  OPERATOR_SUFFIX,
  OPERATOR_SUM,
  OPERATOR_UNDEFINED,
  OPERATOR_XOR,
} from '..'
import { Context, Evaluable } from '../common/evaluable'
import { isString, isUndefined } from '../common/type-check'
import { Collection } from '../operand/collection'
import { Reference } from '../operand/reference'
import { Value } from '../operand/value'
import { Input } from '../parser'
import { Options } from '../parser/options'
import { simplifyAnd } from './and'
import {
  simplifyDivide,
  simplifyMultiply,
  simplifySubtract,
  simplifySum,
} from './arithmetic'
import { simplifyGe, simplifyGt, simplifyLe, simplifyLt } from './comparison'
import { simplifyEq, simplifyNe } from './equality'
import { simplifyIn } from './in'
import { simplifyNor } from './nor'
import { simplifyNot } from './not'
import { simplifyNotIn } from './not-in'
import { simplifyOr } from './or'
import { simplifyOverlap } from './overlap'
import { simplifyPrefix, simplifySuffix } from './prefix'
import { simplifyPresent, simplifyUndefined } from './present'
import { areAllInputs, resultToInput } from './type-check'
import { simplifyXor } from './xor'

export const unsafeSimplify = (
  context: Context,
  opts: Options,
  strictKeys?: string[],
  optionalKeys?: string[]
) => {
  const simplifyInput = (input: Input): Input | Evaluable => {
    // Value or Reference
    if (!Array.isArray(input)) {
      // Reference
      if (isString(input) && opts.referencePredicate(input)) {
        const result = new Reference(opts.referenceTransform(input)).simplify(
          context,
          strictKeys,
          optionalKeys
        )

        if (isEvaluable(result)) {
          return result
        }

        const inputResult = resultToInput(result)
        if (!isUndefined(inputResult)) {
          return inputResult
        }
        // It should have been a boolean or an Evaluable, but just in case
        // fallback to returning the input.
      }
      // Value
      return input
    }

    const [operator] = input

    switch (operator) {
      // Logical operators
      case opts.operatorMapping.get(OPERATOR_AND): {
        return simplifyAnd(simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_OR): {
        return simplifyOr(simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_NOR): {
        return simplifyNor(opts, simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_XOR): {
        return simplifyXor(opts, simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_NOT): {
        return simplifyNot(simplifyInput)(input)
      }
      // Comparison operators
      case opts.operatorMapping.get(OPERATOR_EQ): {
        return simplifyEq(opts, simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_NE): {
        return simplifyNe(opts, simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_GT): {
        return simplifyGt(opts, simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_GE): {
        return simplifyGe(opts, simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_LT): {
        return simplifyLt(opts, simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_LE): {
        return simplifyLe(opts, simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_IN): {
        return simplifyIn(simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_NOT_IN): {
        return simplifyNotIn(simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_PREFIX): {
        return simplifyPrefix(opts, simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_SUFFIX): {
        return simplifySuffix(opts, simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_OVERLAP): {
        return simplifyOverlap(simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_UNDEFINED): {
        return simplifyUndefined(simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_PRESENT): {
        return simplifyPresent(simplifyInput)(input)
      }
      // Arithmetic operators
      case opts.operatorMapping.get(OPERATOR_SUM): {
        return simplifySum(simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_SUBTRACT): {
        return simplifySubtract(simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_MULTIPLY): {
        return simplifyMultiply(simplifyInput)(input)
      }
      case opts.operatorMapping.get(OPERATOR_DIVIDE): {
        return simplifyDivide(simplifyInput)(input)
      }
      default: {
        // Handle as an array of References / Values if no operator matches
        const result = input.map(simplifyInput)

        if (!areAllInputs(result)) {
          return new Collection(
            result.map((item) => {
              if (item instanceof Reference) {
                return item
              }
              if (!isEvaluable(item)) {
                return new Value(item)
              }
              throw new Error(
                'Unexpected expression found within a collection of values/references'
              )
            })
          )
        }

        return result
      }
    }
  }

  return simplifyInput
}
