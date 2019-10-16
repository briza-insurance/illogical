# illogical
A micro conditional engine used to parse the raw logical and comparison expressions, evaluate the expression in the given data context, and provide access to a text form of the given expressions.

## Installation via NPM or Yarn
```sh
npm install -D @briza/illogical
```
```sh
yarn add @briza/illogical -D
```

## Basic Usage
```js
import Engine from '@briza/illogical';

// Create a new instance of the engine
const engine = new Engine();

// Evaluate the raw expression
const result = engine.evaluate(['==', 5, 5]);
```

## Options
### Strict Mode
> Default: false

In non-strict mode the parser performs expression reduction where ever possible to optimize the evaluation process. If strict mode, these would cause an error thrown. 

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
} from '@briza/illogical'
````

## Contributing
When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

### Pull Request Process
1. Fork it
2. Create your feature branch (git checkout -b ft/new-feature-name)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin ft/new-feature-name)
5. Create new Pull Request
> Please make an issue first if the change is likely to increase.

## License
Illogical is released under the MIT license. See [LICENSE.txt](https://github.com/briza-insurance/illogical/blob/master/LICENSE.txt).