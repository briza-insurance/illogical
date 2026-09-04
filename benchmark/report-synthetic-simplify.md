# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 87

## Summary

|               | Count |
| ------------- | ----- |
| Faster (>+5%) | 54    |
| Slower (>-5%) | 25    |
| Unchanged     | 8     |

---

## simplify

### Top 20 Most Improved

| Group                | Case                 | Baseline      | Improved    | Delta    | Multiplier |
| -------------------- | -------------------- | ------------- | ----------- | -------- | ---------- |
| in-n1224-r1-10x      | complete-false       | 97.60K ops/s  | 9.72M ops/s | +9857.5% | 99.58x     |
| in-n1224-r1-10x      | full-execution-false | 97.87K ops/s  | 9.70M ops/s | +9813.8% | 99.14x     |
| in-n1224-r1-10x      | partial-true         | 105.01K ops/s | 9.26M ops/s | +8721.4% | 88.21x     |
| in-n1224-r1-10x      | complete-true        | 105.22K ops/s | 9.17M ops/s | +8614.1% | 87.14x     |
| in-n1224-r1-10x      | full-execution-true  | 106.49K ops/s | 9.15M ops/s | +8493.0% | 85.93x     |
| in-n1224-r1-10x      | empty-context        | 104.98K ops/s | 8.87M ops/s | +8345.6% | 84.46x     |
| in-n1224-r1-10x      | partial-false        | 106.13K ops/s | 8.82M ops/s | +8209.9% | 83.10x     |
| in-n614-r1-5x        | full-execution-false | 186.76K ops/s | 9.53M ops/s | +5005.2% | 51.05x     |
| in-n614-r1-5x        | complete-false       | 186.86K ops/s | 9.39M ops/s | +4926.1% | 50.26x     |
| in-n614-r1-5x        | complete-true        | 201.70K ops/s | 9.07M ops/s | +4396.6% | 44.97x     |
| in-n614-r1-5x        | partial-true         | 202.20K ops/s | 9.06M ops/s | +4379.3% | 44.79x     |
| in-n614-r1-5x        | full-execution-true  | 201.84K ops/s | 9.03M ops/s | +4375.5% | 44.76x     |
| in-n614-r1-5x        | empty-context        | 199.10K ops/s | 8.85M ops/s | +4346.3% | 44.46x     |
| in-n614-r1-5x        | partial-false        | 202.30K ops/s | 8.85M ops/s | +4273.3% | 43.73x     |
| overlap-n447-r50-10x | partial-false        | 313.35K ops/s | 9.73M ops/s | +3005.1% | 31.05x     |
| overlap-n447-r50-10x | empty-context        | 320.44K ops/s | 9.41M ops/s | +2836.4% | 29.36x     |
| overlap-n447-r50-10x | complete-true        | 311.43K ops/s | 8.72M ops/s | +2698.7% | 27.99x     |
| overlap-n447-r50-10x | full-execution-true  | 311.79K ops/s | 8.56M ops/s | +2646.0% | 27.46x     |
| overlap-n447-r50-10x | partial-true         | 313.92K ops/s | 8.51M ops/s | +2610.3% | 27.10x     |
| overlap-n447-r50-10x | full-execution-false | 63.74K ops/s  | 1.17M ops/s | +1736.7% | 18.37x     |

### Top 20 Least Improved

| Group                       | Case                 | Baseline     | Improved    | Delta  | Multiplier |
| --------------------------- | -------------------- | ------------ | ----------- | ------ | ---------- |
| expression-medium-or        | complete-true        | 10.27M ops/s | 7.05M ops/s | -31.3% | 0.69x      |
| expression-medium-or        | partial-true         | 9.99M ops/s  | 7.02M ops/s | -29.8% | 0.70x      |
| expression-medium-and       | complete-false       | 10.05M ops/s | 7.29M ops/s | -27.5% | 0.72x      |
| expression-date-arithmetic  | complete-false       | 9.92M ops/s  | 7.24M ops/s | -27.0% | 0.73x      |
| expression-complex-nested   | complete-false       | 9.71M ops/s  | 7.22M ops/s | -25.6% | 0.74x      |
| expression-reference-nested | complete-false       | 8.82M ops/s  | 6.65M ops/s | -24.7% | 0.75x      |
| expression-deep-nested      | complete-false       | 8.89M ops/s  | 6.71M ops/s | -24.5% | 0.76x      |
| expression-simple-eq        | complete-true        | 12.70M ops/s | 9.64M ops/s | -24.1% | 0.76x      |
| expression-simple-eq        | full-execution-true  | 12.80M ops/s | 9.78M ops/s | -23.6% | 0.76x      |
| expression-simple-eq        | partial-true         | 12.84M ops/s | 9.82M ops/s | -23.5% | 0.76x      |
| expression-simple-eq        | complete-false       | 12.57M ops/s | 9.77M ops/s | -22.3% | 0.78x      |
| expression-simple-eq        | full-execution-false | 12.50M ops/s | 9.73M ops/s | -22.2% | 0.78x      |
| expression-simple-ne        | complete-true        | 11.97M ops/s | 9.57M ops/s | -20.0% | 0.80x      |
| expression-reference-nested | full-execution-false | 5.02M ops/s  | 4.14M ops/s | -17.6% | 0.82x      |
| expression-simple-eq        | partial-false        | 10.16M ops/s | 8.40M ops/s | -17.3% | 0.83x      |
| expression-simple-eq        | empty-context        | 9.98M ops/s  | 8.42M ops/s | -15.6% | 0.84x      |
| expression-deep-nested      | full-execution-false | 2.55M ops/s  | 2.18M ops/s | -14.4% | 0.86x      |
| expression-medium-or        | complete-false       | 4.41M ops/s  | 3.94M ops/s | -10.7% | 0.89x      |
| expression-medium-or        | full-execution-false | 4.40M ops/s  | 3.94M ops/s | -10.5% | 0.89x      |
| expression-medium-or        | full-execution-true  | 4.37M ops/s  | 3.92M ops/s | -10.2% | 0.90x      |

