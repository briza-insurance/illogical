/**
 * Main module.
 * @module illogical
 */

import { Context, Evaluable, Evaluated, Expression } from './evaluable'
import {
  KIND_EQ,
  KIND_GE,
  KIND_GT,
  KIND_IN,
  KIND_LE,
  KIND_LT,
  KIND_NE,
  KIND_NOT_IN,
  KIND_OVERLAP,
  KIND_PREFIX,
  KIND_PRESENT,
  KIND_SUFFIX,
  KIND_UNDEF,
} from './expression/comparison'
import {
  KIND_AND,
  KIND_NOR,
  KIND_NOT,
  KIND_OR,
  KIND_XOR,
} from './expression/logical'
import { Illogical, illogical } from './illogical'
import { Options } from './options'

export type { Illogical, Options, Expression, Evaluable, Evaluated, Context }

export {
  KIND_EQ,
  KIND_GE,
  KIND_GT,
  KIND_IN,
  KIND_LE,
  KIND_LT,
  KIND_NE,
  KIND_NOT_IN,
  KIND_OVERLAP,
  KIND_PREFIX,
  KIND_PRESENT,
  KIND_SUFFIX,
  KIND_UNDEF,
  KIND_AND,
  KIND_NOR,
  KIND_NOT,
  KIND_OR,
  KIND_XOR,
}

export default illogical
