# Statement

Get expression string representation:

`engine.statement(`[Comparison Expression](./comparison-expressions.md) or [Logical Expression](./logical-expressions.md)`)` => `string`

```js
/* Comparison expression */

engine.statement(['==', 5, 5])
// (5 == 5)

engine.statement(['==', 'circle', 'circle'])
// ("circle" == "circle")

engine.statement(['==', true, true])
// (true == true)

engine.statement(['==', '$name', 'peter'], { name: 'peter' })
// ({name} == "peter")

engine.statement(['UNDEFINED', '$RefA'])
// ({RefA} is UNDEFINED)

/* Logical expression */

engine.statement(['AND', ['==', 5, 5], ['==', 10, 10]])
// ((5 == 5) AND (10 == 10))

engine.statement(['AND', ['==', 'circle', 'circle'], ['==', 10, 10]])
// (("circle" == "circle") AND (10 == 10))

engine.statement(['OR', ['==', '$name', 'peter'], ['==', 5, 10]], {
  name: 'peter',
})
// (({name} == "peter") OR (5 == 10))
```
