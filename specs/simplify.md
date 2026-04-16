# Simplify

Simplifies an expression with a given context. This is useful when you already have some of
the properties of context and wants to try to evaluate the expression.

```js
engine.simplify(['AND', ['==', '$a', 10], ['==', '$b', 20]], { a: 10 }) // ['==', '$b', 20]

engine.simplify(['AND', ['==', '$a', 10], ['==', '$b', 20]], { a: 20 }) // false
```

Values not found in the context will cause the parent operand not to be evaluated and returned
as part of the simplified expression.

In some situations we might want to evaluate the expression even if referred value is not
present. You can provide a list of keys that will be strictly evaluated even if they are not
present in the context.

```js
engine.simplify(
  ['AND', ['==', '$a', 10], ['==', '$b', 20]],
  { a: 10 },
  ['b'] // '$b' will be evaluated to undefined.
) // false
```

Alternatively we might want to do the opposite and strictly evaluate the expression for all referred
values not present in the context except for a specified list of optional keys.

```js
engine.simplify(
  ['OR', ['==', '$a', 10], ['==', '$b', 20], ['==', '$c', 20]],
  { c: 10 },
  undefined,
  ['b'] // except for '$b' everything not in context will be evaluated to undefined.
) // ['==', '$b', 20]
```
