## Testing

This project uses the native Node.js test runner.

### Running Tests

**Run all tests in the workspace**

```bash
npm run test
```

**Run a specific test file**

```bash
npm run test -- src/__test__/unit/simplify.test.ts
```

**Run a specific test case within a file**

You can filter test execution to matching test descriptions using Node's `--test-name-pattern` flag. Make sure you place the flag before the test file path:

```bash
npm run test -- --test-name-pattern="All context values known, expression resolves to true" src/__test__/unit/simplify.test.ts

npm run test -- --test-name-pattern="PRESENT" src/__test__/unit/simplify.test.ts
```
