/**
 * Bytecode opcodes for the illogical expression interpreter.
 *
 * Each opcode is a small integer. Some opcodes consume the next element(s)
 * in the bytecode array as operand data (e.g. OP_PUSH_VALUE reads the next
 * element as the literal value to push).
 */

export const OP_PUSH_VALUE = 1 // next: literal — push literal onto stack
export const OP_PUSH_REF = 2 // next: ref index — push context lookup onto stack (legacy, unused by new compiler)
export const OP_PUSH_REF_KEY = 6 // next: index into refs (CompactRef string) — ctx[key]
export const OP_PUSH_REF_KEYS = 7 // next: index into refs (CompactRef string[]) — inline multi-key walk
export const OP_PUSH_REF_TOKENS = 8 // next: index into refs (CompactRef token/dataType obj) — token walk
export const OP_PUSH_REF_DYNAMIC = 9 // next: index into refs (CompactRef dynamic obj) — runtime substitution
export const OP_MAKE_COLLECTION = 3 // next: N — pop N items, push as array
export const OP_PUSH_CONST = 4 // next: constIdx — push consts[constIdx] (static array) onto stack
export const OP_OVERLAP_CONST = 5 // next: constIdx — pop dynamic array, Set-intersect against consts[constIdx]

export const OP_EQ = 10 // pop 2, push (left === right)
export const OP_NE = 11 // pop 2, push (left !== right)
export const OP_GT = 12 // pop 2, push (left > right), with date fallback
export const OP_GE = 13 // pop 2, push (left >= right), with date fallback
export const OP_LT = 14 // pop 2, push (left < right), with date fallback
export const OP_LE = 15 // pop 2, push (left <= right), with date fallback
export const OP_IN = 16 // pop 2, push membership check (one must be array) — dynamic fallback
export const OP_NOT_IN = 17 // pop 2, push non-membership check — dynamic fallback
export const OP_IN_COLLECTION = 45 // next: N — pop scalar, scan N stack items, push membership result
export const OP_NOT_IN_COLLECTION = 46 // next: N — pop scalar, scan N stack items, push non-membership result
export const OP_IN_CONST = 49 // next: constIdx — pop scalar, Set-lookup in consts[constIdx], push membership result
export const OP_NOT_IN_CONST = 50 // next: constIdx — pop scalar, Set-lookup in consts[constIdx], push !membership
// next: N, ref0..refN-1, constIdx — resolve each ref inline against Set, no stack alloc
export const OP_OVERLAP_SCAN_REFS_CONST = 51
// next: ref1Idx, ref2Idx, N, (setA0 setB0), ..., (setAN-1 setBN-1)
// OR of N AND(IN(ref1, consts[setA_i]), IN(ref2, consts[setB_i])) pairs — resolves refs once
export const OP_OR_AND_IN_CONST_2 = 52
export const OP_PREFIX = 18 // pop 2, push right.startsWith(left)
export const OP_SUFFIX = 19 // pop 2, push left.endsWith(right)
export const OP_OVERLAP = 20 // pop 2, push array intersection check
export const OP_PRESENT = 21 // pop 1, push (value !== undefined && value !== null)
export const OP_UNDEFINED = 22 // pop 1, push (value === undefined)

export const OP_SUM = 30 // next: N — pop N numbers, push decimal-corrected sum
export const OP_SUBTRACT = 31 // next: N — pop N numbers, push decimal-corrected subtraction
export const OP_MULTIPLY = 32 // next: N — pop N numbers, push decimal-corrected multiplication
export const OP_DIVIDE = 33 // next: N — pop N numbers, push division result

export const OP_STORE_LOCAL = 47 // next: slot — peek top of stack, store into locals[slot]
export const OP_LOAD_LOCAL = 48 // next: slot — push locals[slot] onto stack

export const OP_NOT = 40 // pop 1 boolean, push negation
export const OP_JUMP_IF_FALSE = 41 // next: offset — peek stack; if false jump forward by offset
export const OP_JUMP_IF_TRUE = 42 // next: offset — peek stack; if true jump forward by offset
export const OP_POP = 43 // pop and discard top of stack
export const OP_XOR = 44 // pop 2 booleans, push (a || b) && !(a && b)
