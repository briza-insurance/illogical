# Operand Types

The [Comparison Expression](./comparison-expressions.md) expect operands to be one of the below:

## Value

Simple value types: string, number, boolean.

```js
;['==', 5, 5][('==', 'circle', 'circle')][('==', true, true)]
```

## Reference

The reference operand value is resolved from the [Evaluation Data Context](./evaluation-data-context.md), where the operands name is used as key in the context.

The reference operand must be prefixed with `$` symbol, e.g.: `$name`. This can be customized via [Reference Predicate Parser Option](./engine.md#reference-predicate).

| Expression                    | Data Context                          |
| ----------------------------- | ------------------------------------- |
| `['==', '$age', 21]`          | `{age: 21}`                           |
| `['==', 'circle', '$shape']`  | `{shape: 'circle'}`                   |
| `['==', '$visible', true]`    | `{visible: true}`                     |
| `['==', '$circle', '$shape']` | `{circle: 'circle', shape: 'circle'}` |

## Collection

The operand could be an array mixed from [Value](#value) and [Reference](#reference).

| Expression                              | Data Context                        |
| --------------------------------------- | ----------------------------------- |
| `['IN', [1, 2], 1]`                     | `{}`                                |
| `['IN', 'circle', ['$shapeA', $shapeB]` | `{shapeA: 'circle', shapeB: 'box'}` |
| `['IN', [$number, 5], 5]`               | `{number: 3}`                       |
