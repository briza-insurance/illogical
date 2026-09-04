# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-oop.json`
**Improved:** `results-synthetic-evaluate-bytecode.json`
**Total cases compared:** 106

## Summary

|               | Count |
| ------------- | ----- |
| Faster (>+5%) | 81    |
| Slower (>-5%) | 11    |
| Unchanged     | 14    |

---

## evaluate

### Top 20 Most Improved

| Group                   | Case                 | Baseline      | Improved     | Delta     | Multiplier |
| ----------------------- | -------------------- | ------------- | ------------ | --------- | ---------- |
| overlap-n1026-r1000-10x | full-execution-true  | 31.68K ops/s  | 15.18M ops/s | +47819.4% | 479.19x    |
| overlap-n1026-r1000-10x | early-true           | 31.16K ops/s  | 14.61M ops/s | +46794.6% | 468.95x    |
| overlap-n1026-r1000-10x | complete-true        | 32.01K ops/s  | 14.99M ops/s | +46730.1% | 468.30x    |
| overlap-n1026-r1000-10x | partial-true         | 44.52K ops/s  | 15.35M ops/s | +34375.0% | 344.75x    |
| overlap-n526-r500-5x    | complete-true        | 64.66K ops/s  | 14.88M ops/s | +22910.8% | 230.11x    |
| overlap-n526-r500-5x    | full-execution-true  | 66.79K ops/s  | 15.07M ops/s | +22457.9% | 225.58x    |
| overlap-n526-r500-5x    | early-true           | 66.00K ops/s  | 14.77M ops/s | +22278.2% | 223.78x    |
| overlap-n526-r500-5x    | partial-true         | 92.57K ops/s  | 15.48M ops/s | +16624.8% | 167.25x    |
| in-n1224-r1-10x         | late-true            | 263.62K ops/s | 20.10M ops/s | +7523.9%  | 76.24x     |
| in-n1224-r1-10x         | empty-context        | 328.07K ops/s | 23.13M ops/s | +6950.6%  | 70.51x     |
| in-n1224-r1-10x         | partial-false        | 334.04K ops/s | 23.13M ops/s | +6824.9%  | 69.25x     |
| in-n1224-r1-10x         | full-execution-false | 273.36K ops/s | 18.72M ops/s | +6748.6%  | 68.49x     |
| in-n1224-r1-10x         | complete-false       | 274.14K ops/s | 18.30M ops/s | +6577.2%  | 66.77x     |
| in-n1224-r1-10x         | partial-true         | 332.91K ops/s | 20.32M ops/s | +6005.2%  | 61.05x     |
| in-n1224-r1-10x         | early-true           | 334.63K ops/s | 19.92M ops/s | +5853.0%  | 59.53x     |
| in-n1224-r1-10x         | full-execution-true  | 335.81K ops/s | 19.43M ops/s | +5684.8%  | 57.85x     |
| in-n1224-r1-10x         | complete-true        | 338.68K ops/s | 19.25M ops/s | +5582.8%  | 56.83x     |
| in-n614-r1-5x           | late-true            | 506.94K ops/s | 21.50M ops/s | +4140.4%  | 42.40x     |
| in-n614-r1-5x           | empty-context        | 662.33K ops/s | 24.24M ops/s | +3559.2%  | 36.59x     |
| in-n614-r1-5x           | complete-false       | 545.56K ops/s | 19.88M ops/s | +3544.8%  | 36.45x     |

### Top 20 Least Improved

