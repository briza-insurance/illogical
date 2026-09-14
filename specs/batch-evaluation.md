# Batch Evaluation

Starting in v3.x, illogical supports **batch evaluation** — a high-performance mode for
evaluating many expressions against the same context. Instead of compiling and evaluating
each expression independently, batch evaluation:

1. Compiles all expressions **once**, sharing resources (refs, consts, locals) across them.
2. Evaluates expressions **incrementally** — only re-evaluating expressions whose context
   dependencies changed.
3. Tracks a **dependency graph** mapping context keys to the expressions that depend on them.

This is ideal for scenarios like:
- **UI state management**: Compute derived values (permissions, visibility, validation)
  from a shared context and update only when relevant keys change.
- **Rule engines**: Evaluate hundreds of business rules against the same data model.
- **Feature flags**: Compute feature availability from layered context (user, org, env).
- **Form validation**: Evaluate all field validations efficiently, re-running only
  affected rules when a field value changes.

## API Overview

The batch evaluation API is accessed through the `Engine` class:

```js
import Engine from '@briza/illogical'

const engine = new Engine()

// Create a batch evaluator with multiple expressions
const batch = engine.createBatchEvaluator({
  expressions: {
    isActive: ['==', '$status', 'active'],
    isPremium: ['==', '$tier', 'premium'],
    canAccess: [
      'AND',
      ['==', '$status', 'active'],
      ['==', '$tier', 'premium'],
    ],
  },
  // Optional parser options
  options: { /* ... */ },
})

// Evaluate all expressions
const results = batch.evaluate({ status: 'active', tier: 'premium' })
// → { isActive: true, isPremium: true, canAccess: true }

// Get cached results without re-evaluating
const cached = batch.getResults()

// Clean up when done
batch.dispose()
```

## BatchEvaluator API

### `evaluate(ctx, changedKeys?)`

Evaluate expressions against the given context. Supports two modes:

| Mode | `changedKeys` | Behavior |
|------|---------------|----------|
| **Mode 1** (full) | `undefined` or omitted | Re-evaluate **all** expressions. Context is merged into stored context. |
| **Mode 2** (incremental) | Array of key names | Re-evaluate **only** expressions affected by the given keys. |
| **Mode 2** (cached) | Empty array `[]` | No-op. Return cached results without any evaluation. |

**Parameters:**
- `ctx` (`Context`): The full evaluation context. Values can be any type. Use `undefined` as a value to delete a key from the stored context.
- `changedKeys` (`string[] | undefined`): Optional list of context keys that have changed. In Mode 2, only expressions that reference these keys are re-evaluated.

**Returns:** `Record<string, Result>` — A new record mapping expression names to their computed results.

**Important — No inter-expression dependencies:** Expressions do **not** depend on each
other's results. Each expression depends only on context keys (e.g., `$status`, `$tier`),
not on the output of other expressions. The dependency graph tracks context-key → expression
mappings, not expression-to-expression relationships.

This means:
- The order of expressions in the batch does not matter.
- The order of keys in `changedKeys` does not matter.
- There is no concept of "expression A must evaluate before expression B."
- All affected expressions are re-evaluated in a single pass.
- If Q2's expression references `$Q1` as a context key, changing Q1 triggers re-evaluation
  of Q2 via the dependency graph — but Q2 depends on the **context key** `Q1`, not on
  Q1's expression result.

### `getResults()`

Returns a copy of the cached results from the last evaluation.

```js
batch.evaluate({ status: 'active', tier: 'premium' })
const results = batch.getResults() // → { isActive: true, isPremium: true, canAccess: true }
```

**Returns:** `Record<string, Result>`

### `getDependencies()`

Get the dependency graph as a readable map.

```js
const deps = batch.getDependencies()
// Map { 'status' => ['isActive', 'canAccess'], 'tier' => ['isPremium', 'canAccess'] }
```

**Returns:** `Map<string, string[]>` — Maps context key → list of expression names that depend on it.

### `reset()`

Clear all cached results and mark all expressions as dirty. The next `evaluate()` call
will re-evaluate all expressions (without recompiling).

