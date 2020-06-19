# illogical
A micro conditional javascript engine used to parse the raw logical and comparison expressions, evaluate the expression in the given data context, and provide access to a text form of the given expressions.

> Revision: June 19, 2020.

## About
This project has been developed to provide a shared conditional logic between front-end and back-end code, stored in JSON or in any other data serialization format. 

> Code documentation could be found here: https://briza-insurance.github.io/illogical/index.html.

> The library is being build as **CommonJS** module and **ESM**.  

## Installation via NPM or Yarn
```sh
npm install -D @briza/illogical
```
```sh
yarn add @briza/illogical -D
```

**Table of Content**

---

- [Basic Usage](#basic-usage)
  - [Evaluate](#evaluate)
  - [Statement](#statement)
  - [Parse](#parse)
    - [Evaluable Function](#evaluable-function)
- [Working with Expressions](#working-with-expressions)
  - [Evaluation Data Context](#evaluation-data-context)
  - [Operand Types](#operand-types)
    - [Value](#value)
    - [Reference](#reference)
    - [Collection](#collection)
  - [Comparison Expressions](#comparison-expressions)
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
  - [Logical Expressions](#logical-expressions)
    - [And](#and)
    - [Or](#or)
    - [Nor](#nor)
    - [Xor](#xor)
    - [Not](#not)
- [Engine Options](#engine-options)
  - [Parser Options](#parser-options)
    - [Reference Predicate](#reference-predicate)
    - [Reference Transform](#reference-transform)
    - [Operator Mapping](#operator-mapping)
- [Breaking Changes](#breaking-changes)
  - [v1.2.0](#v120)
- [Contributing](#contributing)
  - [Pull Request Process](#pull-request-process)
- [License](#license)
---


## Basic Usage
```js
// Import the illogical engine
import Engine from '@briza/illogical';

// Create a new instance of the engine
const engine = new Engine();

// Evaluate the raw expression
const result = engine.evaluate(['==', 5, 5]);
```

> For advanced usage, please [Engine Options](#engine-options).

### Evaluate
Evaluate comparison or logical expression as TRUE or FALSE result:

```engine.evaluate(```[Comparison Expression](#comparison-expressions) or [Logical Expression](#logical-expressions), [Evaluation Data Context](#evaluation-data-context)```)``` => ```boolean```

> Data context is optional.

**Example**
```js
// Comparison expression
engine.evaluate(['==', 5, 5]);
engine.evaluate(['==', 'circle', 'circle']);
engine.evaluate(['==', true, true]);
engine.evaluate(['==', '$name', 'peter'], {name: 'peter'});
engine.evaluate(['UNDEFINED', '$RefA'], {});

// Logical expression
engine.evaluate([
  'AND',
  ['==', 5, 5],
  ['==', 10, 10]
]);
engine.evaluate([
  'AND',
  ['==', 'circle', 'circle'],
  ['==', 10, 10]
]);
engine.evaluate([
  'OR',
  ['==', '$name', 'peter'],
  ['==', 5, 10]
], {name: 'peter'});
```

### Statement
Get expression string representation:

```engine.statement(```[Comparison Expression](#comparison-expressions) or [Logical Expression](#logical-expressions)```)```  => ```string```

**Example**
```js
/* Comparison expression */

engine.statement(['==', 5, 5]);
// (5 == 5)

engine.statement(['==', 'circle', 'circle']);
// ("circle" == "circle")

engine.statement(['==', true, true]);
// (true == true)

engine.statement(['==', '$name', 'peter'], {name: 'peter'});
// ({name} == "peter")

engine.statement(['UNDEFINED', '$RefA']);
// ({RefA} is UNDEFINED)

/* Logical expression */

engine.statement([
  'AND',
  ['==', 5, 5],
  ['==', 10, 10]
]);
// ((5 == 5) AND (10 == 10))

engine.statement([
  'AND',
  ['==', 'circle', 'circle'],
  ['==', 10, 10]
]);
// (("circle" == "circle") AND (10 == 10))

engine.statement([
  'OR',
  ['==', '$name', 'peter'],
  ['==', 5, 10]
], {name: 'peter'});
// (({name} == "peter") OR (5 == 10))
```

### Parse
Parse the expression into a evaluable object, i.e. it returns the parsed self-evaluable condition expression.

```engine.parse(```[Comparison Expression](#comparison-expressions) or [Logical Expression](#logical-expressions)```)```  => ```evaluable```

#### Evaluate Function
- ```evaluable.evaluate(context)``` please see [Evaluation Data Context](#evaluation-data-context).
- ```evaluable.toString()``` please see [Statement](#statement).

**Example**
```js
let evaluable = engine.parse(['==', '$name', 'peter']);

evaluable.evaluate({name: 'peter'}); // true

evaluable.toString();
// ({name} == "peter")
```

## Working with Expressions
### Evaluation Data Context
The evaluation data context is used to provide the expression with variable references, i.e. this allows for the dynamic expressions. The data context is object with properties used as the references keys, and its values as reference values.

> Valid reference values: object, string, number, boolean, string[], number[].

To reference the nested reference, please use "." delimiter, e.g.:
```$address.city```

**Example**
```js
// Data context
const ctx = {
  name: 'peter',
  country: 'canada',
  age: 21,
  options: [1,2,3],
  address: {
    city: 'Toronto',
    country: 'Canada',
  }
}

// Evaluate an expression in the given data context
engine.evaluate(['>', '$age', 20], ctx); // true

// Evaluate an expression in the given data context
engine.evaluate(['==', '$address.city', 'Toronto'], ctx); // true
```

### Operand Types
The [Comparison Expression](#comparison-expression) expect operands to be one of the below:

#### Value
Simple value types: string, number, boolean.

**Example**
```js
['==', 5, 5]
['==', 'circle', 'circle']
['==', true, true]
```

#### Reference
The reference operand's value is resolved from the [Evaluation Data Context](#evaluation-data-context), where the the operands name is used as key in the context.

The reference operand must be prefixed with ```$``` symbol, e.g.: ```$name```. This might be customized via [Reference Predicate Parser Option](#reference-predicate).

**Example**

| Expression  | Data Context |
| ------------- | --- |
| ```['==', '$age', 21]``` | ```{age: 21}``` |
| ```['==', 'circle', '$shape'] ``` | ```{age: 'circle'}``` |
| ```['==', '$visible', true]``` | ```{visible: true}``` |

#### Collection
The operand could be an array mixed from [Value](#value) and [Reference](#reference).

**Example**

| Expression  | Data Context |
| ------------- | --- |
| ```['IN', [1, 2], 1]``` | ```{}``` |
| ```['IN', 'circle', ['$shapeA', $shapeB] ``` | ```{shapeA: 'circle', shapeB: 'box'}``` |
| ```['IN', [$number, 5], 5]``` | ```{number: 3}``` |

### Comparison Expressions

#### Equal
Expression format: ```["==", ```[Left Operand](#operand-types), [Right Operand](#operand-types)```]```.
> Valid operand types: string, number, boolean.
```json
["==", 5, 5]
```
```js
engine.evaluate(['==', 5, 5]); // true
```

#### Not Equal
Expression format: ```["!=", ```[Left Operand](#operand-types), [Right Operand](#operand-types)```]```.
> Valid operand types: string, number, boolean.
```json
["!=", "circle", "square"]
```
```js
engine.evaluate(['!=', 'circle', 'square']); // true
```

#### Greater Than
Expression format: ```[">", ```[Left Operand](#operand-types), [Right Operand](#operand-types)```]```.
> Valid operand types: number.
```json
[">", 10, 5]
```
```js
engine.evaluate(['>', 10, 5]); // true
```

#### Greater Than or Equal
Expression format: ```[">=", ```[Left Operand](#operand-types), [Right Operand](#operand-types)```]```.
> Valid operand types: number.
```json
[">=", 5, 5]
```
```js
engine.evaluate(['>=', 5, 5]); // true
```

#### Less Than
Expression format: ```["<", ```[Left Operand](#operand-types), [Right Operand](#operand-types)```]```.
> Valid operand types: number.
```json
["<", 5, 10]
```
```js
engine.evaluate(['<', 5, 10]); // true
```

#### Less Than or Equal
Expression format: ```["<=", ```[Left Operand](#operand-types), [Right Operand](#operand-types)```]```.
> Valid operand types: number.
```json
["<=", 5, 5]
```
```js
engine.evaluate(['<=', 5, 5]); // true
```

#### In
Expression format: ```["IN", ```[Left Operand](#operand-types), [Right Operand](#operand-types)```]```.
> Valid operand types: number and number[] or string and string[].
```json
["IN", 5, [1,2,3,4,5]]
["IN", ["circle", "square", "triangle"], "square"]
```
```js
engine.evaluate(['IN', 5, [1,2,3,4,5]]); // true
engine.evaluate(['IN', ['circle', 'square', 'triangle'], 'square']); // true
```

#### Not In
Expression format: ```["NOT IN", ```[Left Operand](#operand-types), [Right Operand](#operand-types)```]```.
> Valid operand types: number and number[] or string and string[].
```json
["IN", 10, [1,2,3,4,5]]
["IN", ["circle", "square", "triangle"], "oval"]
```
```js
engine.evaluate(['NOT IN', 10, [1,2,3,4,5]]); // true
engine.evaluate(['NOT IN', ['circle', 'square', 'triangle'], 'oval']); // true
```

#### Prefix
Expression format: ```["PREFIX", ```[Left Operand](#operand-types), [Right Operand](#operand-types)```]```.
> Valid operand types: string.

* Left operand is the PREFIX term.
* Right operand is the tested word.

```json
["PREFIX", "hemi", "hemisphere"]
```
```js
engine.evaluate(['PREFIX', "hemi", "hemisphere"]); // true
engine.evaluate(['PREFIX', "hemi", "sphere"]); // false
```

#### Suffix
Expression format: ```["SUFFIX", ```[Left Operand](#operand-types), [Right Operand](#operand-types)```]```.
> Valid operand types: string.

* Left operand is the tested word.
* Right operand is the SUFFIX term.
  
```json
["SUFFIX", "establishment", "ment"]
```
```js
engine.evaluate(['SUFFIX', "establishment", "ment"]); // true
engine.evaluate(['SUFFIX', "establish", "ment"]); // false
```

#### Overlap
Expression format: ```["OVERLAP", ```[Left Operand](#operand-types), [Right Operand](#operand-types)```]```.
> Valid operand types number[] or string[].

```json
["OVERLAP", [1, 2], [1, 2, 3, 4, 5]]
["OVERLAP", ["circle", "square", "triangle"], ["square"]]
```
```js
engine.evaluate(['OVERLAP', [1, 2, 6], [1, 2, 3, 4, 5]]); // true
engine.evaluate(['OVERLAP', ['circle', 'square', 'triangle'], ['square', 'oval']]); // true
```

#### Undefined
Expression format: ```["UNDEFINED", ```[Reference Operand](#reference)```]```.
```json
["UNDEFINED", "$RefA"]
```
```js
engine.evaluate(['UNDEFINED', 'RefA'], {}); // true
engine.evaluate(['UNDEFINED', 'RefA'], { RefA: undefined }); // true
engine.evaluate(['UNDEFINED', 'RefA'], { RefA: 10 }); // false
```

### Logical Expressions

#### And
The logical AND operator (&&) returns the boolean value TRUE if both operands are TRUE and returns FALSE otherwise.

Expression format: ```["AND", Left Operand 1, Right Operand 2, ... , Right Operand N]```.
> Valid operand types: [Comparison Expression](#comparison-expressions) or [Nested Logical Expression](#logical-expressions).
```json
[
  "AND",
  ["==", 5, 5],
  ["==", 10, 10]
]
```
```js
engine.evaluate(['AND', ['==', 5, 5], ['==', 10, 10]]); // true
```

#### Or
The logical OR operator (||) returns the boolean value TRUE if either or both operands is TRUE and returns FALSE otherwise. 

Expression format: ```["OR", Left Operand 1, Right Operand 2, ... , Right Operand N]```.
> Valid operand types: [Comparison Expression](#comparison-expressions) or [Nested Logical Expression](#logical-expressions).
```json
[
  "OR",
  ["==", 5, 5],
  ["==", 10, 5]
]
```
```js
engine.evaluate(['OR', ['==', 5, 5], ['==', 10, 5]]); // true
```

#### Nor
The logical NOR operator returns the boolean value TRUE if both operands are FALSE and returns FALSE otherwise. 

Expression format: ```["NOR", Left Operand 1, Right Operand 2, ... , Right Operand N]```
> Valid operand types: [Comparison Expression](#comparison-expressions) or [Nested Logical Expression](#logical-expressions).
```json
[
  "NOR",
  ["==", 5, 1],
  ["==", 10, 5]
]
```
```js
engine.evaluate(['NOR', ['==', 5, 1], ['==', 10, 5]]); // true
```

#### Xor
The logical NOR operator returns the boolean value TRUE if both operands are FALSE and returns FALSE otherwise. 

Expression format: ```["XOR", Left Operand 1, Right Operand 2, ... , Right Operand N]```
> Valid operand types: [Comparison Expression](#comparison-expressions) or [Nested Logical Expression](#logical-expressions).
```json
[
  "XOR",
  ["==", 5, 5],
  ["==", 10, 5],
]
```
```js
engine.evaluate(['XOR', ['==', 5, 5], ['==', 10, 5]]); // true
```
```json
[
  "XOR",
  ["==", 5, 5],
  ["==", 10, 10],
]
```
```js
engine.evaluate(['XOR', ['==', 5, 5], ['==', 10, 10]]); // false
```

#### Not
The logical NOT operator returns the boolean value TRUE if the operand is FALSE, TRUE otherwise. 

Expression format: ```["NOT", Operand]```
> Valid operand types: [Comparison Expression](#comparison-expressions) or [Nested Logical Expression](#logical-expressions).
```json
[
  "NOT",
  ["==", 5, 5],
]
```
```js
engine.evaluate(['NOT', ['==', 5, 5]]); // true
```

## Engine Options

### Parser Options
Below described, are individual options object properties which could be used individually. Any missing options will be substituted with the default options.

**Usage**
```js
// Import the illogical engine
import Engine from '@briza/illogical';

// Create a new instance of the engine
const opts = {
  referencePredicate: (operand) => operand.startsWith('$'),
};
const engine = new Engine(opts);
```

#### Reference Predicate
A function used to determine if the operand is a reference type, otherwise evaluated as a static value.

```typescript
referencePredicate: (operand: string) => boolean
```

**Return value:**
* ```true``` = reference type
* ```false``` = value type

**Default reference predicate:**  
> The ```$``` symbol at the begging of the operand is used to predicate the reference type., E.g. ```$State```, ```$Country```.

#### Reference Transform
A function used to transform the operand into the reference annotation stripped form. I.e. remove any annotation used to detect the reference type. E.g. "$Reference" => "Reference".

```typescript
referenceTransform: (operand: string) => string
```

> **Default reference transform:**  
> It removes the ```$``` symbol at the begging of the operand name.

#### Operator Mapping
Mapping of the operators. The key is unique operator key, and the value is the key used to represent the given operator in the raw expression.

```typescript
operatorMapping: Map<symbol, string>
```

**Default operator mapping:**  

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
[OPERATOR_PREFIX, 'PREFIX']
[OPERATOR_SUFFIX, 'SUFFIX']
[OPERATOR_OVERLAP, 'OVERLAP']
[OPERATOR_UNDEFINED, 'UNDEFINED']

// Logical
[OPERATOR_AND, 'AND']
[OPERATOR_OR, 'OR']
[OPERATOR_NOR, 'NOR']
[OPERATOR_XOR, 'XOR']
[OPERATOR_NOT, 'NOT']
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
  OPERATOR_UNDEFINEDINED,
  OPERATOR_AND,
  OPERATOR_OR,
  OPERATOR_NOR,
  OPERATOR_XOR,
  OPERATOR_NOT
} from '@briza/illogical'
```

## Breaking Changes

### v1.2.0
* Removed **strict** mode from the Engine constructor options.
```const engine = new Engine(strictMode, opts);``` -> ```const engine = new Engine(opts);```

---

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