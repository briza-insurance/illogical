# Benchmark Comparison Report — simplify

**Baseline:** `results-sample-simplify-oop.json`
**Improved:** `results-sample-simplify-bytecode.json`
**Total cases compared:** 616

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 562 |
| Slower (>-5%) | 15 |
| Unchanged | 39 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n3412-r101-001 | full-execution-false | 5.18K ops/s | 177.65K ops/s | +3329.2% | 34.29x |
| or-n3412-r101-001 | complete-false | 5.15K ops/s | 168.26K ops/s | +3168.2% | 32.68x |
| or-n1968-r105-001 | full-execution-false | 9.20K ops/s | 262.13K ops/s | +2747.9% | 28.48x |
| or-n1968-r105-001 | complete-false | 9.09K ops/s | 252.96K ops/s | +2681.6% | 27.82x |
| or-n1968-r105-001 | empty-context | 74.18K ops/s | 1.59M ops/s | +2042.6% | 21.43x |
| or-n1968-r105-001 | partial-false | 75.21K ops/s | 1.56M ops/s | +1972.6% | 20.73x |
| or-n1968-r105-001 | partial-true | 74.48K ops/s | 1.50M ops/s | +1915.8% | 20.16x |
| or-n3412-r101-001 | full-execution-true | 7.55K ops/s | 130.76K ops/s | +1632.4% | 17.32x |
| or-n1968-r105-001 | full-execution-true | 13.15K ops/s | 212.04K ops/s | +1512.5% | 16.13x |
| or-n3412-r101-001 | empty-context | 44.87K ops/s | 688.29K ops/s | +1433.9% | 15.34x |
| or-n3412-r101-001 | partial-false | 44.88K ops/s | 676.12K ops/s | +1406.6% | 15.07x |
| or-n3412-r101-001 | partial-true | 44.84K ops/s | 652.32K ops/s | +1354.9% | 14.55x |
| or-n3412-r101-001 | complete-true | 41.71K ops/s | 378.51K ops/s | +807.4% | 9.07x |
| in-n122-r1-001 | full-execution-false | 1.07M ops/s | 9.09M ops/s | +750.8% | 8.51x |
| in-n122-r1-001 | complete-false | 1.09M ops/s | 8.91M ops/s | +719.5% | 8.20x |
| or-n3730-r105-001 | complete-false | 7.05K ops/s | 51.40K ops/s | +629.0% | 7.29x |
| or-n3730-r105-001 | full-execution-false | 7.10K ops/s | 51.63K ops/s | +626.9% | 7.27x |
| in-n122-r1-001 | partial-true | 1.19M ops/s | 8.60M ops/s | +624.4% | 7.24x |
| in-n122-r1-001 | full-execution-true | 1.18M ops/s | 8.53M ops/s | +621.1% | 7.21x |
| in-n122-r1-001 | empty-context | 1.18M ops/s | 8.15M ops/s | +593.6% | 6.94x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 249-and-or-eqs | complete-false | 10.57M ops/s | 6.12M ops/s | -42.1% | 0.58x |
| 251-or-and-in-mixed-eq-in | partial-true | 7.10M ops/s | 4.47M ops/s | -37.0% | 0.63x |
| 250-or-and-in | partial-true | 7.08M ops/s | 4.49M ops/s | -36.5% | 0.64x |
| 250-or-and-in | complete-false | 6.37M ops/s | 4.06M ops/s | -36.2% | 0.64x |
| 250-or-and-in | complete-true | 7.09M ops/s | 4.54M ops/s | -36.0% | 0.64x |
| 251-or-and-in-mixed-eq-in | complete-true | 7.05M ops/s | 4.52M ops/s | -35.9% | 0.64x |
| 251-or-and-in-mixed-eq-in | complete-false | 5.31M ops/s | 3.80M ops/s | -28.4% | 0.72x |
| 251-or-and-in-mixed-eq-in | full-execution-true | 4.30M ops/s | 3.13M ops/s | -27.3% | 0.73x |
| 249-and-or-eqs | complete-true | 3.74M ops/s | 2.78M ops/s | -25.7% | 0.74x |
| 249-and-or-eqs | partial-true | 3.69M ops/s | 2.77M ops/s | -24.8% | 0.75x |
| 250-or-and-in | full-execution-true | 3.88M ops/s | 3.10M ops/s | -20.0% | 0.80x |
| 250-or-and-in | full-execution-false | 3.84M ops/s | 3.08M ops/s | -19.8% | 0.80x |
| 251-or-and-in-mixed-eq-in | full-execution-false | 3.57M ops/s | 2.89M ops/s | -18.9% | 0.81x |
| 249-and-or-eqs | full-execution-true | 2.61M ops/s | 2.19M ops/s | -15.9% | 0.84x |
| 249-and-or-eqs | full-execution-false | 2.54M ops/s | 2.18M ops/s | -14.0% | 0.86x |
| overlap-n105-r100-023 | empty-context | 8.53M ops/s | 8.37M ops/s | -1.9% | 0.98x |
| 250-or-and-in | empty-context | 1.69M ops/s | 1.66M ops/s | -1.8% | 0.98x |
| 251-or-and-in-mixed-eq-in | empty-context | 1.65M ops/s | 1.64M ops/s | -0.9% | 0.99x |
| 250-or-and-in | partial-false | 1.67M ops/s | 1.66M ops/s | -0.8% | 0.99x |
| 251-or-and-in-mixed-eq-in | partial-false | 1.64M ops/s | 1.62M ops/s | -0.7% | 0.99x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 249-and-or-eqs | complete-false | 10.57M ops/s | 6.12M ops/s | -42.1% | 0.58x |
| 251-or-and-in-mixed-eq-in | partial-true | 7.10M ops/s | 4.47M ops/s | -37.0% | 0.63x |
| 250-or-and-in | partial-true | 7.08M ops/s | 4.49M ops/s | -36.5% | 0.64x |
| 250-or-and-in | complete-false | 6.37M ops/s | 4.06M ops/s | -36.2% | 0.64x |
| 250-or-and-in | complete-true | 7.09M ops/s | 4.54M ops/s | -36.0% | 0.64x |
| 251-or-and-in-mixed-eq-in | complete-true | 7.05M ops/s | 4.52M ops/s | -35.9% | 0.64x |
| 251-or-and-in-mixed-eq-in | complete-false | 5.31M ops/s | 3.80M ops/s | -28.4% | 0.72x |
| 251-or-and-in-mixed-eq-in | full-execution-true | 4.30M ops/s | 3.13M ops/s | -27.3% | 0.73x |
| 249-and-or-eqs | complete-true | 3.74M ops/s | 2.78M ops/s | -25.7% | 0.74x |
| 249-and-or-eqs | partial-true | 3.69M ops/s | 2.77M ops/s | -24.8% | 0.75x |
| 250-or-and-in | full-execution-true | 3.88M ops/s | 3.10M ops/s | -20.0% | 0.80x |
| 250-or-and-in | full-execution-false | 3.84M ops/s | 3.08M ops/s | -19.8% | 0.80x |
| 251-or-and-in-mixed-eq-in | full-execution-false | 3.57M ops/s | 2.89M ops/s | -18.9% | 0.81x |
| 249-and-or-eqs | full-execution-true | 2.61M ops/s | 2.19M ops/s | -15.9% | 0.84x |
| 249-and-or-eqs | full-execution-false | 2.54M ops/s | 2.18M ops/s | -14.0% | 0.86x |

