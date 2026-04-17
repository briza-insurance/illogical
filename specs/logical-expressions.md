# Logical Expressions

- [And](#and)
- [Or](#or)
- [Nor](#nor)
- [Xor](#xor)
- [Not](#not)

## And

The logical AND operator (&&) returns the boolean value TRUE if both operands are TRUE and returns FALSE otherwise.

Expression format: `["AND", Left Operand 1, Right Operand 2, ... , Right Operand N]`.

> Valid operand types: [Comparison Expression](./comparison-expressions.md) or [Nested Logical Expression](./logical-expressions.md).

```json
["AND", ["==", 5, 5], ["==", 10, 10]]
```

```js
engine.evaluate(['AND', ['==', 5, 5], ['==', 10, 10]]) // true
```

## Or

The logical OR operator (||) returns the boolean value TRUE if either or both operands is TRUE and returns FALSE otherwise.

Expression format: `["OR", Left Operand 1, Right Operand 2, ... , Right Operand N]`.

> Valid operand types: [Comparison Expression](./comparison-expressions.md) or [Nested Logical Expression](./logical-expressions.md).

```json
["OR", ["==", 5, 5], ["==", 10, 5]]
```

```js
engine.evaluate(['OR', ['==', 5, 5], ['==', 10, 5]]) // true
```

## Nor

The logical NOR operator returns the boolean value TRUE if both operands are FALSE and returns FALSE otherwise.

Expression format: `["NOR", Left Operand 1, Right Operand 2, ... , Right Operand N]`

> Valid operand types: [Comparison Expression](./comparison-expressions.md) or [Nested Logical Expression](./logical-expressions.md).

```json
["NOR", ["==", 5, 1], ["==", 10, 5]]
```

```js
engine.evaluate(['NOR', ['==', 5, 1], ['==', 10, 5]]) // true
```

## Xor

The logical NOR operator returns the boolean value TRUE if both operands are FALSE and returns FALSE otherwise.

Expression format: `["XOR", Left Operand 1, Right Operand 2, ... , Right Operand N]`

> Valid operand types: [Comparison Expression](./comparison-expressions.md) or [Nested Logical Expression](./logical-expressions.md).

```json
["XOR", ["==", 5, 5], ["==", 10, 5]]
```

```js
engine.evaluate(['XOR', ['==', 5, 5], ['==', 10, 5]]) // true
```

```json
["XOR", ["==", 5, 5], ["==", 10, 10]]
```

```js
engine.evaluate(['XOR', ['==', 5, 5], ['==', 10, 10]]) // false
```

## Not

The logical NOT operator returns the boolean value TRUE if the operand is FALSE, TRUE otherwise.

Expression format: `["NOT", Operand]`

> Valid operand types: [Comparison Expression](./comparison-expressions.md) or [Nested Logical Expression](./logical-expressions.md).

```json
["NOT", ["==", 5, 5]]
```

```js
engine.evaluate(['NOT', ['==', 5, 5]]) // true
```
