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
| or-n4691-r2-001 | full-execution-false | 24.73K ops/s | 9.02M ops/s | +36391.0% | 364.91x |
| or-n4691-r2-001 | full-execution-true | 24.54K ops/s | 8.61M ops/s | +34981.2% | 350.81x |
| or-n4691-r2-001 | complete-false | 33.06K ops/s | 6.36M ops/s | +19131.9% | 192.32x |
| or-n4691-r2-001 | empty-context | 12.01K ops/s | 1.15M ops/s | +9438.1% | 95.38x |
| or-n4691-r2-001 | partial-false | 12.05K ops/s | 1.13M ops/s | +9296.8% | 93.97x |
| or-n3412-r101-001 | full-execution-false | 3.57K ops/s | 136.31K ops/s | +3719.7% | 38.20x |
| or-n3412-r101-001 | complete-false | 3.58K ops/s | 129.41K ops/s | +3513.0% | 36.13x |
| or-n1968-r105-001 | full-execution-false | 6.29K ops/s | 224.35K ops/s | +3464.6% | 35.65x |
| or-n1968-r105-001 | complete-false | 6.20K ops/s | 211.11K ops/s | +3302.9% | 34.03x |
| or-n1968-r105-001 | empty-context | 60.75K ops/s | 1.71M ops/s | +2708.7% | 28.09x |
| or-n1968-r105-001 | partial-false | 62.14K ops/s | 1.70M ops/s | +2643.0% | 27.43x |
| or-n1968-r105-001 | partial-true | 61.26K ops/s | 1.62M ops/s | +2550.0% | 26.50x |
| or-n3412-r101-001 | empty-context | 36.46K ops/s | 762.73K ops/s | +1991.9% | 20.92x |
| or-n3412-r101-001 | partial-false | 37.21K ops/s | 773.01K ops/s | +1977.2% | 20.77x |
| or-n3412-r101-001 | partial-true | 36.23K ops/s | 748.42K ops/s | +1965.9% | 20.66x |
| or-n3412-r101-001 | full-execution-true | 5.04K ops/s | 95.95K ops/s | +1803.7% | 19.04x |
| or-n1968-r105-001 | full-execution-true | 9.02K ops/s | 158.44K ops/s | +1656.1% | 17.56x |
| in-n122-r1-001 | full-execution-false | 827.38K ops/s | 10.55M ops/s | +1174.7% | 12.75x |
| in-n122-r1-001 | complete-false | 822.39K ops/s | 10.24M ops/s | +1145.8% | 12.46x |
| in-n122-r1-001 | partial-true | 878.93K ops/s | 10.53M ops/s | +1098.4% | 11.98x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n106-r100-007 | partial-false | 6.64M ops/s | 8.34M ops/s | +25.6% | 1.26x |
| overlap-n105-r100-010 | partial-false | 7.02M ops/s | 8.93M ops/s | +27.3% | 1.27x |
| overlap-n105-r100-008 | empty-context | 6.99M ops/s | 8.91M ops/s | +27.4% | 1.27x |
| overlap-n105-r100-012 | empty-context | 6.98M ops/s | 8.90M ops/s | +27.7% | 1.28x |
| overlap-n105-r100-022 | partial-false | 6.96M ops/s | 8.89M ops/s | +27.7% | 1.28x |
| overlap-n105-r100-007 | empty-context | 6.96M ops/s | 8.91M ops/s | +27.9% | 1.28x |
| overlap-n105-r100-016 | partial-false | 6.99M ops/s | 8.96M ops/s | +28.1% | 1.28x |
| overlap-n105-r100-007 | partial-false | 6.94M ops/s | 8.90M ops/s | +28.2% | 1.28x |
| overlap-n105-r100-011 | partial-false | 6.93M ops/s | 8.88M ops/s | +28.2% | 1.28x |
| overlap-n105-r100-010 | empty-context | 6.98M ops/s | 8.95M ops/s | +28.3% | 1.28x |
| overlap-n105-r100-009 | empty-context | 7.01M ops/s | 8.99M ops/s | +28.3% | 1.28x |
| overlap-n105-r100-008 | partial-false | 6.96M ops/s | 8.95M ops/s | +28.5% | 1.28x |
| overlap-n105-r100-015 | empty-context | 6.99M ops/s | 9.00M ops/s | +28.6% | 1.29x |
| overlap-n105-r100-005 | partial-false | 6.99M ops/s | 9.00M ops/s | +28.7% | 1.29x |
| overlap-n105-r100-021 | empty-context | 6.95M ops/s | 8.96M ops/s | +28.8% | 1.29x |
| overlap-n105-r100-023 | partial-false | 7.03M ops/s | 9.06M ops/s | +28.9% | 1.29x |
| overlap-n105-r100-023 | empty-context | 7.00M ops/s | 9.02M ops/s | +28.9% | 1.29x |
| overlap-n105-r100-020 | partial-false | 6.92M ops/s | 8.93M ops/s | +29.0% | 1.29x |
| overlap-n105-r100-012 | partial-false | 7.00M ops/s | 9.04M ops/s | +29.1% | 1.29x |
| overlap-n105-r100-022 | empty-context | 6.98M ops/s | 9.01M ops/s | +29.1% | 1.29x |

### Regressions

_No regressions._

