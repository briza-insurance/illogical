# Engine Options

Below described, are individual options object properties which could be used individually. Any missing options will be substituted with the default options.

**Usage**

```js
// Import the illogical engine
import Engine from '@briza/illogical'

// Create a new instance of the engine
const opts = {
  referencePredicate: (operand) => operand.startsWith('$'),
}
const engine = new Engine(opts)
```

## Reference Predicate

A function used to determine if the operand is a reference type, otherwise evaluated as a static value.

```typescript
referencePredicate: (operand: string) => boolean
```

**Return value:**

- `true` = reference type
- `false` = value type

**Default reference predicate:**

> The `$` symbol at the begging of the operand is used to predicate the reference type., E.g. `$State`, `$Country`.

## Reference Transform

A function used to transform the operand into the reference annotation stripped form. I.e. remove any annotation used to detect the reference type. E.g. "$Reference" => "Reference".

```typescript
referenceTransform: (operand: string) => string
```

> **Default reference transform:**
> It removes the `$` symbol at the begging of the operand name.

## Operator Mapping

Mapping of the operators. The key is unique operator key, and the value is the key used to represent the given operator in the raw expression.

```typescript
operatorMapping: Map<symbol, string>
```

**Default operator mapping:**

```typescript
  // Comparison
  [OPERATOR_EQ, '=='],
  [OPERATOR_NE, '!='],
  [OPERATOR_GT, '>'],
  [OPERATOR_GE, '>='],
  [OPERATOR_LT, '<'],
  [OPERATOR_LE, '<='],
  [OPERATOR_IN, 'IN'],
  [OPERATOR_NOT_IN, 'NOT IN'],
  [OPERATOR_PREFIX, 'PREFIX'],
  [OPERATOR_SUFFIX, 'SUFFIX'],
  [OPERATOR_OVERLAP, 'OVERLAP'],
  [OPERATOR_UNDEFINED, 'UNDEFINED'],
  [OPERATOR_PRESENT, 'PRESENT'],
  // Logical
  [OPERATOR_AND, 'AND'],
  [OPERATOR_OR, 'OR'],
  [OPERATOR_NOR, 'NOR'],
  [OPERATOR_XOR, 'XOR'],
  [OPERATOR_NOT, 'NOT'],
  // Arithmetic
  [OPERATOR_SUM, '+'],
  [OPERATOR_SUBTRACT, '-'],
  [OPERATOR_MULTIPLY, '*'],
  [OPERATOR_DIVIDE, '/'],
```

> The operator keys are unique symbols which could be imported from the engine package:

```js
import {
  OPERATOR_EQ,
  OPERATOR_NE,
  OPERATOR_GT,
  OPERATOR_GE,
  OPERATOR_LT,
  OPERATOR_LE,
  OPERATOR_IN,
  OPERATOR_NOT_IN,
  OPERATOR_PREFIX,
  OPERATOR_SUFFIX,
  OPERATOR_OVERLAP,
  OPERATOR_UNDEFINED,
  OPERATOR_PRESENT,
  OPERATOR_AND,
  OPERATOR_OR,
  OPERATOR_NOR,
  OPERATOR_XOR,
  OPERATOR_NOT,
  OPERATOR_DIVIDE,
  OPERATOR_MULTIPLY,
  OPERATOR_SUBTRACT,
  OPERATOR_SUM,
} from '@briza/illogical'
```
