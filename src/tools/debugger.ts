/**
 * Bytecode execution debugger — TUI time-travel debugger.
 *
 * Usage:
 *   npm run debug-bytecode -- --expr '["==", "$x", 1]' --ctx '{"x":1}'
 *   cat expression.json | npm run debug-bytecode -- --ctx '{"x":1}'
 *   cat expression.json | npm run debug-bytecode -- --ctx-case partial-false
 *   npm run debug-bytecode -- --expr '...' --ctx '...' --no-tty   # dump trace as JSON
 *
 * --ctx-case values: complete-true, complete-false, partial-true, partial-false,
 *                    full-execution-true, full-execution-false, early-true, late-true
 */

import * as fs from 'fs'

import {
  generateCases,
  type GeneratedCases,
} from '../benchmark/generate-cases.js'
import { compile } from '../bytecode/compiler.js'
import { Context } from '../common/evaluable.js'
import { ExpressionInput, Parser } from '../parser/index.js'
import { setupKeyboard } from './debugger-input.js'
import { renderFrame } from './debugger-render.js'
import { interpretDebug } from './debugger-vm.js'

const CTX_CASE_MAP: Record<string, keyof GeneratedCases> = {
  'complete-true': 'completeTrue',
  'complete-false': 'completeFalse',
  'partial-true': 'partialTrue',
  'partial-false': 'partialFalse',
  'full-execution-true': 'fullExecutionTrue',
  'full-execution-false': 'fullExecutionFalse',
  'early-true': 'earlyTrue',
  'late-true': 'lateTrue',
}

function parseArgs(): {
  expr: string | null
  ctx: string | null
  ctxCase: string | null
  noTty: boolean
} {
  const args = process.argv.slice(2)
  let expr: string | null = null
  let ctx: string | null = null
  let ctxCase: string | null = null
  let noTty = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--expr' && args[i + 1]) {
      expr = args[++i]
    } else if (args[i] === '--ctx' && args[i + 1]) {
      ctx = args[++i]
    } else if (args[i] === '--ctx-case' && args[i + 1]) {
      ctxCase = args[++i]
    } else if (args[i] === '--no-tty') {
      noTty = true
    }
  }

  return { expr, ctx, ctxCase, noTty }
}

function isExpressionInput(v: unknown): v is ExpressionInput {
  return Array.isArray(v) && v.length > 0 && typeof v[0] === 'string'
}

function readStdin(): string {
  return fs.readFileSync(0, 'utf-8')
}

function main() {
  const { expr: exprArg, ctx: ctxArg, ctxCase, noTty } = parseArgs()

  // Read expression from --expr or stdin (only read stdin when --expr not given,
  // so piping works: cat expr.json | npm run debug-bytecode -- --ctx '{}')
  const rawExpr = exprArg !== null ? exprArg : readStdin()
  if (!rawExpr || rawExpr.trim() === '') {
    console.error('Error: provide an expression via --expr or stdin')
    process.exit(1)
  }

  let parsed: unknown
  let context: Context = {}

  try {
    parsed = JSON.parse(rawExpr)
  } catch {
    console.error('Error: expression is not valid JSON')
    process.exit(1)
  }

  if (!isExpressionInput(parsed)) {
    console.error(
      'Error: expression must be a JSON array with a string operator as the first element'
    )
    process.exit(1)
  }

  const expression: ExpressionInput = parsed

  if (ctxCase !== null) {
    const caseKey = CTX_CASE_MAP[ctxCase]
    if (caseKey === undefined) {
      console.error(
        `Error: unknown --ctx-case "${ctxCase}". Valid values: ${Object.keys(CTX_CASE_MAP).join(', ')}`
      )
      process.exit(1)
    }
    context = generateCases(expression)[caseKey]
  } else if (ctxArg !== null) {
    try {
      context = JSON.parse(ctxArg)
    } catch {
      console.error('Error: --ctx is not valid JSON')
      process.exit(1)
    }
  }

  // Compile
  const parser = new Parser()
  try {
    parser.parse(expression)
  } catch (err) {
    console.error(
      'Error: invalid expression:',
      err instanceof Error ? err.message : String(err)
    )
    process.exit(1)
  }
  const compiled = compile(expression, parser.options)

  // Run instrumented VM
  const trace = interpretDebug(compiled, context, expression)

  // Non-TTY mode: dump trace as JSON
  if (noTty || !process.stdout.isTTY) {
    process.stdout.write(JSON.stringify(trace, null, 2) + '\n')
    return
  }

  // TUI mode
  let stepIndex = 0
  let exprScroll = 0
  const exprLineCount = JSON.stringify(trace.expression, null, 2).split(
    '\n'
  ).length

  function redraw() {
    const frame = renderFrame({
      trace,
      stepIndex,
      exprScroll,
      termWidth: process.stdout.columns ?? 80,
      termHeight: process.stdout.rows ?? 24,
    })
    process.stdout.write(frame)
  }

  const teardown = setupKeyboard((event) => {
    switch (event) {
      case 'next':
        stepIndex = Math.min(stepIndex + 1, trace.snapshots.length - 1)
        break
      case 'prev':
        stepIndex = Math.max(stepIndex - 1, 0)
        break
      case 'first':
        stepIndex = 0
        break
      case 'last':
        stepIndex = trace.snapshots.length - 1
        break
      case 'exprDown':
        exprScroll = Math.min(exprScroll + 1, exprLineCount - 1)
        break
      case 'exprUp':
        exprScroll = Math.max(exprScroll - 1, 0)
        break
      case 'quit':
        teardown()
        process.stdout.write('\x1b[' + (process.stdout.rows ?? 24) + ';0H\n')
        process.exit(0)
    }
    redraw()
  })

  process.stdout.on('resize', redraw)

  redraw()
}

main()