| Group                       | Case                 | Baseline     | Improved     | Delta  | Multiplier |
| --------------------------- | -------------------- | ------------ | ------------ | ------ | ---------- |
| expression-medium-or        | late-true            | 10.98M ops/s | 8.60M ops/s  | -21.7% | 0.78x      |
| expression-medium-or        | empty-context        | 10.71M ops/s | 8.47M ops/s  | -20.9% | 0.79x      |
| expression-medium-or        | full-execution-true  | 10.73M ops/s | 8.59M ops/s  | -19.9% | 0.80x      |
| expression-medium-or        | early-true           | 19.64M ops/s | 15.75M ops/s | -19.8% | 0.80x      |
| expression-medium-or        | partial-true         | 19.40M ops/s | 15.70M ops/s | -19.1% | 0.81x      |
| expression-medium-or        | partial-false        | 10.13M ops/s | 8.24M ops/s  | -18.7% | 0.81x      |
| expression-medium-or        | complete-false       | 10.56M ops/s | 8.77M ops/s  | -17.0% | 0.83x      |
| expression-medium-or        | complete-true        | 18.51M ops/s | 15.45M ops/s | -16.5% | 0.83x      |
| expression-medium-or        | full-execution-false | 10.47M ops/s | 8.77M ops/s  | -16.3% | 0.84x      |
| expression-deep-nested      | partial-false        | 15.12M ops/s | 14.17M ops/s | -6.3%  | 0.94x      |
| expression-deep-nested      | empty-context        | 15.25M ops/s | 14.34M ops/s | -6.0%  | 0.94x      |
| expression-deep-nested      | late-true            | 4.34M ops/s  | 4.22M ops/s  | -2.8%  | 0.97x      |
| expression-deep-nested      | full-execution-false | 4.32M ops/s  | 4.24M ops/s  | -2.0%  | 0.98x      |
| expression-reference-nested | partial-false        | 14.58M ops/s | 14.31M ops/s | -1.9%  | 0.98x      |
| expression-reference-nested | empty-context        | 14.65M ops/s | 14.47M ops/s | -1.2%  | 0.99x      |
| expression-reference-nested | complete-false       | 13.47M ops/s | 13.42M ops/s | -0.4%  | 1.00x      |
| expression-deep-nested      | complete-false       | 13.39M ops/s | 13.43M ops/s | +0.3%  | 1.00x      |
| expression-complex-nested   | partial-false        | 15.07M ops/s | 15.32M ops/s | +1.6%  | 1.02x      |
| expression-medium-and       | empty-context        | 15.37M ops/s | 15.72M ops/s | +2.3%  | 1.02x      |
| expression-date-arithmetic  | empty-context        | 15.12M ops/s | 15.54M ops/s | +2.8%  | 1.03x      |

### Regressions

| Group                  | Case                 | Baseline     | Improved     | Delta  | Multiplier |
| ---------------------- | -------------------- | ------------ | ------------ | ------ | ---------- |
| expression-medium-or   | late-true            | 10.98M ops/s | 8.60M ops/s  | -21.7% | 0.78x      |
| expression-medium-or   | empty-context        | 10.71M ops/s | 8.47M ops/s  | -20.9% | 0.79x      |
| expression-medium-or   | full-execution-true  | 10.73M ops/s | 8.59M ops/s  | -19.9% | 0.80x      |
| expression-medium-or   | early-true           | 19.64M ops/s | 15.75M ops/s | -19.8% | 0.80x      |
| expression-medium-or   | partial-true         | 19.40M ops/s | 15.70M ops/s | -19.1% | 0.81x      |
| expression-medium-or   | partial-false        | 10.13M ops/s | 8.24M ops/s  | -18.7% | 0.81x      |
| expression-medium-or   | complete-false       | 10.56M ops/s | 8.77M ops/s  | -17.0% | 0.83x      |
| expression-medium-or   | complete-true        | 18.51M ops/s | 15.45M ops/s | -16.5% | 0.83x      |
| expression-medium-or   | full-execution-false | 10.47M ops/s | 8.77M ops/s  | -16.3% | 0.84x      |
| expression-deep-nested | partial-false        | 15.12M ops/s | 14.17M ops/s | -6.3%  | 0.94x      |
| expression-deep-nested | empty-context        | 15.25M ops/s | 14.34M ops/s | -6.0%  | 0.94x      |
