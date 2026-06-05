# Only use H1 headings for the page title

Write a short paragraph to introduce the page. The developer audience is already
covered with the operator syntax in the documentation. However, we need a higher-level
summary here so that underwriters can quickly get up to speed. Be concise. Be clear.
Be direct.

If the page documents several operators or options, list them as anchor links
right after the intro, so readers can jump to a section:

- [First thing](#first-thing)
- [Second thing](#second-thing)

## Use sentence case for all headings

Write a sentence to introduce sections. More sentences are okay if they are
direct and necessary.

Put `code` that appears in a sentence in code format with back ticks.

Code in blocks requires triple back ticks at the start and end. Tag every block
with its language. Use `js` (not `javascript`), `json`, `ts`, or `sh`:

```js
console.log("Hello, World!");
```

### Use H3 for subsections

Nest H3 headings under an H2 when a section needs parts. Don't skip levels.

## State constraints and notes in a blockquote

Use a blockquote for an operand-type rule, a default, or a note that qualifies
the surrounding text:

> Valid operand types: string, number, boolean.

## Show structured data in a table

Use a table for keyed pairs, such as options, key bindings, or named cases:

| Option | Description |
|--------|-------------|
| `name` | What it does |

## Document an API method with a signature line

For a method, lead with a signature line that mixes code font and cross-page
links, then show an example:

`engine.method(`[Argument](./other-page.md)`)` => `returnType`

```js
engine.method(['==', 5, 5]) // true
```

Label sub-parts of a method in bold when they need calling out:

**Return value:**

- `true` = the thing happened
- `false` = it didn't

## Link to other pages with descriptive text

Link with words that name the target, not "click here": see
[evaluation data context](./evaluation-data-context.md).
