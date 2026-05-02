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
| or-n4691-r2-001 | full-execution-false | 34.28K ops/s | 11.03M ops/s | +32077.7% | 321.78x |
| or-n4691-r2-001 | full-execution-true | 34.34K ops/s | 10.78M ops/s | +31284.8% | 313.85x |
| or-n4691-r2-001 | complete-false | 45.37K ops/s | 9.21M ops/s | +20207.2% | 203.07x |
| or-n4691-r2-001 | empty-context | 16.67K ops/s | 1.44M ops/s | +8522.5% | 86.22x |
| or-n4691-r2-001 | partial-false | 16.68K ops/s | 1.44M ops/s | +8503.6% | 86.04x |
| or-n1968-r105-001 | partial-false | 75.83K ops/s | 2.68M ops/s | +3430.1% | 35.30x |
| or-n1968-r105-001 | empty-context | 75.52K ops/s | 2.61M ops/s | +3358.5% | 34.59x |
| or-n1968-r105-001 | partial-true | 76.36K ops/s | 2.53M ops/s | +3207.9% | 33.08x |
| or-n3412-r101-001 | full-execution-false | 6.34K ops/s | 195.00K ops/s | +2977.2% | 30.77x |
| or-n3412-r101-001 | complete-false | 6.31K ops/s | 191.02K ops/s | +2927.2% | 30.27x |
| or-n1968-r105-001 | full-execution-false | 10.99K ops/s | 313.19K ops/s | +2750.1% | 28.50x |
| or-n1968-r105-001 | complete-false | 10.87K ops/s | 290.52K ops/s | +2573.4% | 26.73x |
| or-n3412-r101-001 | empty-context | 45.69K ops/s | 1.20M ops/s | +2527.5% | 26.27x |
| or-n3412-r101-001 | partial-true | 45.52K ops/s | 1.19M ops/s | +2523.2% | 26.23x |
| or-n3412-r101-001 | partial-false | 46.24K ops/s | 1.21M ops/s | +2515.6% | 26.16x |
| in-n122-r1-001 | complete-false | 1.04M ops/s | 17.98M ops/s | +1630.9% | 17.31x |
| or-n3412-r101-001 | full-execution-true | 8.27K ops/s | 143.17K ops/s | +1630.2% | 17.30x |
| in-n122-r1-001 | full-execution-false | 1.05M ops/s | 18.04M ops/s | +1618.9% | 17.19x |
| or-n1968-r105-001 | full-execution-true | 14.29K ops/s | 231.86K ops/s | +1522.0% | 16.22x |
| in-n122-r1-001 | partial-false | 1.08M ops/s | 17.34M ops/s | +1512.6% | 16.13x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n105-r100-020 | empty-context | 10.72M ops/s | 12.91M ops/s | +20.5% | 1.20x |
| overlap-n105-r100-012 | empty-context | 10.73M ops/s | 13.28M ops/s | +23.8% | 1.24x |
| overlap-n105-r100-001 | partial-false | 10.91M ops/s | 13.81M ops/s | +26.6% | 1.27x |
| overlap-n105-r100-006 | partial-false | 10.92M ops/s | 13.91M ops/s | +27.3% | 1.27x |
| overlap-n105-r100-017 | empty-context | 10.55M ops/s | 13.43M ops/s | +27.3% | 1.27x |
| overlap-n105-r100-011 | empty-context | 10.72M ops/s | 13.71M ops/s | +27.8% | 1.28x |
| overlap-n105-r100-021 | empty-context | 10.66M ops/s | 13.70M ops/s | +28.5% | 1.28x |
| overlap-n105-r100-005 | partial-false | 10.87M ops/s | 13.97M ops/s | +28.5% | 1.28x |
| overlap-n105-r100-012 | partial-false | 10.88M ops/s | 14.02M ops/s | +28.9% | 1.29x |
| overlap-n105-r100-015 | empty-context | 10.61M ops/s | 13.70M ops/s | +29.1% | 1.29x |
| overlap-n105-r100-013 | empty-context | 10.69M ops/s | 13.82M ops/s | +29.3% | 1.29x |
| overlap-n105-r100-007 | empty-context | 10.58M ops/s | 13.73M ops/s | +29.8% | 1.30x |
| overlap-n105-r100-005 | empty-context | 10.52M ops/s | 13.65M ops/s | +29.8% | 1.30x |
| overlap-n105-r100-002 | empty-context | 10.42M ops/s | 13.56M ops/s | +30.1% | 1.30x |
| overlap-n105-r100-003 | empty-context | 10.33M ops/s | 13.44M ops/s | +30.1% | 1.30x |
| overlap-n105-r100-002 | partial-false | 10.80M ops/s | 14.06M ops/s | +30.2% | 1.30x |
| overlap-n105-r100-017 | partial-false | 10.97M ops/s | 14.29M ops/s | +30.2% | 1.30x |
| overlap-n105-r100-008 | empty-context | 10.50M ops/s | 13.68M ops/s | +30.3% | 1.30x |
| overlap-n105-r100-008 | partial-false | 10.92M ops/s | 14.24M ops/s | +30.5% | 1.30x |
| overlap-n105-r100-016 | empty-context | 10.60M ops/s | 13.85M ops/s | +30.6% | 1.31x |

### Regressions

_No regressions._

