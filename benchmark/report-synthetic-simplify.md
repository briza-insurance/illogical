# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 87

## Summary

|               | Count |
| ------------- | ----- |
| Faster (>+5%) | 55    |
| Slower (>-5%) | 28    |
| Unchanged     | 4     |

---

## simplify

### Top 20 Most Improved

| Group                | Case                 | Baseline      | Improved    | Delta    | Multiplier |
| -------------------- | -------------------- | ------------- | ----------- | -------- | ---------- |
| in-n1224-r1-10x      | full-execution-false | 106.74K ops/s | 9.65M ops/s | +8936.2% | 90.36x     |
| in-n1224-r1-10x      | complete-false       | 107.97K ops/s | 9.66M ops/s | +8848.6% | 89.49x     |
| in-n1224-r1-10x      | full-execution-true  | 114.94K ops/s | 9.25M ops/s | +7947.5% | 80.48x     |
| in-n1224-r1-10x      | partial-true         | 117.97K ops/s | 9.26M ops/s | +7749.0% | 78.49x     |
| in-n1224-r1-10x      | complete-true        | 117.36K ops/s | 9.20M ops/s | +7742.2% | 78.42x     |
| in-n1224-r1-10x      | empty-context        | 116.46K ops/s | 8.54M ops/s | +7233.4% | 73.33x     |
| in-n1224-r1-10x      | partial-false        | 116.35K ops/s | 8.49M ops/s | +7193.5% | 72.94x     |
| in-n614-r1-5x        | full-execution-false | 202.94K ops/s | 9.63M ops/s | +4647.7% | 47.48x     |
| in-n614-r1-5x        | complete-false       | 203.92K ops/s | 9.62M ops/s | +4616.7% | 47.17x     |
| in-n614-r1-5x        | partial-true         | 220.46K ops/s | 9.72M ops/s | +4308.3% | 44.08x     |
| in-n614-r1-5x        | full-execution-true  | 221.56K ops/s | 9.77M ops/s | +4308.2% | 44.08x     |
| in-n614-r1-5x        | complete-true        | 217.54K ops/s | 9.52M ops/s | +4277.2% | 43.77x     |
| in-n614-r1-5x        | empty-context        | 213.67K ops/s | 8.61M ops/s | +3930.0% | 40.30x     |
| in-n614-r1-5x        | partial-false        | 219.38K ops/s | 8.58M ops/s | +3810.0% | 39.10x     |
| overlap-n447-r50-10x | empty-context        | 341.28K ops/s | 9.36M ops/s | +2644.0% | 27.44x     |
| overlap-n447-r50-10x | partial-false        | 340.29K ops/s | 9.27M ops/s | +2623.9% | 27.24x     |
| overlap-n447-r50-10x | full-execution-true  | 336.48K ops/s | 8.67M ops/s | +2477.5% | 25.77x     |
| overlap-n447-r50-10x | complete-true        | 336.90K ops/s | 8.65M ops/s | +2466.8% | 25.67x     |
| overlap-n447-r50-10x | partial-true         | 334.31K ops/s | 8.07M ops/s | +2314.1% | 24.14x     |
| overlap-n447-r50-10x | complete-false       | 66.03K ops/s  | 1.09M ops/s | +1557.1% | 16.57x     |

### Top 20 Least Improved

| Group                       | Case                 | Baseline     | Improved    | Delta  | Multiplier |
| --------------------------- | -------------------- | ------------ | ----------- | ------ | ---------- |
| expression-medium-or        | complete-true        | 10.39M ops/s | 7.03M ops/s | -32.3% | 0.68x      |
| expression-medium-or        | partial-true         | 10.38M ops/s | 7.05M ops/s | -32.1% | 0.68x      |
| expression-medium-and       | complete-false       | 10.16M ops/s | 7.24M ops/s | -28.7% | 0.71x      |
| expression-date-arithmetic  | complete-false       | 10.14M ops/s | 7.24M ops/s | -28.6% | 0.71x      |
| expression-reference-nested | complete-false       | 9.14M ops/s  | 6.71M ops/s | -26.6% | 0.73x      |
| expression-simple-ne        | complete-true        | 13.03M ops/s | 9.70M ops/s | -25.5% | 0.74x      |
| expression-deep-nested      | complete-false       | 9.01M ops/s  | 6.75M ops/s | -25.1% | 0.75x      |
| expression-complex-nested   | complete-false       | 9.65M ops/s  | 7.23M ops/s | -25.1% | 0.75x      |
| expression-simple-eq        | partial-true         | 13.17M ops/s | 9.90M ops/s | -24.8% | 0.75x      |
| expression-simple-eq        | complete-true        | 13.14M ops/s | 9.87M ops/s | -24.8% | 0.75x      |
| expression-simple-eq        | full-execution-true  | 13.01M ops/s | 9.90M ops/s | -23.9% | 0.76x      |
| expression-simple-eq        | full-execution-false | 12.84M ops/s | 9.79M ops/s | -23.8% | 0.76x      |
| expression-simple-eq        | complete-false       | 12.95M ops/s | 9.90M ops/s | -23.5% | 0.76x      |
| expression-reference-nested | full-execution-false | 5.14M ops/s  | 4.15M ops/s | -19.3% | 0.81x      |
| expression-simple-ne        | full-execution-true  | 10.04M ops/s | 8.26M ops/s | -17.7% | 0.82x      |
| expression-simple-ne        | empty-context        | 9.95M ops/s  | 8.29M ops/s | -16.6% | 0.83x      |
| expression-simple-eq        | partial-false        | 9.91M ops/s  | 8.27M ops/s | -16.6% | 0.83x      |
| expression-simple-ne        | partial-true         | 9.96M ops/s  | 8.35M ops/s | -16.2% | 0.84x      |
| expression-simple-eq        | empty-context        | 9.85M ops/s  | 8.31M ops/s | -15.6% | 0.84x      |
| expression-deep-nested      | full-execution-false | 2.51M ops/s  | 2.19M ops/s | -12.6% | 0.87x      |

