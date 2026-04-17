# Arithmetic Expressions

- [Divide](#division)
- [Multiply](#multiplication)
- [Subtract](#subtraction)
- [Sum](#addition)

Arithmetic Expressions are not supported as root level expressions since they must evaluate to a boolean. But it can be used nested within [Comparisson Expressions](./comparison-expressions.md).

## Division

The arithmetical operator for division produces the quotient of its operands where the left-most operand is the dividend and the subsequent one is the divisor, done from left to right.

Expression format: `["/", First Operand, Second Operand, ... , Nth Operand]`.

> Valid operand types: [Arithmetic Expressions](./arithmetic-expressions.md) or [Operands](./operand-types.md).

```json
["==", ["/", 100, 10], 10]
```

```js
engine.evaluate(['==', ['/', 100, 10], 10]) // true
```

## Multiplication

The arithmetical operator for multiplication produces the product of the operands.

Expression format: `["*", First Operand, Second Operand, ... , Nth Operand]`.

> Valid operand types: [Arithmetic Expressions](./arithmetic-expressions.md) or [Operands](./operand-types.md).

```json
["==", ["*", 100, 10], 10]
```

```js
engine.evaluate(['==', ['*', 10, 10], 100]) // true
```

## Subtraction

The arithmetical operator for subtraction subtracts the operands, producing their difference.

Expression format: `["-", First Operand, Second Operand, ... , Nth Operand]`.

> Valid operand types: [Arithmetic Expressions](./arithmetic-expressions.md) or [Operands](./operand-types.md).

```json
["==", ["-", 20, 10], 10]
```

```js
engine.evaluate(['==', ['-', 20, 10], 10]) // true
```

## Addition

The arithmetical operator for addition produces the sum of the operands.

Expression format: `["+", First Operand, Second Operand, ... , Nth Operand]`.

> Valid operand types: [Arithmetic Expressions](./arithmetic-expressions.md) or [Operands](./operand-types.md).

```json
["==", ["+", 5, 5], 10]
```

```js
engine.evaluate(['==', ['+', 5, 5], 10]) // true
```
