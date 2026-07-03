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

  <p>
  <strong>illogical</strong> is a JSON DSL (domain-specific language) for expressing and evaluating business rules in the insurance industry. Underwriters use illogical to model business rules for their question sets, enabling distributors to render great user experiences.
  </p>

[![build status](https://github.com/briza-insurance/illogical/actions/workflows/test.yml/badge.svg)](https://github.com/briza-insurance/illogical/actions?branch=master)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/briza-insurance/illogical/badge)](https://scorecard.dev/viewer/?uri=github.com/briza-insurance/illogical)
[![npm version](https://badge.fury.io/js/@briza%2Fillogical.svg?icon=si%3Anpm)](https://badge.fury.io/js/@briza%2Fillogical)
[![install size](https://packagephobia.com/badge?p=@briza/illogical)](https://packagephobia.com/result?p=@briza/illogical)
![zero dependencies](https://img.shields.io/badge/0-dependencies-green)
![npm downloads](https://img.shields.io/npm/dm/%40briza%2Fillogical)

</div>

---

## 🚀 Getting Started

Get up and running with illogical in just a few steps.

Read the [Background](#background) section to quickly understand what illogical is and why it exists. 

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

### Background

**illogical** is a JSON DSL (domain-specific language) for expressing and evaluating business rules in the insurance industry.

Domain-specific languages exist to streamline work in a given domain by providing the means of performing tasks in a way that is quicker to learn and implement. This lets you optimize your custom solution and tailor it for use by distinct user groups or within unique contexts.

Developers of software for insurance underwriters can enable illogical quickly and easily to make the underwriter's task of writing question sets for programmatic use more efficient by eliminating the need to learn and understand the programming language(s) in use.

The way it works is that underwriters use the illogical JSON DSL to express their underwriting models, specifically their question sets and business rules. Then, the JavaScript functions in illogical parse what has been written for use within an application.

Another way to think about this is that illogical is used to define machine-readable business rules for underwriting models and question sets that brokers and distribution partners can easily consume. This is much more efficient than the traditional use of spreadsheets, documents, PDFs, email exchanges, and other non-machine-readable formats that then must be translated before being used. illogical speeds up the integration process, gets your rules to market faster, and does so with significantly reduced submission errors and a lower total cost of ownership.

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