### `addExpression(name, expression)`

Add a new expression to the batch. This recompiles the entire batch (Phase 1–3: ref
collection, dependency graph, bytecode compilation). Cached results for existing
expressions are preserved — only the newly added expression starts as dirty.

```js
batch.addExpression('isVip', ['==', '$tier', 'vip'])
```

**Parameters:**
- `name`: Expression name (must be unique)
- `expression`: Raw expression input

**Throws:** `TypeError` if an expression with this name already exists.

### `removeExpression(name)`

Remove an expression from the batch. This recompiles the entire batch. The removed
expression's cached result is cleared, and it is excluded from future evaluations.

```js
batch.removeExpression('isPremium')
```

**Parameters:**
- `name`: Expression name to remove

### `dispose()`

Free all internal caches and resources. After calling `dispose()`, the batch evaluator
should not be used again.

## How It Works

### Compilation (Phase 1–3)

When a `BatchEvaluator` is created or an expression is added/removed, the batch is
compiled in three phases:

1. **Phase 1 — Ref & Const Collection**: All expressions are scanned to collect unique
   context references (`$status`, `$tier`, etc.) and constant arrays (e.g., `['admin',
   'editor']`). These are deduplicated into shared arrays (`sharedRefs[]`, `sharedConsts[]`).

2. **Phase 2 — Dependency Graph**: A graph is built mapping each context key to the
   expressions that reference it. This enables incremental evaluation — when a key
   changes, we know exactly which expressions to re-evaluate.

3. **Phase 3 — Bytecode Compilation**: Each expression is compiled to bytecode using
   the shared refs and consts arrays. Each expression gets its own locals pool to avoid
   interference.

### Dependency Graph

The dependency graph is a `Map<string, DependencyEntry[]>` where:
- **Key**: A context key (without the `$` prefix)
- **Value**: An array of `{ exprName, refIdx }` entries for expressions that reference that key

For example, given:
```js
{
  isActive: ['==', '$status', 'active'],
  canAccess: ['AND', ['==', '$status', 'active'], ['==', '$tier', 'premium']],
}
```

The dependency graph would be:
```
status → [{ exprName: 'isActive', refIdx: 0 }, { exprName: 'canAccess', refIdx: 0 }]
tier   → [{ exprName: 'canAccess', refIdx: 1 }]
```

### Incremental Evaluation (Mode 2)

When `evaluate(ctx, ['status'])` is called:

1. The context is merged into the stored context.
2. The dependency graph is consulted to find all expressions that depend on `'status'`.
3. Only those expressions are re-evaluated (via `interpretBatch` with a dirty set).
4. The results are merged into the cached results.

Expressions that don't depend on the changed keys retain their cached values — they are
not re-evaluated, saving computation.

## Performance Characteristics

### Compilation Cost

Batch compilation is **O(n)** in the total number of refs and consts across all
expressions, with deduplication reducing the actual work. For most use cases,
compilation is a one-time cost paid at creation or when expressions are added/removed.

### Evaluation Cost

- **Mode 1 (full)**: O(m) where m is the number of expressions. Each expression is
  evaluated once using its compiled bytecode.
- **Mode 2 (incremental)**: O(k) where k is the number of expressions affected by the
  changed keys. If only a few keys change and few expressions depend on them, this is
  significantly faster than full evaluation.

### Shared Resources

| Resource | Benefit |
|----------|---------|
| `sharedRefs[]` | Each unique context reference is compiled once, not once per expression |
| `sharedConsts[]` | Identical constant arrays (e.g., `['admin', 'editor']`) are stored once |
| `sharedConstSets[]` | Lazy-built Sets for fast `IN` / `NOT IN` / `OVERLAP` lookups |
| Locals pool | Each expression gets a locals offset range, enabling zero-copy shared evaluation |

### Benchmark Comparison

Benchmarks were run with Node.js v22 on a Mac M2. Results show the trade-offs between
batch and individual evaluation:

