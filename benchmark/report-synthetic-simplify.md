# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 87

## Summary

|               | Count |
| ------------- | ----- |
| Faster (>+5%) | 54    |
| Slower (>-5%) | 26    |
| Unchanged     | 7     |

---

## simplify

### Top 20 Most Improved

| Group                | Case                 | Baseline      | Improved    | Delta    | Multiplier |
| -------------------- | -------------------- | ------------- | ----------- | -------- | ---------- |
| in-n1224-r1-10x      | full-execution-false | 100.96K ops/s | 9.24M ops/s | +9053.5% | 91.53x     |
| in-n1224-r1-10x      | partial-true         | 105.96K ops/s | 9.51M ops/s | +8873.5% | 89.74x     |
| in-n1224-r1-10x      | complete-false       | 102.98K ops/s | 9.23M ops/s | +8866.2% | 89.66x     |
| in-n1224-r1-10x      | full-execution-true  | 108.17K ops/s | 9.42M ops/s | +8611.6% | 87.12x     |
| in-n1224-r1-10x      | complete-true        | 110.38K ops/s | 9.58M ops/s | +8581.1% | 86.81x     |
| in-n1224-r1-10x      | partial-false        | 108.46K ops/s | 8.16M ops/s | +7427.1% | 75.27x     |
| in-n1224-r1-10x      | empty-context        | 108.48K ops/s | 8.09M ops/s | +7361.7% | 74.62x     |
| in-n614-r1-5x        | complete-false       | 189.21K ops/s | 9.46M ops/s | +4899.1% | 49.99x     |
| in-n614-r1-5x        | full-execution-false | 193.91K ops/s | 9.57M ops/s | +4834.9% | 49.35x     |
| in-n614-r1-5x        | full-execution-true  | 206.18K ops/s | 9.32M ops/s | +4422.6% | 45.23x     |
| in-n614-r1-5x        | complete-true        | 202.91K ops/s | 9.17M ops/s | +4417.0% | 45.17x     |
| in-n614-r1-5x        | partial-true         | 204.48K ops/s | 9.08M ops/s | +4341.4% | 44.41x     |
| in-n614-r1-5x        | empty-context        | 205.11K ops/s | 8.14M ops/s | +3870.7% | 39.71x     |
| in-n614-r1-5x        | partial-false        | 204.72K ops/s | 8.11M ops/s | +3861.1% | 39.61x     |
| overlap-n447-r50-10x | empty-context        | 325.99K ops/s | 8.69M ops/s | +2566.4% | 26.66x     |
| overlap-n447-r50-10x | partial-false        | 326.01K ops/s | 8.69M ops/s | +2564.9% | 26.65x     |
| overlap-n447-r50-10x | full-execution-true  | 318.21K ops/s | 8.39M ops/s | +2536.2% | 26.36x     |
| overlap-n447-r50-10x | complete-true        | 320.29K ops/s | 8.42M ops/s | +2529.1% | 26.29x     |
| overlap-n447-r50-10x | partial-true         | 322.18K ops/s | 7.51M ops/s | +2230.7% | 23.31x     |
| overlap-n447-r50-10x | full-execution-false | 65.06K ops/s  | 1.15M ops/s | +1660.7% | 17.61x     |

### Top 20 Least Improved

| Group                       | Case                 | Baseline     | Improved     | Delta  | Multiplier |
| --------------------------- | -------------------- | ------------ | ------------ | ------ | ---------- |
| expression-medium-or        | complete-true        | 9.94M ops/s  | 7.03M ops/s  | -29.3% | 0.71x      |
| expression-medium-or        | partial-true         | 9.79M ops/s  | 7.01M ops/s  | -28.4% | 0.72x      |
| expression-deep-nested      | complete-false       | 8.94M ops/s  | 6.62M ops/s  | -26.0% | 0.74x      |
| expression-medium-and       | complete-false       | 9.76M ops/s  | 7.23M ops/s  | -25.9% | 0.74x      |
| expression-simple-ne        | complete-true        | 13.08M ops/s | 9.70M ops/s  | -25.8% | 0.74x      |
| expression-simple-eq        | partial-true         | 13.07M ops/s | 9.80M ops/s  | -25.1% | 0.75x      |
| expression-reference-nested | complete-false       | 8.93M ops/s  | 6.77M ops/s  | -24.3% | 0.76x      |
| expression-simple-eq        | empty-context        | 10.32M ops/s | 7.83M ops/s  | -24.2% | 0.76x      |
| expression-date-arithmetic  | complete-false       | 9.60M ops/s  | 7.34M ops/s  | -23.6% | 0.76x      |
| expression-simple-eq        | full-execution-false | 13.05M ops/s | 10.02M ops/s | -23.2% | 0.77x      |
| expression-simple-ne        | partial-true         | 10.17M ops/s | 7.82M ops/s  | -23.1% | 0.77x      |
| expression-simple-eq        | full-execution-true  | 13.07M ops/s | 10.06M ops/s | -23.0% | 0.77x      |
| expression-simple-ne        | empty-context        | 10.01M ops/s | 7.76M ops/s  | -22.5% | 0.78x      |
| expression-complex-nested   | complete-false       | 9.32M ops/s  | 7.25M ops/s  | -22.2% | 0.78x      |
| expression-simple-eq        | complete-false       | 12.92M ops/s | 10.09M ops/s | -21.9% | 0.78x      |
| expression-simple-eq        | complete-true        | 12.79M ops/s | 10.00M ops/s | -21.8% | 0.78x      |
| expression-simple-eq        | partial-false        | 10.27M ops/s | 8.13M ops/s  | -20.9% | 0.79x      |
| expression-simple-ne        | full-execution-true  | 9.98M ops/s  | 7.98M ops/s  | -20.0% | 0.80x      |
| expression-reference-nested | full-execution-false | 5.13M ops/s  | 4.21M ops/s  | -18.0% | 0.82x      |
| expression-arithmetic       | full-execution-false | 2.53M ops/s  | 2.34M ops/s  | -7.7%  | 0.92x      |

