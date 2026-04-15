/**
 * Bytecode opcodes for the illogical expression interpreter.
 *
 * Each opcode is a small integer. Some opcodes consume the next element(s)
 * in the bytecode array as operand data (e.g. OP_PUSH_VALUE reads the next
 * element as the literal value to push).
 */
export declare const OP_PUSH_VALUE = 1;
export declare const OP_PUSH_REF = 2;
export declare const OP_PUSH_REF_KEY = 6;
export declare const OP_PUSH_REF_KEYS = 7;
export declare const OP_PUSH_REF_TOKENS = 8;
export declare const OP_PUSH_REF_DYNAMIC = 9;
export declare const OP_MAKE_COLLECTION = 3;
export declare const OP_PUSH_CONST = 4;
export declare const OP_OVERLAP_CONST = 5;
export declare const OP_EQ = 10;
export declare const OP_NE = 11;
export declare const OP_GT = 12;
export declare const OP_GE = 13;
export declare const OP_LT = 14;
export declare const OP_LE = 15;
export declare const OP_IN = 16;
export declare const OP_NOT_IN = 17;
export declare const OP_IN_COLLECTION = 45;
export declare const OP_NOT_IN_COLLECTION = 46;
export declare const OP_IN_CONST = 49;
export declare const OP_NOT_IN_CONST = 50;
export declare const OP_OVERLAP_SCAN_REFS_CONST = 51;
export declare const OP_OR_AND_IN_CONST_2 = 52;
export declare const OP_PREFIX = 18;
export declare const OP_SUFFIX = 19;
export declare const OP_OVERLAP = 20;
export declare const OP_PRESENT = 21;
export declare const OP_UNDEFINED = 22;
export declare const OP_SUM = 30;
export declare const OP_SUBTRACT = 31;
export declare const OP_MULTIPLY = 32;
export declare const OP_DIVIDE = 33;
export declare const OP_STORE_LOCAL = 47;
export declare const OP_LOAD_LOCAL = 48;
export declare const OP_NOT = 40;
export declare const OP_JUMP_IF_FALSE = 41;
export declare const OP_JUMP_IF_TRUE = 42;
export declare const OP_POP = 43;
export declare const OP_XOR = 44;
