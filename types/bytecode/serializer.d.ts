/**
 * Bytecode serialize interpreter.
 *
 * Traverses compiled bytecode to reconstruct the original AST ExpressionInput.
 */
import { Input } from '../parser/index.js';
import { CompiledExpression } from './compiler.js';
/**
 * Serializes a compiled bytecode expression back into its ExpressionInput structure.
 */
export declare function serialize(compiled: CompiledExpression): Input;
