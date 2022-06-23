# illogical changelog

## 1.5.5

- Expose default options for parser
- Expose isEvaluable
- Performance improvements in references

## 1.5.4

- Update dependencies.

## 1.5.3

- Fixed an issue where conditions with object data were not being simplified correctly.

## 1.5.2

- Update dependencies.

## 1.5.1

- Fix issue with nested conditions not being completely simplified.

## 1.5.0

- Add simplify capability to strictly evaluate the expression for all referred values
  not present in the context except for a specified list of optional keys

## 1.4.3

- Prevent unexpected parsing of any expression used as an operand in a comparison expression

## 1.4.2

- Change `@babel/env` preset target to `> 1%, node 12`

## 1.4.0

- Add support for reference variable data type casting before expression evaluation

## 1.3.0

- Add simplify method in the engine to simplify expressions

## 1.2.4

- Add support for array element targeting within reference operand key
- Add support for array element targeting via reference within reference operand key
- Add support for nested key resolution within reference operand key
- Add support for composite key resolution within reference operand key

## 1.2.3

- Add support for null and undefined in isObject() method

## 1.2.2

- Add Present comparison expression.

## 1.2.1

- Allow zero argument logical expressions to be treated as a collection.
- Allow logical expressions without any inner expressions to be treated as a collection.

## 1.2.0

- Simplification of the codebase.
- Add Not logical expression.
- Breaking change: removed parser strict mode.

## 1.1.5

- Operand of array value now correctly resolves references.

## 1.1.4

- Add Overlap comparison expression.

## 1.1.3

- Add predicate expression types.
- Add Undefined predicate expression.

## 1.1.2

- Value operand supports null and undefined as values.

## 1.1.1

- Invalid logical/comparison expression throw exception.

## 1.1.0

- Add Prefix comparison operator.
- Add Suffix comparison operator.

## 1.0.3

- Update readme.

## 1.0.2

- Add support for nested data context.

## 1.0.1

- Add typescript types path into package.json.

## 1.0.0

- Initial release.
