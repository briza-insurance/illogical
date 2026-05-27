# Benchmark Comparison Report — simplify

**Baseline:** `results-sample-simplify-oop.json`
**Improved:** `results-sample-simplify-bytecode.json`
**Total cases compared:** 595

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 595 |
| Slower (>-5%) | 0 |
| Unchanged | 0 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n4691-r2-001 | full-execution-false | 24.73K ops/s | 8.49M ops/s | +34222.9% | 343.23x |
| or-n4691-r2-001 | full-execution-true | 24.83K ops/s | 8.03M ops/s | +32228.7% | 323.29x |
| or-n4691-r2-001 | complete-false | 32.93K ops/s | 6.19M ops/s | +18694.7% | 187.95x |
| or-n4691-r2-001 | partial-false | 12.01K ops/s | 1.13M ops/s | +9346.3% | 94.46x |
| or-n4691-r2-001 | empty-context | 12.13K ops/s | 1.14M ops/s | +9289.5% | 93.89x |
| or-n1968-r105-001 | full-execution-false | 6.32K ops/s | 220.91K ops/s | +3395.9% | 34.96x |
| or-n3412-r101-001 | full-execution-false | 3.65K ops/s | 125.87K ops/s | +3351.5% | 34.52x |
| or-n3412-r101-001 | complete-false | 3.58K ops/s | 119.67K ops/s | +3242.3% | 33.42x |
| or-n1968-r105-001 | complete-false | 6.21K ops/s | 201.44K ops/s | +3142.3% | 32.42x |
| or-n1968-r105-001 | empty-context | 62.10K ops/s | 1.64M ops/s | +2543.5% | 26.44x |
| or-n1968-r105-001 | partial-false | 62.60K ops/s | 1.64M ops/s | +2527.0% | 26.27x |
| or-n1968-r105-001 | partial-true | 62.02K ops/s | 1.57M ops/s | +2433.5% | 25.34x |
| or-n3412-r101-001 | empty-context | 37.47K ops/s | 751.40K ops/s | +1905.3% | 20.05x |
| or-n3412-r101-001 | partial-false | 37.44K ops/s | 749.91K ops/s | +1902.8% | 20.03x |
| or-n3412-r101-001 | partial-true | 37.39K ops/s | 727.87K ops/s | +1846.5% | 19.46x |
| or-n3412-r101-001 | full-execution-true | 5.22K ops/s | 100.02K ops/s | +1817.6% | 19.18x |
| or-n1968-r105-001 | full-execution-true | 9.05K ops/s | 164.57K ops/s | +1718.3% | 18.18x |
| in-n122-r1-001 | full-execution-false | 866.54K ops/s | 9.42M ops/s | +986.6% | 10.87x |
| in-n122-r1-001 | complete-false | 873.59K ops/s | 9.37M ops/s | +973.0% | 10.73x |
| in-n122-r1-001 | partial-true | 959.26K ops/s | 9.85M ops/s | +927.3% | 10.27x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n105-r100-020 | partial-false | 7.19M ops/s | 8.35M ops/s | +16.0% | 1.16x |
| overlap-n105-r100-022 | partial-false | 7.23M ops/s | 8.68M ops/s | +20.0% | 1.20x |
| overlap-n105-r100-022 | empty-context | 7.15M ops/s | 8.59M ops/s | +20.0% | 1.20x |
| overlap-n105-r100-017 | partial-false | 7.18M ops/s | 8.65M ops/s | +20.5% | 1.21x |
| overlap-n105-r100-015 | partial-false | 7.22M ops/s | 8.75M ops/s | +21.2% | 1.21x |
| overlap-n105-r100-012 | partial-false | 7.19M ops/s | 8.72M ops/s | +21.3% | 1.21x |
| overlap-n105-r100-012 | empty-context | 7.15M ops/s | 8.69M ops/s | +21.5% | 1.22x |
| overlap-n105-r100-005 | partial-false | 7.14M ops/s | 8.71M ops/s | +22.1% | 1.22x |
| overlap-n105-r100-017 | empty-context | 7.09M ops/s | 8.69M ops/s | +22.5% | 1.23x |
| overlap-n105-r100-019 | partial-false | 7.20M ops/s | 8.83M ops/s | +22.6% | 1.23x |
| overlap-n105-r100-010 | partial-false | 7.22M ops/s | 8.87M ops/s | +22.9% | 1.23x |
| overlap-n105-r100-009 | partial-false | 7.17M ops/s | 8.81M ops/s | +22.9% | 1.23x |
| overlap-n105-r100-006 | partial-false | 7.15M ops/s | 8.80M ops/s | +23.1% | 1.23x |
| overlap-n105-r100-011 | partial-false | 7.23M ops/s | 8.90M ops/s | +23.1% | 1.23x |
| overlap-n105-r100-009 | empty-context | 7.15M ops/s | 8.81M ops/s | +23.3% | 1.23x |
| overlap-n105-r100-013 | empty-context | 7.18M ops/s | 8.86M ops/s | +23.3% | 1.23x |
| overlap-n105-r100-013 | partial-false | 7.15M ops/s | 8.83M ops/s | +23.5% | 1.23x |
| overlap-n105-r100-018 | partial-false | 7.15M ops/s | 8.83M ops/s | +23.5% | 1.24x |
| overlap-n105-r100-018 | empty-context | 7.13M ops/s | 8.83M ops/s | +23.8% | 1.24x |
| overlap-n105-r100-020 | empty-context | 7.11M ops/s | 8.83M ops/s | +24.2% | 1.24x |

### Regressions

_No regressions._

