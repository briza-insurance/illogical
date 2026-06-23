# Comparison expressions

A comparison expression is a programming statement that evaluates the relationship
between two values. The expression will return a binary Boolean result. Think of
these like asking a true or false question, such as "Are these two values equal?"

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

Checks whether the two named values (called _operands_) are identical. If identical, returns
_true_.

Expression format: `["==",`[Left Operand](./operand-types.md), [Right Operand](./operand-types.md)`]`.

> Valid operand types: string, number, boolean.

```json
["==", 5, 5]
```

```js
engine.evaluate(['==', 5, 5]) // true
```

## Not equal

Checks whether the two named values (called _operands_) are different. If different, returns
_true_.

Expression format: `["!=",`[Left Operand](./operand-types.md), [Right Operand](./operand-types.md)`]`.

> Valid operand types: string, number, boolean.

```json
["!=", "circle", "square"]
```

```js
engine.evaluate(['!=', 'circle', 'square']) // true
```

## Greater than

Checks whether the left value is larger than the right value. If larger, returns _true_.

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

## Greater than or equal

Checks whether the left value is larger than or the same as the right value. If either larger or
the same, returns _true_.

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

## Less than

Checks whether the left value is smaller than the right value. If larger, returns _true_.

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

## Less than or equal

Checks whether the left value is smaller than or the same as the right value. If either smaller or
the same, returns _true_.

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

Checks whether the named value exists within a list of values. If found in the list, returns _true_.

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

## Not in

Checks whether the named value is absent from a list of values. If absent from the list, returns _true_.

Expression format: `["NOT IN",`[Left Operand](./operand-types.md), [Right Operand](./operand-types.md)`]`.

> Valid operand types: number and number[] or string and string[].

```json
["NOT IN", 10, [1,2,3,4,5]]
["NOT IN", ["circle", "square", "triangle"], "oval"]
```

```js
engine.evaluate(['NOT IN', 10, [1, 2, 3, 4, 5]]) // true
engine.evaluate(['NOT IN', ['circle', 'square', 'triangle'], 'oval']) // true
```

## Prefix

Checks whether the named value exists as the initial part of the named word. If found, returns _true_.

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

Checks whether the named value exists as the final part of the named word. If found, returns _true_.

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

Checks whether any value within one set of values intersects with any value of the other named set.
Remember that one value alone can constitute a set (of one). If one or more common values are found,
returns _true_.

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

Checks whether or not the named reference operand is defined. If it is _not_ defined, returns _true_.

Expression format: `["UNDEFINED",`$[Reference Operand](./operand-types.md#reference)`]`.

```json
["UNDEFINED", "$RefA"]
```

```js
engine.evaluate(['UNDEFINED', '$RefA'], {}) // true
engine.evaluate(['UNDEFINED', '$RefA'], { RefA: undefined }) // true
engine.evaluate(['UNDEFINED', '$RefA'], { RefA: 10 }) // false
```

## Present

Checks whether the named reference operand exists in a given context. If found, returns _true_. If
_not_ found, such as when the operand is _UNDEFINED_ or _NULL_, returns _false_.

Expression format: `["PRESENT",`$[Reference Operand](./operand-types.md#reference)`]`.

```json
["PRESENT", "$RefA"]
```

```js
engine.evaluate(['PRESENT', '$RefA'], {}) // false
engine.evaluate(['PRESENT', '$RefA'], { RefA: undefined }) // false
engine.evaluate(['PRESENT', '$RefA'], { RefA: null }) // false
engine.evaluate(['PRESENT', '$RefA'], { RefA: 10 }) // true
engine.evaluate(['PRESENT', '$RefA'], { RefA: false }) // true
engine.evaluate(['PRESENT', '$RefA'], { RefA: 0 }) // true
```
