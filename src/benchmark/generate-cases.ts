/**
 * Pure functions for generating sample evaluation contexts from an expression.
 * No filesystem access — suitable for use in benchmarks, tests, or CLI scripts.
 */

import type { Context } from '../index.js'

type Expression = [string, ...unknown[]]
type ExpressionNode = Expression | unknown

function isExpression(node: unknown): node is Expression {
  return Array.isArray(node) && node.length > 0 && typeof node[0] === 'string'
}

function cleanRef(ref: string): string[] {
  return ref.replace('$', '').split('.')
}

function isRecord(value: unknown): value is Context {
  return typeof value === 'object' && value !== null
}

function setNestedValue(
  obj: Record<string, unknown>,
  pathArray: string[],
  value: unknown
): void {
  let current = obj
  for (let i = 0; i < pathArray.length - 1; i++) {
    const part = pathArray[i]
    if (!isRecord(current[part])) {
      current[part] = {}
    }
    const next = current[part]
    if (isRecord(next)) {
      current = next
    }
  }
  current[pathArray[pathArray.length - 1]] = value
}

function extractAllRefs(
  expr: ExpressionNode,
  refs: Set<string> = new Set()
): Set<string> {
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

function buildContextFromRefs(refList: string[]): Context {
  const ctx: Context = {}
  for (const ref of refList) {
    setNestedValue(ctx, cleanRef(ref), undefined)
  }
  return ctx
}

const COMPARISON_OPS = ['IN', 'EQ', '==', 'GE', 'GT', 'LE', 'LT', '===']

function makeBranchTrue(
  branch: ExpressionNode,
  ctx: Context
): void {
  if (!isExpression(branch)) {
    return
  }
  const op = branch[0]

  if (COMPARISON_OPS.includes(op)) {
    let ref = branch[1]
    let val = branch[2]
    if (Array.isArray(ref) && ref.length > 0) {
      ref = ref[0]
    }
    if (op === 'IN' && Array.isArray(val) && val.length > 0) {
      val = val[0]
    }
    if (typeof ref === 'string' && ref.startsWith('$')) {
      setNestedValue(ctx, cleanRef(ref), val)
    }
  } else if (op === 'OVERLAP') {
    const refs = branch[1]
    const vals = branch[2]
    if (Array.isArray(refs) && refs.length > 0 && Array.isArray(vals)) {
      const targetRef = refs[0]
      if (typeof targetRef === 'string' && targetRef.startsWith('$')) {
        setNestedValue(ctx, cleanRef(targetRef), vals[0])
      }
    }
  } else if (op === 'AND' || op === 'OR') {
    for (let i = 1; i < branch.length; i++) {
      makeBranchTrue(branch[i], ctx)
    }
  }
}

function makeBranchFalse(
  branch: ExpressionNode,
  ctx: Context
): void {
  if (!isExpression(branch)) {
    return
  }
  const op = branch[0]

  if (COMPARISON_OPS.includes(op)) {
    const ref = branch[1]
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
    const refs = branch[1]
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

function trySatisfyBranch(
  branch: ExpressionNode,
  ctx: Context,
  strategy: 'early' | 'late' = 'early'
): boolean {
  if (!isExpression(branch)) {
    return false
  }
  const op = branch[0]

  if (COMPARISON_OPS.includes(op)) {
    let ref = branch[1]
    let val = branch[2]
    if (Array.isArray(ref)) {
      if (ref.length === 0) {
        return false
      }
      ref = strategy === 'early' ? ref[0] : ref[ref.length - 1]
    }
    if (typeof ref === 'string' && ref.startsWith('$')) {
      if (op === 'IN' && Array.isArray(val) && val.length > 0) {
        val = strategy === 'early' ? val[0] : val[val.length - 1]
      }
      setNestedValue(ctx, cleanRef(ref), val)
      return true
    }
  } else if (op === 'OVERLAP') {
    const refs = branch[1]
    const vals = branch[2]
    if (
      Array.isArray(refs) &&
      refs.length > 0 &&
      Array.isArray(vals) &&
      vals.length > 0
    ) {
      const targetRef = strategy === 'early' ? refs[0] : refs[refs.length - 1]
      const targetVal = strategy === 'early' ? vals[0] : vals[vals.length - 1]
      if (typeof targetRef === 'string' && targetRef.startsWith('$')) {
        setNestedValue(ctx, cleanRef(targetRef), targetVal)
        return true
      }
    }
  } else if (op === 'AND') {
    let allSatisfied = true
    for (let i = 1; i < branch.length; i++) {
      if (!trySatisfyBranch(branch[i], ctx, strategy)) {
        allSatisfied = false
      }
    }
    return allSatisfied
  } else if (op === 'OR') {
    if (strategy === 'early') {
      for (let i = 1; i < branch.length; i++) {
        if (trySatisfyBranch(branch[i], ctx, strategy)) {
          return true
        }
      }
    } else {
      for (let i = branch.length - 1; i >= 1; i--) {
        if (trySatisfyBranch(branch[i], ctx, strategy)) {
          return true
        }
      }
    }
  }
  return false
}

export interface GeneratedCases {
  completeTrue: Context
  completeFalse: Context
  partialTrue: Context
  partialFalse: Context
  fullExecutionTrue: Context
  fullExecutionFalse: Context
  earlyTrue: Context
  lateTrue: Context
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
    earlyTrue: generateTargetTrue(expression, refs, 'early'),
    lateTrue: generateTargetTrue(expression, refs, 'late'),
  }
}

function generateCompleteTrue(
  expr: ExpressionNode,
  refs: string[]
): Context {
  const ctx = buildContextFromRefs(refs)
  const satisfied = trySatisfyBranch(expr, ctx)
  if (!satisfied && refs.length > 0) {
    setNestedValue(ctx, cleanRef(refs[0]), 'MATCH')
  }
  return ctx
}

function generateTargetTrue(
  expr: ExpressionNode,
  refs: string[],
  strategy: 'early' | 'late'
): Context {
  const ctx = buildContextFromRefs(refs)
  const satisfied = trySatisfyBranch(expr, ctx, strategy)
  if (!satisfied && refs.length > 0) {
    const ref = strategy === 'early' ? refs[0] : refs[refs.length - 1]
    setNestedValue(ctx, cleanRef(ref), 'MATCH')
  }
  return ctx
}

function generateCompleteFalse(refs: string[]): Context {
  const ctx = buildContextFromRefs(refs)
  for (const ref of refs) {
    setNestedValue(ctx, cleanRef(ref), 'UNMATCHED_VALUE')
  }
  return ctx
}

function generatePartialTrue(expr: ExpressionNode): Context {
  const ctx: Context = {}
  trySatisfyBranch(expr, ctx)
  return ctx
}

function generatePartialFalse(): Context {
  return { randomKey: 'randomValue' }
}

function generateFullExecution(
  expr: ExpressionNode,
  refs: string[],
  targetResult: boolean
): Context {
  const ctx = buildContextFromRefs(refs)

  if (!isExpression(expr)) {
    return ctx
  }

  if (expr[0] === 'OR') {
    if (targetResult) {
      // satisfy only the last branch
      trySatisfyBranch(expr, ctx, 'late')
    } else {
      makeBranchFalse(expr, ctx)
    }
  } else if (expr[0] === 'AND') {
    if (targetResult) {
      makeBranchTrue(expr, ctx)
    } else {
      // satisfy all but the last
      for (let i = 1; i < expr.length - 1; i++) {
        makeBranchTrue(expr[i], ctx)
      }
      makeBranchFalse(expr[expr.length - 1], ctx)
    }
  } else if (targetResult) {
    makeBranchTrue(expr, ctx)
  } else {
    makeBranchFalse(expr, ctx)
  }

  return ctx
}
