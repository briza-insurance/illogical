# Benchmark Comparison Report — simplify

**Baseline:** `results-sample-simplify-oop.json`
**Improved:** `results-sample-simplify-bytecode.json`
**Total cases compared:** 616

## Summary

|               | Count |
| ------------- | ----- |
| Faster (>+5%) | 613   |
| Slower (>-5%) | 3     |
| Unchanged     | 0     |

---

## simplify

### Top 20 Most Improved

| Group             | Case                 | Baseline     | Improved      | Delta     | Multiplier |
| ----------------- | -------------------- | ------------ | ------------- | --------- | ---------- |
| or-n4691-r2-001   | full-execution-false | 31.80K ops/s | 9.70M ops/s   | +30397.4% | 304.97x    |
| or-n4691-r2-001   | full-execution-true  | 31.66K ops/s | 9.59M ops/s   | +30189.0% | 302.89x    |
| or-n4691-r2-001   | complete-false       | 42.51K ops/s | 7.01M ops/s   | +16401.5% | 165.01x    |
| or-n3412-r101-001 | full-execution-false | 5.23K ops/s  | 161.06K ops/s | +2979.9%  | 30.80x     |
| or-n1968-r105-001 | full-execution-false | 9.34K ops/s  | 282.08K ops/s | +2920.2%  | 30.20x     |
| or-n3412-r101-001 | complete-false       | 5.19K ops/s  | 150.13K ops/s | +2790.5%  | 28.90x     |
| or-n1968-r105-001 | complete-false       | 9.14K ops/s  | 262.62K ops/s | +2774.3%  | 28.74x     |
| or-n4691-r2-001   | partial-false        | 14.47K ops/s | 341.86K ops/s | +2263.3%  | 23.63x     |
| or-n1968-r105-001 | empty-context        | 74.21K ops/s | 1.43M ops/s   | +1831.0%  | 19.31x     |
| or-n1968-r105-001 | partial-false        | 73.98K ops/s | 1.41M ops/s   | +1803.6%  | 19.04x     |
| or-n1968-r105-001 | partial-true         | 76.35K ops/s | 1.35M ops/s   | +1665.8%  | 17.66x     |
| or-n4691-r2-001   | empty-context        | 14.54K ops/s | 245.64K ops/s | +1589.9%  | 16.90x     |
| or-n3412-r101-001 | full-execution-true  | 7.56K ops/s  | 124.78K ops/s | +1551.2%  | 16.51x     |
| or-n1968-r105-001 | full-execution-true  | 13.17K ops/s | 201.87K ops/s | +1433.3%  | 15.33x     |
| or-n3412-r101-001 | partial-false        | 44.81K ops/s | 619.30K ops/s | +1282.0%  | 13.82x     |
| or-n3412-r101-001 | empty-context        | 45.47K ops/s | 623.78K ops/s | +1271.8%  | 13.72x     |
| or-n3412-r101-001 | partial-true         | 44.48K ops/s | 604.97K ops/s | +1260.1%  | 13.60x     |
| or-n3412-r101-001 | complete-true        | 43.50K ops/s | 405.70K ops/s | +832.6%   | 9.33x      |
| in-n122-r1-001    | complete-false       | 1.12M ops/s  | 9.78M ops/s   | +774.9%   | 8.75x      |
| in-n122-r1-001    | full-execution-false | 1.13M ops/s  | 9.82M ops/s   | +767.7%   | 8.68x      |

### Top 20 Least Improved

| Group                 | Case           | Baseline     | Improved    | Delta  | Multiplier |
| --------------------- | -------------- | ------------ | ----------- | ------ | ---------- |
| 249-and-or-eqs        | complete-false | 10.39M ops/s | 5.68M ops/s | -45.3% | 0.55x      |
| 249-and-or-eqs        | partial-true   | 3.69M ops/s  | 3.38M ops/s | -8.3%  | 0.92x      |
| 249-and-or-eqs        | complete-true  | 3.69M ops/s  | 3.39M ops/s | -8.1%  | 0.92x      |
| overlap-n105-r100-014 | empty-context  | 8.21M ops/s  | 9.02M ops/s | +9.9%  | 1.10x      |
| overlap-n105-r100-020 | empty-context  | 8.22M ops/s  | 9.07M ops/s | +10.4% | 1.10x      |
| overlap-n105-r100-012 | partial-false  | 8.15M ops/s  | 9.02M ops/s | +10.7% | 1.11x      |
| overlap-n105-r100-022 | partial-false  | 8.13M ops/s  | 9.00M ops/s | +10.8% | 1.11x      |
| overlap-n105-r100-023 | empty-context  | 8.24M ops/s  | 9.13M ops/s | +10.8% | 1.11x      |
| overlap-n105-r100-021 | empty-context  | 8.23M ops/s  | 9.13M ops/s | +10.9% | 1.11x      |
| overlap-n105-r100-022 | empty-context  | 8.21M ops/s  | 9.12M ops/s | +11.1% | 1.11x      |
| overlap-n105-r100-018 | partial-false  | 8.13M ops/s  | 9.04M ops/s | +11.1% | 1.11x      |
| overlap-n105-r100-020 | partial-false  | 8.11M ops/s  | 9.02M ops/s | +11.2% | 1.11x      |
| overlap-n105-r100-013 | partial-false  | 8.12M ops/s  | 9.03M ops/s | +11.2% | 1.11x      |
| overlap-n105-r100-014 | partial-false  | 8.13M ops/s  | 9.05M ops/s | +11.3% | 1.11x      |
| overlap-n105-r100-011 | partial-false  | 8.09M ops/s  | 9.00M ops/s | +11.3% | 1.11x      |
| overlap-n105-r100-023 | partial-false  | 8.14M ops/s  | 9.06M ops/s | +11.4% | 1.11x      |
| overlap-n105-r100-021 | partial-false  | 8.10M ops/s  | 9.05M ops/s | +11.6% | 1.12x      |
| overlap-n105-r100-015 | partial-false  | 8.11M ops/s  | 9.06M ops/s | +11.6% | 1.12x      |
| overlap-n105-r100-018 | empty-context  | 8.23M ops/s  | 9.19M ops/s | +11.7% | 1.12x      |
| overlap-n105-r100-017 | empty-context  | 8.18M ops/s  | 9.13M ops/s | +11.7% | 1.12x      |

### Regressions

| Group          | Case           | Baseline     | Improved    | Delta  | Multiplier |
| -------------- | -------------- | ------------ | ----------- | ------ | ---------- |
| 249-and-or-eqs | complete-false | 10.39M ops/s | 5.68M ops/s | -45.3% | 0.55x      |
| 249-and-or-eqs | partial-true   | 3.69M ops/s  | 3.38M ops/s | -8.3%  | 0.92x      |
| 249-and-or-eqs | complete-true  | 3.69M ops/s  | 3.39M ops/s | -8.1%  | 0.92x      |
