# Comparison Expressions

- [Equal](#equal)
- [Not Equal](#not-equal)
- [Greater Than](#greater-than)
- [Greater Than or Equal](#greater-than-or-equal)
- [Less Than](#less-than)
- [Less Than or Equal](#less-than-or-equal)
- [In](#in)
- [Not In](#not-in)
- [Prefix](#prefix)
- [Suffix](#suffix)
- [Overlap](#overlap)
- [Undefined](#undefined)
- [Present](#present)

## Equal

Expression format: `["==",`[Left Operand](./operand-types.md), [Right Operand](./operand-types.md)`]`.

> Valid operand types: string, number, boolean.

```json
["==", 5, 5]
```

```js
engine.evaluate(['==', 5, 5]) // true
```

## Not Equal

Expression format: `["!=",`[Left Operand](./operand-types.md), [Right Operand](./operand-types.md)`]`.

> Valid operand types: string, number, boolean.

```json
["!=", "circle", "square"]
```

```js
engine.evaluate(['!=', 'circle', 'square']) // true
```

## Greater Than

Expression format: `[">",`[Left Operand](./operand-types.md), [Right Operand](./operand-types.md)`]`.

> Valid operand types: number, string.

- String comparison only supports ISO-8601 formatted dates.

```json
[">", 10, 5]
[">", "2023-01-01", "2022-12-31"]
```

```js
engine.evaluate(['>', 10, 5]) // true
engine.evaluate(['>', '2023-01-01', '2022-12-31']) // true
```

## Greater Than or Equal

Expression format: `[">=",`[Left Operand](./operand-types.md), [Right Operand](./operand-types.md)`]`.

> Valid operand types: number, string.

- String comparison only supports ISO-8601 formatted dates.

```json
[">=", 5, 5]
[">=", "2023-01-01",  "2023-01-01"]
```

```js
engine.evaluate(['>=', 5, 5]) // true
engine.evaluate(['>=', '2023-01-01', '2023-01-01']) // true
```

## Less Than

Expression format: `["<",`[Left Operand](./operand-types.md), [Right Operand](./operand-types.md)`]`.

> Valid operand types: number, string.

- String comparison only supports ISO-8601 formatted dates.

```json
["<", 5, 10]
["<", "2022-12-31",  "2023-01-01"]
```

```js
engine.evaluate(['<', 5, 10]) // true
engine.evaluate(['<', '2022-12-31', '2023-01-01']) // true
```

## Less Than or Equal

Expression format: `["<=",`[Left Operand](./operand-types.md), [Right Operand](./operand-types.md)`]`.

> Valid operand types: number, string.

- String comparison only supports ISO-8601 formatted dates.

```json
["<=", 5, 5]
["<=", "2023-01-01",  "2023-01-01"]
```

```js
engine.evaluate(['<=', 5, 5]) // true
engine.evaluate(['<=', '2023-01-01', '2023-01-01']) // true
```

## In

Expression format: `["IN",`[Left Operand](./operand-types.md), [Right Operand](./operand-types.md)`]`.

> Valid operand types: number and number[] or string and string[].

```json
["IN", 5, [1,2,3,4,5]]
["IN", ["circle", "square", "triangle"], "square"]
```

```js
engine.evaluate(['IN', 5, [1, 2, 3, 4, 5]]) // true
engine.evaluate(['IN', ['circle', 'square', 'triangle'], 'square']) // true
```

## Not In

Expression format: `["NOT IN",`[Left Operand](./operand-types.md), [Right Operand](./operand-types.md)`]`.

> Valid operand types: number and number[] or string and string[].

```json
["IN", 10, [1,2,3,4,5]]
["IN", ["circle", "square", "triangle"], "oval"]
```

```js
engine.evaluate(['NOT IN', 10, [1, 2, 3, 4, 5]]) // true
engine.evaluate(['NOT IN', ['circle', 'square', 'triangle'], 'oval']) // true
```

## Prefix

Expression format: `["PREFIX",`[Left Operand](./operand-types.md), [Right Operand](./operand-types.md)`]`.

> Valid operand types: string.

- Left operand is the PREFIX term.
- Right operand is the tested word.

```json
["PREFIX", "hemi", "hemisphere"]
```

```js
engine.evaluate(['PREFIX', 'hemi', 'hemisphere']) // true
engine.evaluate(['PREFIX', 'hemi', 'sphere']) // false
```

## Suffix

Expression format: `["SUFFIX",`[Left Operand](./operand-types.md), [Right Operand](./operand-types.md)`]`.

> Valid operand types: string.

- Left operand is the tested word.
- Right operand is the SUFFIX term.

```json
["SUFFIX", "establishment", "ment"]
```

```js
engine.evaluate(['SUFFIX', 'establishment', 'ment']) // true
engine.evaluate(['SUFFIX', 'establish', 'ment']) // false
```

## Overlap

Expression format: `["OVERLAP",`[Left Operand](./operand-types.md), [Right Operand](./operand-types.md)`]`.

> Valid operand types number[] or string[].

```json
["OVERLAP", [1, 2], [1, 2, 3, 4, 5]]
["OVERLAP", ["circle", "square", "triangle"], ["square"]]
```

```js
engine.evaluate(['OVERLAP', [1, 2, 6], [1, 2, 3, 4, 5]]) // true
engine.evaluate([
  'OVERLAP',
  ['circle', 'square', 'triangle'],
  ['square', 'oval'],
]) // true
```

## Undefined

Expression format: `["UNDEFINED",`[Reference Operand](./operand-types.md#reference)`]`.

```json
["UNDEFINED", "$RefA"]
```

```js
engine.evaluate(['UNDEFINED', 'RefA'], {}) // true
engine.evaluate(['UNDEFINED', 'RefA'], { RefA: undefined }) // true
engine.evaluate(['UNDEFINED', 'RefA'], { RefA: 10 }) // false
```

## Present

Evaluates as FALSE when the operand is UNDEFINED or NULL.

Expression format: `["PRESENT",`[Reference Operand](./operand-types.md#reference)`]`.

```json
["PRESENT", "$RefA"]
```

```js
engine.evaluate(['PRESENT', 'RefA'], {}) // false
engine.evaluate(['PRESENT', 'RefA'], { RefA: undefined }) // false
engine.evaluate(['PRESENT', 'RefA'], { RefA: null }) // false
engine.evaluate(['PRESENT', 'RefA'], { RefA: 10 }) // true
engine.evaluate(['PRESENT', 'RefA'], { RefA: false }) // true
engine.evaluate(['PRESENT', 'RefA'], { RefA: 0 }) // true
```
