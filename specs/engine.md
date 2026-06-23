# Engine options

The options on this page are available to you when you use the illogical engine. These options are object properties. You can use them individually. If you do not set a property, then the engine will use the default option for that property.

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

## Reference predicate

Determines whether the operand is a reference type. Predicate functions in general determine whether something is true or false and so they return a boolean response. If this reference predicate function determines the operand is not a reference type, the operand is evaluated as a static value.

```typescript
referencePredicate: (operand: string) => boolean
```

**Return value:**

- `true` = reference type
- `false` = value type

**Default reference predicate:**

> The `$` symbol is used as a prefix to an operand name that indicates the reference type, for example `$state` or `$country`. See [Operand types](./operand-types.md) to learn more.

## Reference transform

Transforms the operand into the reference annotation stripped form by removing any annotation used to detect the reference type. For example, changes "$reference" => "reference".

```typescript
referenceTransform: (operand: string) => string
```

> **Default reference transform:**
> This transform just removes the `$` symbol from the beginning of the operand name.

## Operator Mapping

This is a map of the operators. The key is the unique operator key, and the value is what is used to represent the given operator in a raw expression.

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

> The operator keys are unique symbols which can be imported from the engine package, like this:

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
