<div align="center">
  <!-- PROJECT LOGO -->
  <br />
    <a href="https://github.com/briza-insurance/illogical">
      <img src="specs/header.jpg" alt="illogical Header">
    </a>
  <br />
  <div align="center">
    <h3 align="center">illogical</h3>
  </div>

[![Build Status](https://github.com/briza-insurance/illogical/actions/workflows/test.yml/badge.svg)](https://github.com/briza-insurance/illogical/actions?branch=master)
[![npm version](https://badge.fury.io/js/@briza%2Fillogical.svg?icon=si%3Anpm)](https://badge.fury.io/js/@briza%2Fillogical)
[![install size](https://packagephobia.com/badge?p=@briza/illogical)](https://packagephobia.com/result?p=@briza/illogical)
![NPM Downloads](https://img.shields.io/npm/dm/%40briza%2Fillogical)

</div>

<div align="center">
<p>
<br />
A micro conditional javascript engine used to parse the raw logical
and comparison expressions, evaluate the expression in the given data context,
and provide access to a text form of the given expressions.
</p>
</div>

---

This project is designed such that business rules can be shared between the front-end and back-end, serialized in JSON.

## 🚀 Get Started

```sh
# install illogical
npm install @briza/illogical
```

```js
// Import the illogical engine
import Engine from '@briza/illogical'

// Create a new instance of the engine
const engine = new Engine()

// Data context
const ctx = {
  name: 'peter',
  age: 21,
  address: {
    city: 'Toronto',
    country: 'Canada',
  },
}

// Evaluate an expression in the given data context
engine.evaluate(['>', '$age', 20], ctx) // true

// Accessing a property
engine.evaluate(['==', '$address.city', 'Toronto'], ctx) // true

// Data Type Casting
engine.evaluate(['==', '$age.(String)', '21'], ctx) // true

// Evaluate a logical expression
engine.evaluate(['AND', ['>', '$age', 20], ['==', '$name', 'peter']]) // true
```

## 🖼️ Resources

Understand supported expressions:

- [Comparison Expressions](./specs/comparison-expressions.md)
- [Logical Expressions](./specs/logical-expressions.md)
- [Arithmetic Expressions](./specs/arithmetic-expressions.md)
- [Evaluation Data Context](./specs/evaluation-data-context.md)
- [Operand Types](./specs/operand-types.md)

Learn about usages:

- [Evaluate](./specs/evaluate.md)
- [Statement](./specs/statement.md)
- [Parse](./specs/parse.md)
- [Simplify](./specs/simplify.md)

Customize the engine and the documentation:

- [Engine Options](./specs/engine.md)
- [Code Documentation](https://briza-insurance.github.io/illogical/index.html)

## 🤝 Contributing

See [contributing.md](./contributing.md).

## 📜 License

Illogical is released under the MIT license. See [license.txt](./license.txt) for details.
