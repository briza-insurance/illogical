<div align="center">
  <!-- PROJECT LOGO -->
  <br />
    <a href="https://github.com/briza-insurance/illogical">
      <img src="specs/header.png" alt="illogical Header">
    </a>
  <br />
  <div align="center">
    <h3 align="center">illogical</h3>
  </div>
</div>

<div align="center">
  <p>
  **illogical** is a JSON DSL (domain-specific language) for expressing and evaluating business rules in the insurance industry. Underwriters use illogical to model business rules for their question sets, enabling distributors to render great user experiences.
  </p>
</div>

<div align="center">
  [![build status](https://github.com/briza-insurance/illogical/actions/workflows/test.yml/badge.svg)](https://github.com/briza-insurance/illogical/actions?branch=master)
  [![npm version](https://badge.fury.io/js/@briza%2Fillogical.svg?icon=si%3Anpm)](https://badge.fury.io/js/@briza%2Fillogical)
  [![install size](https://packagephobia.com/badge?p=@briza/illogical)](https://packagephobia.com/result?p=@briza/illogical)
  ![zero dependencies](https://img.shields.io/badge/0-dependencies-green)
  ![npm downloads](https://img.shields.io/npm/dm/%40briza%2Fillogical)
</div>

---

## 🚀 Getting Started

Get up and running with illogical in just a few steps.

### Installation

```sh
# install illogical
npm install @briza/illogical
```

### Basic Usage

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

## 📚 Documentation

### Core Concepts

Explore the supported expressions and their usage:

- [Comparison Expressions](./specs/comparison-expressions.md)
- [Logical Expressions](./specs/logical-expressions.md)
- [Arithmetic Expressions](./specs/arithmetic-expressions.md)
- [Evaluation Data Context](./specs/evaluation-data-context.md)
- [Operand Types](./specs/operand-types.md)

### API Reference

Learn how to use the engine and its methods:

- [Evaluate](./specs/evaluate.md)
- [Statement](./specs/statement.md)
- [Parse](./specs/parse.md)
- [Simplify](./specs/simplify.md)

### Customization

Customize the engine and the documentation:

- [Engine Options](./specs/engine.md)
- [Code Documentation](https://briza-insurance.github.io/illogical/index.html)

### Development Tools

For advanced usage like bytecode evaluation and debugging:

- [Bytecode Evaluator](./specs/bytecode-evaluator.md)
- [Debugger Tools](./specs/debugger-tools.md)

## 📖 Changelog

See [changelog.md](./changelog.md).

## 🤝 Contributing

See [contributing.md](./contributing.md).

## 📜 License

Illogical is released under the MIT license. See [license.txt](./license.txt) for details.
