import Engine from '../index.js';
import { ExpressionInput } from '../parser/index.js';
import { Options } from '../parser/options.js';
import { ParsedBatch } from './types.js';
export declare const parseBatch: (options: Options, engine: Engine, expressionsMap: Map<string, ExpressionInput>) => ParsedBatch;
