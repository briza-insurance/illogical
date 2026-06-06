# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 87

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 87 |
| Slower (>-5%) | 0 |
| Unchanged | 0 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| in-n1224-r1-10x | complete-false | 87.29K ops/s | 12.18M ops/s | +13852.6% | 139.53x |
| in-n1224-r1-10x | full-execution-false | 87.40K ops/s | 12.17M ops/s | +13826.8% | 139.27x |
| in-n1224-r1-10x | partial-true | 93.27K ops/s | 11.76M ops/s | +12508.6% | 126.09x |
| in-n1224-r1-10x | partial-false | 91.13K ops/s | 11.34M ops/s | +12341.8% | 124.42x |
| in-n1224-r1-10x | full-execution-true | 94.25K ops/s | 11.66M ops/s | +12267.8% | 123.68x |
| in-n1224-r1-10x | complete-true | 94.38K ops/s | 11.57M ops/s | +12162.5% | 122.62x |
| in-n1224-r1-10x | empty-context | 92.10K ops/s | 11.11M ops/s | +11960.7% | 120.61x |
| in-n614-r1-5x | full-execution-false | 173.54K ops/s | 11.79M ops/s | +6693.6% | 67.94x |
| in-n614-r1-5x | complete-false | 173.99K ops/s | 11.80M ops/s | +6682.0% | 67.82x |
| in-n614-r1-5x | complete-true | 184.68K ops/s | 11.17M ops/s | +5949.7% | 60.50x |
| in-n614-r1-5x | full-execution-true | 188.22K ops/s | 11.30M ops/s | +5906.2% | 60.06x |
| in-n614-r1-5x | partial-false | 187.15K ops/s | 11.24M ops/s | +5904.5% | 60.05x |
| in-n614-r1-5x | empty-context | 187.87K ops/s | 11.08M ops/s | +5797.0% | 58.97x |
| in-n614-r1-5x | partial-true | 191.20K ops/s | 11.20M ops/s | +5757.0% | 58.57x |
| overlap-n447-r50-10x | partial-false | 289.49K ops/s | 11.70M ops/s | +3940.1% | 40.40x |
| overlap-n447-r50-10x | empty-context | 289.75K ops/s | 11.37M ops/s | +3824.7% | 39.25x |
| overlap-n447-r50-10x | complete-true | 285.62K ops/s | 10.48M ops/s | +3568.5% | 36.69x |
| overlap-n447-r50-10x | full-execution-true | 287.12K ops/s | 10.48M ops/s | +3550.3% | 36.50x |
| overlap-n447-r50-10x | partial-true | 285.31K ops/s | 10.06M ops/s | +3427.1% | 35.27x |
| overlap-n252-r25-5x | empty-context | 519.91K ops/s | 11.54M ops/s | +2119.4% | 22.19x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | partial-true | 8.08M ops/s | 10.11M ops/s | +25.1% | 1.25x |
| expression-medium-or | complete-true | 8.00M ops/s | 10.09M ops/s | +26.0% | 1.26x |
| expression-simple-eq | complete-true | 10.03M ops/s | 12.86M ops/s | +28.2% | 1.28x |
| expression-simple-eq | partial-true | 10.09M ops/s | 12.98M ops/s | +28.7% | 1.29x |
| expression-simple-eq | complete-false | 9.94M ops/s | 12.83M ops/s | +29.2% | 1.29x |
| expression-reference-nested | complete-false | 7.30M ops/s | 9.47M ops/s | +29.7% | 1.30x |
| expression-simple-ne | empty-context | 8.62M ops/s | 11.20M ops/s | +29.8% | 1.30x |
| expression-simple-ne | complete-true | 10.30M ops/s | 13.52M ops/s | +31.2% | 1.31x |
| expression-simple-eq | full-execution-true | 10.03M ops/s | 13.18M ops/s | +31.4% | 1.31x |
| expression-medium-and | complete-false | 7.71M ops/s | 10.16M ops/s | +31.8% | 1.32x |
| expression-date-arithmetic | complete-false | 7.75M ops/s | 10.23M ops/s | +32.0% | 1.32x |
| expression-deep-nested | complete-false | 7.32M ops/s | 9.66M ops/s | +32.0% | 1.32x |
| expression-simple-ne | partial-true | 8.48M ops/s | 11.41M ops/s | +34.5% | 1.34x |
| expression-simple-ne | full-execution-true | 8.54M ops/s | 11.52M ops/s | +34.8% | 1.35x |
| expression-complex-nested | complete-false | 7.38M ops/s | 10.05M ops/s | +36.1% | 1.36x |
| expression-simple-eq | empty-context | 8.17M ops/s | 11.13M ops/s | +36.2% | 1.36x |
| expression-simple-eq | full-execution-false | 9.76M ops/s | 13.35M ops/s | +36.9% | 1.37x |
| expression-simple-eq | partial-false | 8.24M ops/s | 11.32M ops/s | +37.4% | 1.37x |
| expression-reference-nested | full-execution-false | 3.81M ops/s | 5.64M ops/s | +48.2% | 1.48x |
| expression-arithmetic | partial-false | 2.11M ops/s | 3.34M ops/s | +58.1% | 1.58x |

### Regressions

_No regressions._

