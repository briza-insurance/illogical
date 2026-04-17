# Parse

Parse the expression into a evaluable object, i.e. it returns the parsed self-evaluable condition expression.

`engine.parse(`[Comparison Expression](./comparison-expressions.md) or [Logical Expression](./logical-expressions.md)`)` => `evaluable`

## Evaluate Function

- `evaluable.evaluate(context)` please see [Evaluation Data Context](./evaluation-data-context.md).
- `evaluable.toString()` please see [Statement](./statement.md).

```js
let evaluable = engine.parse(['==', '$name', 'peter'])

evaluable.evaluate({ name: 'peter' }) // true

evaluable.toString()
// ({name} == "peter")
```
