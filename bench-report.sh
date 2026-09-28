#!/bin/bash

# Usage: ./bench-report.sh
#
# The report command is expecting a `-baseline` suffix on the data file name.

node --import tsx src/benchmark/report.ts \
  benchmark/results-sample-evaluate-oop-baseline.json \
  benchmark/results-sample-evaluate-oop.json \
  --op evaluate --out benchmark/report-sample-evaluate.md
node --import tsx src/benchmark/report.ts \
  benchmark/results-sample-simplify-oop-baseline.json \
  benchmark/results-sample-simplify-oop.json \
  --op simplify --out benchmark/report-sample-simplify.md
node --import tsx src/benchmark/report.ts \
  benchmark/results-sample-parse-oop-baseline.json \
  benchmark/results-sample-parse-oop.json \
  --op parse --out benchmark/report-sample-parse.md

node --import tsx src/benchmark/report.ts \
  benchmark/results-synthetic-evaluate-oop-baseline.json \
  benchmark/results-synthetic-evaluate-oop.json \
  --op evaluate --out benchmark/report-synthetic-evaluate.md
node --import tsx src/benchmark/report.ts \
  benchmark/results-synthetic-simplify-oop-baseline.json \
  benchmark/results-synthetic-simplify-oop.json \
  --op simplify --out benchmark/report-synthetic-simplify.md
node --import tsx src/benchmark/report.ts \
  benchmark/results-synthetic-parse-oop-baseline.json \
  benchmark/results-synthetic-parse-oop.json \
  --op parse --out benchmark/report-synthetic-parse.md