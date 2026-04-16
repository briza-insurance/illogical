# Evaluate

Evaluate comparison or logical expression as TRUE or FALSE result:

`engine.evaluate(`[Comparison Expression](./comparison-expressions.md) or [Logical Expression](./logical-expressions.md), [Evaluation Data Context](./evaluation-data-context.md)`)` => `boolean`

> Data context is optional.

```js
// Comparison expression
engine.evaluate(['==', 5, 5])
engine.evaluate(['==', 'circle', 'circle'])
engine.evaluate(['==', true, true])
engine.evaluate(['==', '$name', 'peter'], { name: 'peter' })
engine.evaluate(['UNDEFINED', '$RefA'], {})

// Logical expression
engine.evaluate(['AND', ['==', 5, 5], ['==', 10, 10]])
engine.evaluate(['AND', ['==', 'circle', 'circle'], ['==', 10, 10]])
engine.evaluate(['OR', ['==', '$name', 'peter'], ['==', 5, 10]], {
  name: 'peter',
})
```
