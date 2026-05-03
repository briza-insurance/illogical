import { DebugTrace, StepSnapshot } from './types.js'

export interface RenderState {
  trace: DebugTrace
  stepIndex: number
  exprScroll: number
  termWidth: number
  termHeight: number
}

// ANSI helpers — no chalk dependency, keeps tools self-contained
const ESC = '\x1b['
const reset = '\x1b[0m'
const bold = (s: string) => `\x1b[1m${s}${reset}`
const dim = (s: string) => `\x1b[2m${s}${reset}`
const cyan = (s: string) => `\x1b[36m${s}${reset}`
const yellow = (s: string) => `\x1b[33m${s}${reset}`
const green = (s: string) => `\x1b[32m${s}${reset}`
const red = (s: string) => `\x1b[31m${s}${reset}`
const bgBlue = (s: string) => `\x1b[44m\x1b[97m${s}${reset}`
const clearScreen = `${ESC}2J${ESC}H`
// Matches ANSI SGR sequences (ESC[...m). Built via RegExp so no control char in a regex literal.
const ansiSgrRe = new RegExp(ESC[0] + '\\[[0-9;]*m', 'g')

function pad(s: string, width: number): string {
  const visible = s.replace(ansiSgrRe, '')
  const diff = width - visible.length
  return diff > 0 ? s + ' '.repeat(diff) : s
}

function truncate(s: string, maxWidth: number): string {
  const visible = s.replace(ansiSgrRe, '')
  if (visible.length <= maxWidth) {
    return s
  }
  return visible.slice(0, maxWidth - 1) + '…'
}

function formatValue(v: unknown): string {
  if (v === undefined) {
    return dim('undefined')
  }
  if (v === null) {
    return dim('null')
  }
  if (typeof v === 'boolean') {
    return v ? green('true') : red('false')
  }
  if (typeof v === 'string') {
    return yellow(`"${v}"`)
  }
  if (Array.isArray(v)) {
    return cyan(`[${v.map((x) => formatValue(x)).join(', ')}]`)
  }
  return String(v)
}

function hline(width: number): string {
  return '─'.repeat(width)
}

