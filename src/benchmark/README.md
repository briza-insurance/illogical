# Benchmarking Guide

This directory contains scripts to benchmark the performance of the Illogical engine, both for the OOP evaluator and the Bytecode evaluator. The scripts allow you to measure execution speed (throughputs and latencies) and generate comparison reports.

## Running a Single Scenario

You can benchmark a single test case without having to run the entire suite. This is particularly useful when optimizing or testing regressions for specific files. To do this, use the `--filter` argument, which performs a plain-text search against the condition paths/names.

The full process at once:

```bash
npm run bench:full:report:test-case -- --filter 249-and-or-eqs
```

### Example: Running simplify.ts for both engines then producing the report

Let's assume you want to benchmark the `simplify-249` test case from the `sample-conditions` folder.

#### 1. Baseline (OOP Engine)

Generate the baseline result using the default Object-Oriented evaluator:

```bash
node --import tsx src/benchmark/simplify.ts \
  --cases conditions/sample-conditions \
  --filter simplify-249 \
  --out benchmark/results-simplify-249-oop.json
```

#### 2. Comparison (Bytecode Engine)

Generate the results for the Bytecode evaluator:

```bash
node --import tsx src/benchmark/simplify.ts \
  --cases conditions/sample-conditions \
  --filter simplify-249 \
  --options '{"evaluator":"bytecode"}' \
  --out benchmark/results-simplify-249-bytecode.json
```

#### 3. Generating a Markdown Report

Compare the resulting JSON files using the `report.ts` script to generate a readable Markdown report showing the delta throughput and multipliers:

```bash
node --import tsx src/benchmark/report.ts \
  benchmark/results-simplify-249-oop.json \
  benchmark/results-simplify-249-bytecode.json \
  --op simplify \
  --out benchmark/report-simplify-249.md
```

You can view the generated file inside the `benchmark` directory (`benchmark/report-simplify-249.md`).

---

## Notes

- The `--filter` argument does a basic `.includes()` check on the file or folder name. Provide enough of the name to be unique if you want exactly one match.
- This filtering is supported for `evaluate.ts` and `simplify.ts`.
