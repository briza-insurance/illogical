# Conditional Engine Prototype
The conditional engine used to parse the raw condition expressions defined in the JSON scheme file, evaluate the expression in the given application context (answered questions), and provide access to text form of the given expressions.
> Revision: October 7, 2019

## Engine Options
### Strict Mode
> Default: false

In non-strict mode the parser can perform some expression reduction to optimize the expression. The string from than does not have to have the same structure as the raw expression.

### Parser Options
Below described, are individual options object properties.

#### Reference Predicated
A function used to determine if the operand is a reference type, otherwise evaluated as a static value.

```typescript
referencePredicate: (operand: string) => boolean
```

**Function return:**
* True = reference
* False = value

> **Default reference predicate:**  
> The "\$" symbol at the begging of the operand is used to predicate the reference type., E.g. "\$State", "\$Country".

#### Reference Transform
A function used to transform the operand into the reference annotation stripped form. I.e. remove any annotation used to detect the reference type. E.g. "$Reference" => "Reference".

```typescript
referenceTransform: (operand: string) => string
```

> **Default reference transform:**  
> It removes the "\$" symbol at the begging of the operand name.

#### Operator Mapping
Mapping of the operators. The key is unique operator key, and the value is the key used to represent the  given operator in the raw expression.

```typescript
operatorMapping: Map<symbol, string>
```

> **Default operator mapping:**  

```typescript
// Comparison
[OPERATOR_EQ, '==']
[OPERATOR_NE, '!=']
[OPERATOR_GT, '>']
[OPERATOR_GE, '>=']
[OPERATOR_LT, '<']
[OPERATOR_LE, '<=']
[OPERATOR_IN, 'IN']
[OPERATOR_NOT_IN, 'NOT IN']

// Logical
[OPERATOR_AND, 'AND']
[OPERATOR_OR, 'OR']
[OPERATOR_NOR, 'NOR']
[OPERATOR_XOR, 'XOR']
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
  OPERATOR_AND,
  OPERATOR_OR,
  OPERATOR_NOR,
  OPERATOR_XOR,
} from '...'
````