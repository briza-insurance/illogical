# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-oop.json`
**Improved:** `results-synthetic-evaluate-bytecode.json`
**Total cases compared:** 106

## Summary

|               | Count |
| ------------- | ----- |
| Faster (>+5%) | 80    |
| Slower (>-5%) | 14    |
| Unchanged     | 12    |

---

## evaluate

### Top 20 Most Improved

| Group                   | Case                 | Baseline      | Improved     | Delta     | Multiplier |
| ----------------------- | -------------------- | ------------- | ------------ | --------- | ---------- |
| overlap-n1026-r1000-10x | complete-true        | 27.85K ops/s  | 13.42M ops/s | +48077.3% | 481.77x    |
| overlap-n1026-r1000-10x | early-true           | 28.25K ops/s  | 13.17M ops/s | +46526.6% | 466.27x    |
| overlap-n1026-r1000-10x | full-execution-true  | 27.21K ops/s  | 12.64M ops/s | +46347.4% | 464.47x    |
| overlap-n1026-r1000-10x | partial-true         | 37.80K ops/s  | 13.81M ops/s | +36449.8% | 365.50x    |
| overlap-n526-r500-5x    | complete-true        | 69.27K ops/s  | 14.49M ops/s | +20820.7% | 209.21x    |
| overlap-n526-r500-5x    | full-execution-true  | 69.38K ops/s  | 13.83M ops/s | +19837.8% | 199.38x    |
| overlap-n526-r500-5x    | early-true           | 69.55K ops/s  | 13.18M ops/s | +18852.2% | 189.52x    |
| overlap-n526-r500-5x    | partial-true         | 93.57K ops/s  | 13.79M ops/s | +14643.1% | 147.43x    |
| in-n1224-r1-10x         | late-true            | 263.37K ops/s | 20.11M ops/s | +7536.2%  | 76.36x     |
| in-n1224-r1-10x         | full-execution-false | 269.78K ops/s | 19.47M ops/s | +7116.4%  | 72.16x     |
| in-n1224-r1-10x         | complete-false       | 269.87K ops/s | 19.46M ops/s | +7112.5%  | 72.13x     |
| in-n1224-r1-10x         | empty-context        | 330.89K ops/s | 22.91M ops/s | +6822.9%  | 69.23x     |
| in-n1224-r1-10x         | partial-false        | 331.59K ops/s | 22.79M ops/s | +6771.5%  | 68.71x     |
| in-n1224-r1-10x         | complete-true        | 330.38K ops/s | 20.42M ops/s | +6081.1%  | 61.81x     |
| in-n1224-r1-10x         | partial-true         | 332.76K ops/s | 20.39M ops/s | +6027.1%  | 61.27x     |
| in-n1224-r1-10x         | full-execution-true  | 332.05K ops/s | 20.21M ops/s | +5985.3%  | 60.85x     |
| in-n1224-r1-10x         | early-true           | 332.15K ops/s | 19.60M ops/s | +5802.1%  | 59.02x     |
| in-n614-r1-5x           | late-true            | 495.10K ops/s | 20.38M ops/s | +4016.2%  | 41.16x     |
| in-n614-r1-5x           | complete-false       | 533.50K ops/s | 19.36M ops/s | +3529.6%  | 36.30x     |
| in-n614-r1-5x           | full-execution-false | 546.93K ops/s | 19.34M ops/s | +3435.4%  | 35.35x     |

### Top 20 Least Improved

