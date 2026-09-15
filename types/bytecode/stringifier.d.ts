/**
 * Bytecode serialize interpreter.
 *
 * Traverses compiled bytecode to reconstruct the original AST ExpressionInput.
 */
import { CompiledExpression } from './compiler.js';
export declare function stringify(compiled: CompiledExpression): string;
