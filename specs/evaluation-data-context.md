# Evaluation Data Context

The evaluation data context is used to provide the expression with variable references, i.e. this allows for the dynamic expressions. The data context is object with properties used as the references keys, and its values as reference values.

> Valid reference values: object, string, number, boolean, string[], number[].

To reference the nested reference, please use "." delimiter, e.g.:
`$address.city`

If the key of the nested reference includes the "." delimiter, please wrap the whole key with backticks `` ` ``, e.g.:
`` $address.`city.code` `` can reference the object

```javascript
{
  address: {
    'city.code': 'TOR'
  }
}
```

``$address.`city.code`[0]`` can reference the object

```javascript
{
  address: {
    'city.code': ['TOR']
  }
}
```

when the value of the nested reference is an array.

## Accessing Array Element

`$options[1]`

## Accessing Array Element via Reference

`$options[{index}]`

- The **index** reference is resolved within the data context as an array index.

## Nested Referencing

`$address.{segment}`

- The **segment** reference is resolved within the data context as a property key.

## Composite Reference Key

`$shape{shapeType}`

- The **shapeType** reference is resolved within the data context, and inserted into the outer reference key.
- E.g. **shapeType** is resolved as "**B**" and would compose the **$shapeB** outer reference.
- This resolution could be n-nested.

## Data Type Casting

`$payment.amount.(Type)`

Cast the given data context into the desired data type before being used as an operand in the evaluation.

> Note: If the conversion is invalid, then a warning message is being logged.

Supported data type conversions:

- .(String): cast a given reference to String.
- .(Number): cast a given reference to Number.

**Example**

```js
// Data context
const ctx = {
  name: 'peter',
  country: 'canada',
  age: 21,
  options: [1, 2, 3],
  address: {
    city: 'Toronto',
    country: 'Canada',
  },
  index: 2,
  segment: 'city',
  shapeA: 'box',
  shapeB: 'circle',
  shapeType: 'B',
}

// Evaluate an expression in the given data context
engine.evaluate(['>', '$age', 20], ctx) // true

// Evaluate an expression in the given data context
engine.evaluate(['==', '$address.city', 'Toronto'], ctx) // true

// Accessing Array Element
engine.evaluate(['==', '$options[1]', 2], ctx) // true

// Accessing Array Element via Reference
engine.evaluate(['==', '$options[{index}]', 3], ctx) // true

// Nested Referencing
engine.evaluate(['==', '$address.{segment}', 'Toronto'], ctx) // true

// Composite Reference Key
engine.evaluate(['==', '$shape{shapeType}', 'circle'], ctx) // true

// Data Type Casting
engine.evaluate(['==', '$age.(String)', '21'], ctx) // true
```
