# Date Calculation and Comparison

- [Add](#addition)
- [Subtract](#subtraction)

## Addition

Mutates the date operand by adding time.

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

## Subtraction

Mutates the date by subtracting time.

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