### Regressions

| Group                       | Case                 | Baseline     | Improved    | Delta  | Multiplier |
| --------------------------- | -------------------- | ------------ | ----------- | ------ | ---------- |
| expression-medium-or        | complete-true        | 10.39M ops/s | 7.03M ops/s | -32.3% | 0.68x      |
| expression-medium-or        | partial-true         | 10.38M ops/s | 7.05M ops/s | -32.1% | 0.68x      |
| expression-medium-and       | complete-false       | 10.16M ops/s | 7.24M ops/s | -28.7% | 0.71x      |
| expression-date-arithmetic  | complete-false       | 10.14M ops/s | 7.24M ops/s | -28.6% | 0.71x      |
| expression-reference-nested | complete-false       | 9.14M ops/s  | 6.71M ops/s | -26.6% | 0.73x      |
| expression-simple-ne        | complete-true        | 13.03M ops/s | 9.70M ops/s | -25.5% | 0.74x      |
| expression-deep-nested      | complete-false       | 9.01M ops/s  | 6.75M ops/s | -25.1% | 0.75x      |
| expression-complex-nested   | complete-false       | 9.65M ops/s  | 7.23M ops/s | -25.1% | 0.75x      |
| expression-simple-eq        | partial-true         | 13.17M ops/s | 9.90M ops/s | -24.8% | 0.75x      |
| expression-simple-eq        | complete-true        | 13.14M ops/s | 9.87M ops/s | -24.8% | 0.75x      |
| expression-simple-eq        | full-execution-true  | 13.01M ops/s | 9.90M ops/s | -23.9% | 0.76x      |
| expression-simple-eq        | full-execution-false | 12.84M ops/s | 9.79M ops/s | -23.8% | 0.76x      |
| expression-simple-eq        | complete-false       | 12.95M ops/s | 9.90M ops/s | -23.5% | 0.76x      |
| expression-reference-nested | full-execution-false | 5.14M ops/s  | 4.15M ops/s | -19.3% | 0.81x      |
| expression-simple-ne        | full-execution-true  | 10.04M ops/s | 8.26M ops/s | -17.7% | 0.82x      |
| expression-simple-ne        | empty-context        | 9.95M ops/s  | 8.29M ops/s | -16.6% | 0.83x      |
| expression-simple-eq        | partial-false        | 9.91M ops/s  | 8.27M ops/s | -16.6% | 0.83x      |
| expression-simple-ne        | partial-true         | 9.96M ops/s  | 8.35M ops/s | -16.2% | 0.84x      |
| expression-simple-eq        | empty-context        | 9.85M ops/s  | 8.31M ops/s | -15.6% | 0.84x      |
| expression-deep-nested      | full-execution-false | 2.51M ops/s  | 2.19M ops/s | -12.6% | 0.87x      |
| expression-medium-or        | full-execution-false | 4.52M ops/s  | 3.96M ops/s | -12.5% | 0.87x      |
| expression-medium-or        | complete-false       | 4.52M ops/s  | 3.97M ops/s | -12.1% | 0.88x      |
| expression-medium-or        | full-execution-true  | 4.49M ops/s  | 3.96M ops/s | -11.8% | 0.88x      |
| expression-medium-and       | full-execution-false | 3.45M ops/s  | 3.14M ops/s | -8.8%  | 0.91x      |
| expression-arithmetic       | empty-context        | 2.52M ops/s  | 2.30M ops/s | -8.7%  | 0.91x      |
| expression-arithmetic       | partial-false        | 2.46M ops/s  | 2.27M ops/s | -7.7%  | 0.92x      |
| expression-arithmetic       | full-execution-false | 2.51M ops/s  | 2.32M ops/s | -7.6%  | 0.92x      |
| expression-reference-nested | empty-context        | 2.52M ops/s  | 2.39M ops/s | -5.1%  | 0.95x      |
