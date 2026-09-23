/**
 * Main module.
 * @module illogical
 */
import { Context, Evaluable } from './common/evaluable.js';
import { isEvaluable } from './common/type-check.js';
import { Engine } from './engine/engine.js';
import { OPERATOR as OPERATOR_DIVIDE } from './expression/arithmetic/divide.js';
import { OPERATOR as OPERATOR_MULTIPLY } from './expression/arithmetic/multiply.js';
import { OPERATOR as OPERATOR_SUBTRACT } from './expression/arithmetic/subtract.js';
import { OPERATOR as OPERATOR_SUM } from './expression/arithmetic/sum.js';
import { OPERATOR as OPERATOR_EQ } from './expression/comparison/eq.js';
import { OPERATOR as OPERATOR_GE } from './expression/comparison/ge.js';
import { OPERATOR as OPERATOR_GT } from './expression/comparison/gt.js';
import { OPERATOR as OPERATOR_IN } from './expression/comparison/in.js';
import { OPERATOR as OPERATOR_LE } from './expression/comparison/le.js';
import { OPERATOR as OPERATOR_LT } from './expression/comparison/lt.js';
import { OPERATOR as OPERATOR_NE } from './expression/comparison/ne.js';
import { OPERATOR as OPERATOR_NOT_IN } from './expression/comparison/not-in.js';
import { OPERATOR as OPERATOR_OVERLAP } from './expression/comparison/overlap.js';
import { OPERATOR as OPERATOR_PREFIX } from './expression/comparison/prefix.js';
import { OPERATOR as OPERATOR_PRESENT } from './expression/comparison/present.js';
import { OPERATOR as OPERATOR_SUFFIX } from './expression/comparison/suffix.js';
import { OPERATOR as OPERATOR_UNDEFINED } from './expression/comparison/undefined.js';
import { OPERATOR as OPERATOR_AND } from './expression/logical/and.js';
import { OPERATOR as OPERATOR_NOR } from './expression/logical/nor.js';
import { OPERATOR as OPERATOR_NOT } from './expression/logical/not.js';
import { OPERATOR as OPERATOR_OR } from './expression/logical/or.js';
import { OPERATOR as OPERATOR_XOR } from './expression/logical/xor.js';
import { ExpressionInput, Input } from './parser/index.js';
export { BatchEngine } from './batch/batch.js';
export type { BatchEvaluatorOptions } from './batch/types.js';
export { defaultOptions } from './parser/options.js';
export { isEvaluable, OPERATOR_AND, OPERATOR_DIVIDE, OPERATOR_EQ, OPERATOR_GE, OPERATOR_GT, OPERATOR_IN, OPERATOR_LE, OPERATOR_LT, OPERATOR_MULTIPLY, OPERATOR_NE, OPERATOR_NOR, OPERATOR_NOT, OPERATOR_NOT_IN, OPERATOR_OR, OPERATOR_OVERLAP, OPERATOR_PREFIX, OPERATOR_PRESENT, OPERATOR_SUBTRACT, OPERATOR_SUFFIX, OPERATOR_SUM, OPERATOR_UNDEFINED, OPERATOR_XOR, };
export type { Context, Evaluable, ExpressionInput, Input };
export default Engine;