| Scenario | Expressions | Incremental Batch | Individual (all) | Speedup |
|----------|-------------|-------------------|------------------|---------|
| Simple, 1 field changes | 1,000 | 26ms | 12ms | 0.45x |
| Complex, 1 field changes | 500 | 14ms | 14ms | 1.0x |
| Full evaluation | 1,000 | 25ms | 8ms | 0.32x |

**Key takeaways:**

- **Simple expressions** (single `==` checks): Individual evaluation is faster due to
  lower overhead. The batch evaluator has per-evaluation costs (dependency graph lookup,
  wrapper function calls, temporary object construction) that outweigh the benefits for
  simple cases.

- **Complex expressions** (nested `AND`/`OR`/`IN`/`>`): Performance is roughly equal.
  The batch evaluator's incremental evaluation helps when few expressions are affected,
  but the individual evaluator's JIT optimization is very efficient.

- **Batch evaluation shines in other dimensions:**
  - **Memory**: Shared refs/consts reduce memory usage significantly with many expressions
  - **Predictable timing**: Batch evaluation has more consistent timing per iteration
  - **Scalability**: As expressions become more complex and numerous, batch overhead
    becomes a smaller fraction of total work

**When to use batch evaluation:**
- You have 100+ expressions that share context keys
- Expressions are complex (nested operators, multiple conditions)
- Memory efficiency matters (shared resources)
- You need incremental evaluation (only re-evaluating affected expressions)

**When individual evaluation is sufficient:**
- Few expressions (< 50)
- Simple expressions (single comparisons)
- One-off evaluation (no repeated context changes)

## Example Usage

### Basic: Feature Flags

```js
const engine = new Engine()

const batch = engine.createBatchEvaluator({
  expressions: {
    showProFeatures: ['==', '$tier', 'pro'],
    showEnterpriseFeatures: ['==', '$tier', 'enterprise'],
    canExport: [
      'OR',
      ['==', '$tier', 'pro'],
      ['AND', ['==', '$tier', 'basic'], ['==', '$hasExport', true]],
    ],
  },
})

// Initial evaluation
const flags = batch.evaluate({ tier: 'pro', hasExport: false })
// → { showProFeatures: true, showEnterpriseFeatures: false, canExport: true }

// Incremental: only tier changed
const flags2 = batch.evaluate({ tier: 'enterprise', hasExport: false }, ['tier'])
// → showProFeatures: true, showEnterpriseFeatures: true, canExport: true
// Only showProFeatures and showEnterpriseFeatures were re-evaluated (not canExport)
```

### Form Validation

```js
const engine = new Engine()

const batch = engine.createBatchEvaluator({
  expressions: {
    canSubmit: [
      'AND',
      ['PRESENT', '$name'],
      ['PRESENT', '$email'],
      ['>', '$age', 18],
    ],
    needsVerification: ['==', '$tier', 'trial'],
  },
})

// Evaluate as user interacts with the form
const results1 = batch.evaluate({ name: 'Alice', email: 'alice@example.com', age: 25, tier: 'trial' })
// → { canSubmit: true, needsVerification: true }

// User changes age to 15 — only canSubmit changes
const results2 = batch.evaluate({ name: 'Alice', email: 'alice@example.com', age: 15, tier: 'trial' }, ['age'])
// → { canSubmit: false, needsVerification: true }
// Only canSubmit was re-evaluated (not needsVerification)
```

### Dynamic Expression Management

```js
const engine = new Engine()

const batch = engine.createBatchEvaluator({
  expressions: {
    isActive: ['==', '$status', 'active'],
  },
})

batch.evaluate({ status: 'active' })
// → { isActive: true }

// Add more expressions dynamically
batch.addExpression('isPremium', ['==', '$tier', 'premium'])
batch.addExpression('canAccess', ['AND', ['==', '$status', 'active'], ['==', '$tier', 'premium']])

const results = batch.evaluate({ status: 'active', tier: 'premium' })
// → { isActive: true, isPremium: true, canAccess: true }

// Remove an expression
batch.removeExpression('isPremium')

const final = batch.evaluate({ status: 'active', tier: 'premium' })
// → { isActive: true, canAccess: true }  // isPremium is gone
```
