/**
 * Pure functions for generating sample evaluation contexts from an expression.
 * No filesystem access — suitable for use in benchmarks, tests, or CLI scripts.
 */

type ExpressionNode = unknown[] | unknown

function cleanRef(ref: string): string[] {
  return ref.replace('$', '').split('.')
}

function setNestedValue(obj: Record<string, unknown>, pathArray: string[], value: unknown): void {
  let current = obj
  for (let i = 0; i < pathArray.length - 1; i++) {
    const part = pathArray[i]
    if (!(part in current) || typeof current[part] !== 'object' || current[part] === null) {
      current[part] = {}
    }
    current = current[part] as Record<string, unknown>
  }
  current[pathArray[pathArray.length - 1]] = value
}

function extractAllRefs(expr: ExpressionNode, refs: Set<string> = new Set()): Set<string> {
  if (Array.isArray(expr)) {
    for (const item of expr) {
      if (typeof item === 'string' && item.startsWith('$')) {
        refs.add(item)
      } else if (Array.isArray(item)) {
        extractAllRefs(item, refs)
      }
    }
  }
  return refs
}

function buildContextFromRefs(refList: string[]): Record<string, unknown> {
  const ctx: Record<string, unknown> = {}
  for (const ref of refList) {
    const parts = cleanRef(ref)
    let current = ctx as Record<string, unknown>
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (i === parts.length - 1) {
        current[part] = undefined
      } else {
        if (!(part in current)) current[part] = {}
        current = current[part] as Record<string, unknown>
      }
    }
  }
  return ctx
}

const COMPARISON_OPS = ['IN', 'EQ', '==', 'GE', 'GT', 'LE', 'LT', '===']

function makeBranchTrue(branch: ExpressionNode, ctx: Record<string, unknown>): void {
  if (!Array.isArray(branch)) return
  const op = branch[0]

  if (COMPARISON_OPS.includes(op as string)) {
    let ref = branch[1]
    let val = branch[2]
    if (Array.isArray(ref) && ref.length > 0) ref = ref[0]
    if (op === 'IN' && Array.isArray(val) && val.length > 0) val = val[0]
    if (typeof ref === 'string' && ref.startsWith('$')) {
      setNestedValue(ctx, cleanRef(ref), val)
    }
  } else if (op === 'OVERLAP') {
    const refs = branch[1] as string[]
    const vals = branch[2] as unknown[]
    if (Array.isArray(refs) && refs.length > 0) {
      const targetRef = refs[0]
      if (typeof targetRef === 'string' && targetRef.startsWith('$')) {
        setNestedValue(ctx, cleanRef(targetRef), (vals as unknown[])[0])
      }
    }
  } else if (op === 'AND' || op === 'OR') {
    for (let i = 1; i < branch.length; i++) {
      makeBranchTrue(branch[i], ctx)
    }
  }
}

function makeBranchFalse(branch: ExpressionNode, ctx: Record<string, unknown>): void {
  if (!Array.isArray(branch)) return
  const op = branch[0]

  if (COMPARISON_OPS.includes(op as string)) {
    let ref = branch[1]
    if (Array.isArray(ref)) {
      for (const r of ref) {
        if (typeof r === 'string' && r.startsWith('$')) {
          setNestedValue(ctx, cleanRef(r), 'UNMATCHED_VALUE')
        }
      }
      return
    }
    if (typeof ref === 'string' && ref.startsWith('$')) {
      setNestedValue(ctx, cleanRef(ref), 'UNMATCHED_VALUE')
    }
  } else if (op === 'OVERLAP') {
    const refs = branch[1] as string[]
    if (Array.isArray(refs)) {
      for (const ref of refs) {
        if (typeof ref === 'string' && ref.startsWith('$')) {
          setNestedValue(ctx, cleanRef(ref), 'UNMATCHED_VALUE')
        }
      }
    }
  } else if (op === 'AND' || op === 'OR') {
    if (op === 'AND') {
      if (branch.length > 2) {
        makeBranchTrue(branch[1], ctx)
        makeBranchFalse(branch[2], ctx)
      } else {
        makeBranchFalse(branch[1], ctx)
      }
    } else {
      for (let i = 1; i < branch.length; i++) {
        makeBranchFalse(branch[i], ctx)
      }
    }
  }
}

