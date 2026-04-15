import { CompiledExpression } from '../bytecode/compiler.js'
import { Result } from '../common/evaluable.js'

export interface StepSnapshot {
  pc: number
  op: number
  opName: string
  disasmLine: string
  stackBefore: Result[]
  stackAfter: Result[]
  localsBefore: Result[]
  localsAfter: Result[]
}

export interface DisassembledInstruction {
  index: number // instruction number (0-based)
  pcStart: number // pc of the opcode slot
  pcEnd: number // pc of the last operand slot consumed
  text: string
}

export interface DebugTrace {
  snapshots: StepSnapshot[]
  finalResult: Result
  compiled: CompiledExpression
  disassembly: DisassembledInstruction[]
  expression: unknown
  context: Record<string, unknown>
}