### Regressions

| Group                       | Case                 | Baseline     | Improved     | Delta  | Multiplier |
| --------------------------- | -------------------- | ------------ | ------------ | ------ | ---------- |
| expression-medium-or        | complete-true        | 9.94M ops/s  | 7.03M ops/s  | -29.3% | 0.71x      |
| expression-medium-or        | partial-true         | 9.79M ops/s  | 7.01M ops/s  | -28.4% | 0.72x      |
| expression-deep-nested      | complete-false       | 8.94M ops/s  | 6.62M ops/s  | -26.0% | 0.74x      |
| expression-medium-and       | complete-false       | 9.76M ops/s  | 7.23M ops/s  | -25.9% | 0.74x      |
| expression-simple-ne        | complete-true        | 13.08M ops/s | 9.70M ops/s  | -25.8% | 0.74x      |
| expression-simple-eq        | partial-true         | 13.07M ops/s | 9.80M ops/s  | -25.1% | 0.75x      |
| expression-reference-nested | complete-false       | 8.93M ops/s  | 6.77M ops/s  | -24.3% | 0.76x      |
| expression-simple-eq        | empty-context        | 10.32M ops/s | 7.83M ops/s  | -24.2% | 0.76x      |
| expression-date-arithmetic  | complete-false       | 9.60M ops/s  | 7.34M ops/s  | -23.6% | 0.76x      |
| expression-simple-eq        | full-execution-false | 13.05M ops/s | 10.02M ops/s | -23.2% | 0.77x      |
| expression-simple-ne        | partial-true         | 10.17M ops/s | 7.82M ops/s  | -23.1% | 0.77x      |
| expression-simple-eq        | full-execution-true  | 13.07M ops/s | 10.06M ops/s | -23.0% | 0.77x      |
| expression-simple-ne        | empty-context        | 10.01M ops/s | 7.76M ops/s  | -22.5% | 0.78x      |
| expression-complex-nested   | complete-false       | 9.32M ops/s  | 7.25M ops/s  | -22.2% | 0.78x      |
| expression-simple-eq        | complete-false       | 12.92M ops/s | 10.09M ops/s | -21.9% | 0.78x      |
| expression-simple-eq        | complete-true        | 12.79M ops/s | 10.00M ops/s | -21.8% | 0.78x      |
| expression-simple-eq        | partial-false        | 10.27M ops/s | 8.13M ops/s  | -20.9% | 0.79x      |
| expression-simple-ne        | full-execution-true  | 9.98M ops/s  | 7.98M ops/s  | -20.0% | 0.80x      |
| expression-reference-nested | full-execution-false | 5.13M ops/s  | 4.21M ops/s  | -18.0% | 0.82x      |
| expression-arithmetic       | full-execution-false | 2.53M ops/s  | 2.34M ops/s  | -7.7%  | 0.92x      |
| expression-medium-and       | full-execution-false | 3.41M ops/s  | 3.15M ops/s  | -7.7%  | 0.92x      |
| expression-reference-nested | empty-context        | 2.56M ops/s  | 2.39M ops/s  | -6.7%  | 0.93x      |
| expression-arithmetic       | empty-context        | 2.48M ops/s  | 2.32M ops/s  | -6.6%  | 0.93x      |
| expression-deep-nested      | full-execution-false | 2.36M ops/s  | 2.22M ops/s  | -5.9%  | 0.94x      |
| expression-reference-nested | partial-false        | 2.46M ops/s  | 2.33M ops/s  | -5.3%  | 0.95x      |
| expression-medium-or        | full-execution-true  | 4.28M ops/s  | 4.06M ops/s  | -5.1%  | 0.95x      |