| Group                       | Case                 | Baseline     | Improved     | Delta  | Multiplier |
| --------------------------- | -------------------- | ------------ | ------------ | ------ | ---------- |
| expression-medium-or        | early-true           | 19.24M ops/s | 15.18M ops/s | -21.1% | 0.79x      |
| expression-medium-or        | complete-true        | 19.27M ops/s | 15.36M ops/s | -20.3% | 0.80x      |
| expression-medium-or        | partial-true         | 18.83M ops/s | 15.27M ops/s | -18.9% | 0.81x      |
| expression-medium-or        | empty-context        | 10.36M ops/s | 8.42M ops/s  | -18.7% | 0.81x      |
| expression-medium-or        | late-true            | 10.25M ops/s | 8.56M ops/s  | -16.5% | 0.84x      |
| expression-medium-or        | complete-false       | 10.20M ops/s | 8.55M ops/s  | -16.2% | 0.84x      |
| expression-medium-or        | full-execution-true  | 10.28M ops/s | 8.64M ops/s  | -16.0% | 0.84x      |
| expression-medium-or        | full-execution-false | 10.21M ops/s | 8.67M ops/s  | -15.1% | 0.85x      |
| expression-medium-or        | partial-false        | 9.54M ops/s  | 8.17M ops/s  | -14.3% | 0.86x      |
| expression-deep-nested      | partial-false        | 14.66M ops/s | 13.77M ops/s | -6.1%  | 0.94x      |
| expression-reference-nested | empty-context        | 14.88M ops/s | 13.99M ops/s | -6.0%  | 0.94x      |
| expression-deep-nested      | late-true            | 4.44M ops/s  | 4.17M ops/s  | -6.0%  | 0.94x      |
| expression-deep-nested      | empty-context        | 14.88M ops/s | 14.02M ops/s | -5.8%  | 0.94x      |
| expression-deep-nested      | full-execution-false | 4.43M ops/s  | 4.20M ops/s  | -5.2%  | 0.95x      |
| expression-reference-nested | complete-false       | 13.45M ops/s | 12.81M ops/s | -4.7%  | 0.95x      |
| expression-deep-nested      | complete-false       | 13.42M ops/s | 12.81M ops/s | -4.6%  | 0.95x      |
| expression-reference-nested | partial-false        | 14.48M ops/s | 13.91M ops/s | -3.9%  | 0.96x      |
| expression-date-arithmetic  | partial-false        | 14.75M ops/s | 14.80M ops/s | +0.4%  | 1.00x      |
| expression-medium-and       | empty-context        | 14.93M ops/s | 15.00M ops/s | +0.5%  | 1.00x      |
| expression-complex-nested   | empty-context        | 15.07M ops/s | 15.30M ops/s | +1.5%  | 1.02x      |

### Regressions

| Group                       | Case                 | Baseline     | Improved     | Delta  | Multiplier |
| --------------------------- | -------------------- | ------------ | ------------ | ------ | ---------- |
| expression-medium-or        | early-true           | 19.24M ops/s | 15.18M ops/s | -21.1% | 0.79x      |
| expression-medium-or        | complete-true        | 19.27M ops/s | 15.36M ops/s | -20.3% | 0.80x      |
| expression-medium-or        | partial-true         | 18.83M ops/s | 15.27M ops/s | -18.9% | 0.81x      |
| expression-medium-or        | empty-context        | 10.36M ops/s | 8.42M ops/s  | -18.7% | 0.81x      |
| expression-medium-or        | late-true            | 10.25M ops/s | 8.56M ops/s  | -16.5% | 0.84x      |
| expression-medium-or        | complete-false       | 10.20M ops/s | 8.55M ops/s  | -16.2% | 0.84x      |
| expression-medium-or        | full-execution-true  | 10.28M ops/s | 8.64M ops/s  | -16.0% | 0.84x      |
| expression-medium-or        | full-execution-false | 10.21M ops/s | 8.67M ops/s  | -15.1% | 0.85x      |
| expression-medium-or        | partial-false        | 9.54M ops/s  | 8.17M ops/s  | -14.3% | 0.86x      |
| expression-deep-nested      | partial-false        | 14.66M ops/s | 13.77M ops/s | -6.1%  | 0.94x      |
| expression-reference-nested | empty-context        | 14.88M ops/s | 13.99M ops/s | -6.0%  | 0.94x      |
| expression-deep-nested      | late-true            | 4.44M ops/s  | 4.17M ops/s  | -6.0%  | 0.94x      |
| expression-deep-nested      | empty-context        | 14.88M ops/s | 14.02M ops/s | -5.8%  | 0.94x      |
| expression-deep-nested      | full-execution-false | 4.43M ops/s  | 4.20M ops/s  | -5.2%  | 0.95x      |
