import Engine from '../index.js';
import { ExpressionInput } from '../parser/index.js';
import { ParsedBatch } from './types.js';
export declare const parseBatch: (engine: Engine, expressionsMap: Map<string, ExpressionInput>) => ParsedBatch;