export function renderFrame(state: RenderState): string {
  const { trace, stepIndex, exprScroll, termWidth, termHeight } = state
  const snapshot: StepSnapshot = trace.snapshots[stepIndex]
  const total = trace.snapshots.length

  const rightWidth = Math.max(30, Math.floor(termWidth / 3))
  const leftWidth = termWidth - rightWidth - 1

  const contentRows = termHeight - 3

  // ── Bytecode panel ──────────────────────────────────────────────────────────
  const bcHeader = pad(
    bold('BYTECODE') + `  step ${cyan(String(stepIndex + 1))}/${total}`,
    leftWidth
  )

  const currentDisasmIndex = trace.disassembly.findIndex(
    (d) => d.pcStart === snapshot.pc
  )

  const bcRows = contentRows - 1
  const scrollOffset = Math.max(0, currentDisasmIndex - Math.floor(bcRows / 3))
  const visibleDisasm = trace.disassembly.slice(
    scrollOffset,
    scrollOffset + bcRows
  )

  const bcLines = visibleDisasm.map((instr) => {
    const isCurrent = instr.pcStart === snapshot.pc
    const prefix = isCurrent ? '▶ ' : '  '
    const text = truncate(instr.text, leftWidth - 2)
    if (isCurrent) {
      return bgBlue(pad(prefix + text, leftWidth))
    }
    return dim(prefix) + truncate(instr.text, leftWidth - 2)
  })

  while (bcLines.length < bcRows) {
    bcLines.push('')
  }

  // ── Right panel ─────────────────────────────────────────────────────────────
  const rightLines: string[] = []

  // Stack (show stackAfter — the state after the op executed, top-of-stack first)
  const stackVals = snapshot.stackAfter.slice().reverse()
  rightLines.push(bold('STACK') + dim(` (${stackVals.length})`))
  rightLines.push(hline(rightWidth))
  if (stackVals.length === 0) {
    rightLines.push(dim('  (empty)'))
  } else {
    for (
      let i = 0;
      i < stackVals.length && rightLines.length < Math.floor(contentRows * 0.4);
      i++
    ) {
      rightLines.push(
        `  ${dim(`[${stackVals.length - 1 - i}]`)} ${truncate(formatValue(stackVals[i]), rightWidth - 8)}`
      )
    }
    if (stackVals.length > Math.floor(contentRows * 0.4) - 2) {
      rightLines.push(
        dim(
          `  … +${stackVals.length - (Math.floor(contentRows * 0.4) - 2)} more`
        )
      )
    }
  }
  rightLines.push('')

  // Locals
  rightLines.push(bold('LOCALS'))
  rightLines.push(hline(rightWidth))
  const localsVals = snapshot.localsAfter
  if (localsVals.length === 0) {
    rightLines.push(dim('  (empty)'))
  } else {
    for (
      let i = 0;
      i < localsVals.length &&
      rightLines.length < Math.floor(contentRows * 0.65);
      i++
    ) {
      rightLines.push(
        `  ${dim(`[${i}]`)} ${truncate(formatValue(localsVals[i]), rightWidth - 8)}`
      )
    }
  }
  rightLines.push('')

  // Context — capped to leave at least 4 rows for the expression section
  const exprReserve = 4
  const ctxLimit = contentRows - rightLines.length - exprReserve
  rightLines.push(bold('CONTEXT'))
  rightLines.push(hline(rightWidth))
  const ctxEntries = Object.entries(trace.context)
  if (ctxEntries.length === 0) {
    rightLines.push(dim('  (empty)'))
  } else {
    let shown = 0
    for (const [k, v] of ctxEntries) {
      if (shown >= ctxLimit - 2) {
        rightLines.push(dim(`  … +${ctxEntries.length - shown} more`))
        break
      }
      rightLines.push(
        `  ${cyan(k)}: ${truncate(formatValue(v), rightWidth - k.length - 5)}`
      )
      shown++
    }
  }
  rightLines.push('')

  // Expression (pretty-printed, scrollable with ↑/↓ or j/k)
  const exprLines = JSON.stringify(trace.expression, null, 2).split('\n')
  const remainingRows = Math.max(1, contentRows - rightLines.length - 2)
  const maxScroll = Math.max(0, exprLines.length - remainingRows)
  const clampedScroll = Math.min(exprScroll, maxScroll)
  const scrollIndicator =
    exprLines.length > remainingRows
      ? dim(` ${clampedScroll + remainingRows}/${exprLines.length}`)
      : ''
  rightLines.push(bold('EXPRESSION') + scrollIndicator)
  rightLines.push(hline(rightWidth))
  const visibleExprLines = exprLines.slice(
    clampedScroll,
    clampedScroll + remainingRows
  )
  for (const line of visibleExprLines) {
    rightLines.push(truncate('  ' + line, rightWidth))
  }
  if (clampedScroll + remainingRows < exprLines.length) {
    rightLines.push(
      dim(`  ↓ ${exprLines.length - clampedScroll - remainingRows} more`)
    )
  }

  while (rightLines.length < contentRows) {
    rightLines.push('')
  }

  // ── Assemble frame ──────────────────────────────────────────────────────────
  const lines: string[] = []
  lines.push(clearScreen)
  lines.push(hline(termWidth))

  lines.push(
    pad(bcHeader, leftWidth) +
      '│' +
      truncate(pad(rightLines[0] ?? '', rightWidth), rightWidth)
  )

  const panelRows = contentRows - 1
  for (let row = 0; row < panelRows; row++) {
    const left = pad(bcLines[row] ?? '', leftWidth)
    const right = truncate(rightLines[row + 1] ?? '', rightWidth)
    lines.push(left + '│' + right)
  }

  lines.push(hline(termWidth))

  const resultStr = `result: ${formatValue(trace.finalResult)}`
  const keys =
    dim('[←/→] step  [g/G] first/last  [↑/↓] expr scroll  [q] quit') +
    '  ' +
    resultStr
  lines.push(truncate(keys, termWidth))

  return lines.join('\n')
}