### Regressions

| Group                       | Case                 | Baseline     | Improved    | Delta  | Multiplier |
| --------------------------- | -------------------- | ------------ | ----------- | ------ | ---------- |
| expression-medium-or        | complete-true        | 10.27M ops/s | 7.05M ops/s | -31.3% | 0.69x      |
| expression-medium-or        | partial-true         | 9.99M ops/s  | 7.02M ops/s | -29.8% | 0.70x      |
| expression-medium-and       | complete-false       | 10.05M ops/s | 7.29M ops/s | -27.5% | 0.72x      |
| expression-date-arithmetic  | complete-false       | 9.92M ops/s  | 7.24M ops/s | -27.0% | 0.73x      |
| expression-complex-nested   | complete-false       | 9.71M ops/s  | 7.22M ops/s | -25.6% | 0.74x      |
| expression-reference-nested | complete-false       | 8.82M ops/s  | 6.65M ops/s | -24.7% | 0.75x      |
| expression-deep-nested      | complete-false       | 8.89M ops/s  | 6.71M ops/s | -24.5% | 0.76x      |
| expression-simple-eq        | complete-true        | 12.70M ops/s | 9.64M ops/s | -24.1% | 0.76x      |
| expression-simple-eq        | full-execution-true  | 12.80M ops/s | 9.78M ops/s | -23.6% | 0.76x      |
| expression-simple-eq        | partial-true         | 12.84M ops/s | 9.82M ops/s | -23.5% | 0.76x      |
| expression-simple-eq        | complete-false       | 12.57M ops/s | 9.77M ops/s | -22.3% | 0.78x      |
| expression-simple-eq        | full-execution-false | 12.50M ops/s | 9.73M ops/s | -22.2% | 0.78x      |
| expression-simple-ne        | complete-true        | 11.97M ops/s | 9.57M ops/s | -20.0% | 0.80x      |
| expression-reference-nested | full-execution-false | 5.02M ops/s  | 4.14M ops/s | -17.6% | 0.82x      |
| expression-simple-eq        | partial-false        | 10.16M ops/s | 8.40M ops/s | -17.3% | 0.83x      |
| expression-simple-eq        | empty-context        | 9.98M ops/s  | 8.42M ops/s | -15.6% | 0.84x      |
| expression-deep-nested      | full-execution-false | 2.55M ops/s  | 2.18M ops/s | -14.4% | 0.86x      |
| expression-medium-or        | complete-false       | 4.41M ops/s  | 3.94M ops/s | -10.7% | 0.89x      |
| expression-medium-or        | full-execution-false | 4.40M ops/s  | 3.94M ops/s | -10.5% | 0.89x      |
| expression-medium-or        | full-execution-true  | 4.37M ops/s  | 3.92M ops/s | -10.2% | 0.90x      |
| expression-simple-ne        | full-execution-true  | 9.32M ops/s  | 8.51M ops/s | -8.7%  | 0.91x      |
| expression-simple-ne        | empty-context        | 9.16M ops/s  | 8.38M ops/s | -8.5%  | 0.91x      |
| expression-medium-and       | full-execution-false | 3.37M ops/s  | 3.08M ops/s | -8.5%  | 0.92x      |
| expression-simple-ne        | partial-true         | 9.13M ops/s  | 8.42M ops/s | -7.7%  | 0.92x      |
| expression-arithmetic       | partial-false        | 2.46M ops/s  | 2.33M ops/s | -5.2%  | 0.95x      |
