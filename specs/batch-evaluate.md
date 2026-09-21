# Batch Evaluation

The `BatchEngine` allows you to evaluate multiple expressions simultaneously, maintain cached results, and perform incremental evaluations using a context-key dependency graph.

**Usage**

```js
import { BatchEngine } from '@briza/illogical'

const expressions = {
  isAdult: ['>=', '$age', 18],
  canDrive: ['AND', ['>=', '$age', 16], ['==', '$hasLicense', true]],
  isVip: ['==', '$tier', 'gold'],
}

const batchEngine = new BatchEngine({ expressions })

// Full evaluation
const results = batchEngine.evaluate({
  age: 20,
  hasLicense: true,
  tier: 'silver',
})
// { isAdult: true, canDrive: true, isVip: false }

// Incremental evaluation (only evaluates expressions depending on 'tier')
const updatedResults = batchEngine.evaluate({ tier: 'gold' }, ['tier'])
// { isAdult: true, canDrive: true, isVip: true }
```

## Dependency Model

`BatchEngine` evaluates expressions based on context-key dependencies:

- **No inter-expression dependencies:** Expressions depend only on context keys (such as `$age` or `$tier`), not directly on the output of other expressions.
- **Evaluation order is independent:** The order of expressions and the order of keys in `changedKeys` do not matter.
- **Single-pass resolution:** All expressions affected by changed keys are resolved together in a single evaluation pass.

## Evaluation Modes

The `evaluate(ctx, changedKeys?)` method supports two modes:

### 1. Full Evaluation (no `changedKeys`)

When `changedKeys` is omitted, the provided context is merged into the internal context state, and every expression in the batch is evaluated.

```js
batchEngine.evaluate({ age: 25, tier: 'gold' })
```

### 2. Incremental Evaluation (with `changedKeys`)

When an array of `changedKeys` is provided, the engine merges the context and only re-evaluates expressions that reference the changed context keys. The remaining expressions return their cached results.

```js
// Only re-evaluates expressions referencing '$tier'
batchEngine.evaluate({ tier: 'platinum' }, ['tier'])

// Providing an empty array acts as a no-op and returns cached results
batchEngine.evaluate({}, [])
```

### Context Merging and Key Removal

Context passed to `evaluate` is merged incrementally into the internal stored context. Setting a context key to `undefined` deletes that key from the stored context.

```js
// Removes 'tier' from the stored context
batchEngine.evaluate({ tier: undefined }, ['tier'])
```

## API Reference

### Constructor

```typescript
new BatchEngine(options: BatchEvaluatorOptions)
```

- `options.expressions`: A key-value record mapping unique expression names to raw expression inputs. Throws a `TypeError` if duplicate names are provided.
- `options.options`: Optional parser options (such as custom `operatorMapping`, `referencePredicate`, or `referenceTransform`).

### `evaluate(ctx, changedKeys?)`

```typescript
evaluate(ctx: Context, changedKeys?: string[]): Record<string, Result>
```

Merges the provided context into the stored context and evaluates expressions. Returns a record mapping expression names to their results.

### `getResults()`

```typescript
getResults(): Record<string, Result>
```

Returns a copy of the current cached results for all expressions in the batch.

### `getDependencies()`

```typescript
getDependencies(): Map<string, string[]>
```

Returns a map where keys are context variable names and values are arrays of expression names that reference them.

### `addExpression(name, expression)`

```typescript
addExpression(name: string, expression: ExpressionInput): void
```

Adds a new expression and rebuilds the dependency graph. Preserves existing cached results. Throws a `TypeError` if the expression name already exists.

### `removeExpression(name)`

```typescript
removeExpression(name: string): void
```

Removes an expression from the batch, clears its cached result, and updates the dependency graph.

### `reset()`

```typescript
reset(): void
```

Clears cached results so expressions can be evaluated cleanly without reparsing.

### `dispose()`

```typescript
dispose(): void
```

Clears all stored expressions, compiled evaluables, dependency graphs, and cached results.
