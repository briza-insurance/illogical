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

Subtraction can also mutate a date by subtracting a time duration.

Expression format: `["-", First Operand, "7d", "1m", ...]`.

```js
engine.evaluate(['==', ['-', '2026-01-01', '5d'], '2025-12-27']) // true
engine.evaluate(['==', ['-', '2010-03-31', '1m'], '2010-02-28']) // true
engine.evaluate(['==', ['-', '2024-02-29', '1y'], '2023-02-28']) // true
engine.evaluate(['==', ['-', '2024-02-29', '1y', '1m'], '2023-01-28']) // true
```

## Date String Interpolation

```js
// assuming $CurrentDate is 2026-05-10 and $CurrentYear is 2026
engine.evaluate(['<', '2025-12-31', '`$CurrentYear`-01-01']) // true
engine.evaluate(['>', ['-', '$CurrentDate', '1m'], '`$CurrentYear`-02-02']) // true
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

Addition can also mutate a date by adding a time duration.

Expression format: `["+", First Operand, "7d", "1m", ...]`.

Valid format for the time is a combination of an integer and a time unit. Valid time units are:

- `d` days
- `m` months
- `y` years

```js
engine.evaluate(['==', ['+', '2026-01-01', '5d'], '2026-01-06']) // true
engine.evaluate(['==', ['+', '2010-01-31', '3m'], '2010-04-30']) // true
engine.evaluate(['==', ['+', '2024-02-29', '2y'], '2026-02-28']) // true
engine.evaluate(['==', ['+', '2024-02-29', '2y', '2d'], '2026-03-02']) // true
```
