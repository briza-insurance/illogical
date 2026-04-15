/**
 * Ensures that src/tools/debugger-vm.ts handles the same set of opcodes as
 * src/bytecode/interpreter.ts. If you add a new opcode to the production
 * interpreter, this test will fail until you add it to the debug VM too.
 */

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { readFileSync } from 'fs'
import { join } from 'path'

function extractOpCases(src: string): string[] {
  return [...src.matchAll(/case (OP_\w+)/g)]
    .map((m) => m[1])
    .filter((v, i, arr) => arr.indexOf(v) === i) // dedupe (e.g. OP_GT/OP_GE/... on same case)
    .sort()
}

describe('debugger-vm opcode sync', () => {
  it('handles all opcodes that interpreter.ts handles', () => {
    const root = join(import.meta.dirname, '../../../../')
    const interpSrc = readFileSync(
      join(root, 'src/bytecode/interpreter.ts'),
      'utf8'
    )
    const debugSrc = readFileSync(
      join(root, 'src/tools/debugger-vm.ts'),
      'utf8'
    )

    const interpOps = extractOpCases(interpSrc)
    const debugOps = extractOpCases(debugSrc)

    assert.deepEqual(
      debugOps,
      interpOps,
      `debugger-vm.ts is missing opcodes: ${interpOps.filter((op) => !debugOps.includes(op)).join(', ') || 'none'}\n` +
        `debugger-vm.ts has extra opcodes: ${debugOps.filter((op) => !interpOps.includes(op)).join(', ') || 'none'}`
    )
  })
})