function trySatisfyBranch(branch: ExpressionNode, ctx: Record<string, unknown>): boolean {
  if (!Array.isArray(branch)) return false
  const op = branch[0]

  if (COMPARISON_OPS.includes(op as string)) {
    let ref = branch[1]
    let val = branch[2]
    if (Array.isArray(ref) && ref.length > 0) ref = ref[0]
    if (typeof ref === 'string' && ref.startsWith('$')) {
      if (op === 'IN' && Array.isArray(val) && val.length > 0) val = val[0]
      setNestedValue(ctx, cleanRef(ref as string), val)
      return true
    }
  } else if (op === 'OVERLAP') {
    const refs = branch[1] as string[]
    const vals = branch[2] as unknown[]
    if (Array.isArray(refs) && refs.length > 0) {
      const targetRef = refs[0]
      if (typeof targetRef === 'string' && targetRef.startsWith('$')) {
        setNestedValue(ctx, cleanRef(targetRef), vals[0])
        return true
      }
    }
  } else if (op === 'AND') {
    let allSatisfied = true
    for (let i = 1; i < branch.length; i++) {
      if (!trySatisfyBranch(branch[i], ctx)) allSatisfied = false
    }
    return allSatisfied
  } else if (op === 'OR') {
    for (let i = 1; i < branch.length; i++) {
      if (trySatisfyBranch(branch[i], ctx)) return true
    }
  }
  return false
}

export interface GeneratedCases {
  completeTrue: Record<string, unknown>
  completeFalse: Record<string, unknown>
  partialTrue: Record<string, unknown>
  partialFalse: Record<string, unknown>
  fullExecutionTrue: Record<string, unknown>
  fullExecutionFalse: Record<string, unknown>
}

export function generateCases(expression: ExpressionNode): GeneratedCases {
  const refs = Array.from(extractAllRefs(expression))
  return {
    completeTrue: generateCompleteTrue(expression, refs),
    completeFalse: generateCompleteFalse(refs),
    partialTrue: generatePartialTrue(expression),
    partialFalse: generatePartialFalse(),
    fullExecutionTrue: generateFullExecution(expression, refs, true),
    fullExecutionFalse: generateFullExecution(expression, refs, false),
  }
}

function generateCompleteTrue(expr: ExpressionNode, refs: string[]): Record<string, unknown> {
  const ctx = buildContextFromRefs(refs)
  const satisfied = trySatisfyBranch(expr, ctx)
  if (!satisfied) {
    setNestedValue(ctx, cleanRef(refs[0]), 'MATCH')
  }
  return ctx
}

function generateCompleteFalse(refs: string[]): Record<string, unknown> {
  const ctx = buildContextFromRefs(refs)
  for (const ref of refs) {
    setNestedValue(ctx, cleanRef(ref), 'UNMATCHED_VALUE')
  }
  return ctx
}

function generatePartialTrue(expr: ExpressionNode): Record<string, unknown> {
  const ctx: Record<string, unknown> = {}
  trySatisfyBranch(expr, ctx)
  return ctx
}

function generatePartialFalse(): Record<string, unknown> {
  return { randomKey: 'randomValue' }
}

function generateFullExecution(
  expr: ExpressionNode,
  refs: string[],
  targetResult: boolean
): Record<string, unknown> {
  const ctx = buildContextFromRefs(refs)

  if (!Array.isArray(expr)) return ctx

  if (expr[0] === 'OR') {
    if (targetResult) {
      makeBranchFalse(expr[1], ctx)
      makeBranchTrue(expr[2] ?? expr[1], ctx)
    } else {
      for (let i = 1; i < expr.length; i++) {
        makeBranchFalse(expr[i], ctx)
      }
    }
  } else if (expr[0] === 'AND') {
    if (targetResult) {
      for (let i = 1; i < expr.length; i++) {
        makeBranchTrue(expr[i], ctx)
      }
    } else {
      makeBranchTrue(expr[1], ctx)
      if (expr.length > 2) makeBranchFalse(expr[2], ctx)
    }
  } else {
    targetResult ? makeBranchTrue(expr, ctx) : makeBranchFalse(expr, ctx)
  }

  return ctx
}
