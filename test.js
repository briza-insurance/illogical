import ill from './lib/illogical.cjs'

// node --inspect-brk ./test.js

const engine = new ill.default({ evaluator: 'bytecode' })
console.log(
  engine.simplify(
    [
      'OR',
      ['==', '$B', 'yes'],
      [
        'AND',
        ['OR', ['==', '$A', 18], ['AND', ['==', '$E', 5], ['==', '$F', 'yes']]],
        ['==', '$D', 1],
        ['==', '$X', 2],
        ['==', '$Y', 3],
      ],
      ['==', '$A', 'yes'],
      [
        'OR',
        ['==', '$C', 'yes'],
        ['AND', ['==', '$B', 'no'], ['IN', '$A', [13, 14]]],
      ],
    ],
    {
      A: 14,
      E: 5,
    }
  )
)

// [
//   'OR',
//   ['==', '$B', 'yes'],
//   [
//     'AND',
//     ['==', '$F', 'yes'],
//     ['==', '$D', 1],
//     ['==', '$X', 2],
//     ['==', '$Y', 3],
//   ],
//   ['OR', ['==', '$C', 'yes'], ['==', '$B', 'no']],
// ]
//
//   0: OP_PUSH_REF_KEY 0 ("B")
//   2: OP_PUSH_VALUE "yes"
//   4: OP_EQ
//   5: OP_JUMP_IF_TRUE 87
//   7: OP_POP
//   8: OP_PUSH_REF_KEY 1 ("A")
//   10: OP_PUSH_VALUE 18
//   12: OP_EQ
//   13: OP_JUMP_IF_TRUE 16
//   15: OP_POP
//   16: OP_PUSH_REF_KEY 2 ("E")
//   18: OP_PUSH_VALUE 5
//   20: OP_EQ
//   21: OP_JUMP_IF_FALSE 6
//   23: OP_POP
//   24: OP_PUSH_REF_KEY 3 ("F")
//   26: OP_PUSH_VALUE "yes"
//   28: OP_EQ
//   29: OP_AND
//   30: OP_PUSH_REF
//   31: OP_OR
//   32: OP_PUSH_REF
//   33: OP_JUMP_IF_FALSE 22
//   35: OP_POP
//   36: OP_PUSH_REF_KEY 4 ("D")
//   38: OP_PUSH_VALUE 1
//   40: OP_EQ
//   41: OP_JUMP_IF_FALSE 14
//   43: OP_POP
//   44: OP_PUSH_REF_KEY 5 ("X")
//   46: OP_PUSH_VALUE 2
//   48: OP_EQ
//   49: OP_JUMP_IF_FALSE 6
//   51: OP_POP
//   52: OP_PUSH_REF_KEY 6 ("Y")
//   54: OP_PUSH_VALUE 3
//   56: OP_EQ
//   57: OP_AND
//   58: OP_PUSH_CONST 42
//   60: OP_DIVIDE 43
//   62: OP_PUSH_REF_KEY 1 ("A")
//   64: OP_PUSH_VALUE "yes"
//   66: OP_EQ
//   67: OP_JUMP_IF_TRUE 25
//   69: OP_POP
//   70: OP_PUSH_REF_KEY 7 ("C")
//   72: OP_PUSH_VALUE "yes"
//   74: OP_EQ
//   75: OP_JUMP_IF_TRUE 15
//   77: OP_POP
//   78: OP_PUSH_REF_KEY 0 ("B")
//   80: OP_PUSH_VALUE "no"
//   82: OP_EQ
//   83: OP_JUMP_IF_FALSE 5
//   85: OP_POP
//   86: OP_PUSH_REF_KEY 1 ("A")
//   88: OP_IN_CONST 0
//   90: OP_AND
//   91: OP_PUSH_REF
//   92: OP_OR
//   93: OP_PUSH_REF
//   94: OP_OR
//   95: OP_PUSH_CONST undefined
