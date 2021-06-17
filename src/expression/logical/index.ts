import { and, KIND as KIND_AND } from './and'
import { Logical } from './logical'
import { KIND as KIND_NOR, nor } from './nor'
import { KIND as KIND_NOT, not } from './not'
import { KIND as KIND_OR, or } from './or'
import { KIND as KIND_XOR, xor } from './xor'

export type { Logical }
export {
  and,
  nor,
  not,
  or,
  xor,
  KIND_AND,
  KIND_NOR,
  KIND_NOT,
  KIND_OR,
  KIND_XOR,
}
