# Bytecode Evaluator

Starting in v2.1, illogical supports a bytecode evaluation mode that compiles expressions to a
flat bytecode array and interprets them with zero allocations in the hot path. This can provide
significant performance improvements for high-throughput scenarios.

## Switching to Bytecode Mode

Pass the `evaluator` option when creating the engine:

```js
const engine = new Engine({ evaluator: 'bytecode' })
```

- `'oop'` (default): evaluates using the classic OOP evaluable tree.
- `'bytecode'`: compiles expressions to bytecode and interprets them.

The bytecode compiler caches compiled results per unique expression using a `WeakMap`, so
compilation only happens once per expression and is reused across `evaluate()` calls.

## How It Works

1. The **compiler** (`src/bytecode/compiler.ts`) transforms a raw expression array into a flat
   bytecode array.
2. The **interpreter** (`src/bytecode/interpreter.ts`) executes the bytecode against a context
   object using a pre-allocated stack with zero allocations in the hot path.
3. The **simplifier** (`src/bytecode/simplifier.ts`) handles bytecode-based simplification with
   the same `strictKeys` / `optionalKeys` semantics.

## BytecodeEvaluable

When using bytecode mode, `engine.parse()` returns a `BytecodeEvaluable` that wraps both the
compiled bytecode and the delegate expression. It implements the same `Evaluable` interface:

```js
const evaluable = engine.parse(['AND', ['==', '$a', 10], ['==', '$b', 20]])
evaluable.evaluate({ a: 10, b: 20 })  // true
evaluable.toString()                   // "({a} == 10) AND ({b} == 20)"
```

