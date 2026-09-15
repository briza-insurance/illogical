# Benchmark Comparison Report — parse

**Baseline:** `results-sample-parse-oop.json`
**Improved:** `results-sample-parse-bytecode.json`
**Total cases compared:** 616

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 616 |
| Slower (>-5%) | 0 |
| Unchanged | 0 |

---

## parse

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n4691-r2-001 | partial-true | 4.14K ops/s | 38.25M ops/s | +923391.4% | 9234.91x |
| or-n4691-r2-001 | complete-false | 4.15K ops/s | 38.26M ops/s | +921537.8% | 9216.38x |
| or-n4691-r2-001 | complete-true | 4.15K ops/s | 38.28M ops/s | +921393.1% | 9214.93x |
| or-n4691-r2-001 | full-execution-true | 4.16K ops/s | 38.14M ops/s | +916220.5% | 9163.20x |
| or-n4691-r2-001 | empty-context | 4.15K ops/s | 38.00M ops/s | +915716.0% | 9158.16x |
| or-n4691-r2-001 | partial-false | 4.14K ops/s | 37.93M ops/s | +915638.4% | 9157.38x |
| or-n4691-r2-001 | full-execution-false | 4.15K ops/s | 37.67M ops/s | +906544.2% | 9066.44x |
| or-n3412-r101-001 | partial-false | 6.80K ops/s | 38.63M ops/s | +568015.9% | 5681.16x |
| or-n3412-r101-001 | complete-true | 6.74K ops/s | 38.23M ops/s | +567558.9% | 5676.59x |
| or-n3412-r101-001 | complete-false | 6.78K ops/s | 38.41M ops/s | +566493.0% | 5665.93x |
| or-n3412-r101-001 | empty-context | 6.81K ops/s | 38.58M ops/s | +566445.9% | 5665.46x |
| or-n3412-r101-001 | full-execution-true | 6.77K ops/s | 38.27M ops/s | +564984.7% | 5650.85x |
| or-n3412-r101-001 | partial-true | 6.81K ops/s | 38.28M ops/s | +562046.4% | 5621.46x |
| or-n3412-r101-001 | full-execution-false | 6.80K ops/s | 37.99M ops/s | +558859.0% | 5589.59x |
| or-n1968-r105-001 | complete-false | 11.01K ops/s | 38.60M ops/s | +350671.4% | 3507.71x |
| or-n1968-r105-001 | complete-true | 11.02K ops/s | 38.44M ops/s | +348747.1% | 3488.47x |
| or-n1968-r105-001 | empty-context | 11.07K ops/s | 38.25M ops/s | +345362.9% | 3454.63x |
| or-n1968-r105-001 | full-execution-true | 11.15K ops/s | 38.51M ops/s | +345303.5% | 3454.03x |
| or-n1968-r105-001 | full-execution-false | 11.22K ops/s | 38.42M ops/s | +342431.4% | 3425.31x |
| or-n1968-r105-001 | partial-true | 11.47K ops/s | 38.63M ops/s | +336612.8% | 3367.13x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n11-r5-001 | empty-context | 2.29M ops/s | 34.57M ops/s | +1412.6% | 15.13x |
| overlap-n11-r5-001 | full-execution-false | 2.28M ops/s | 37.25M ops/s | +1536.4% | 16.36x |
| overlap-n11-r5-001 | complete-true | 2.29M ops/s | 37.69M ops/s | +1549.3% | 16.49x |
| overlap-n11-r5-001 | full-execution-true | 2.28M ops/s | 37.78M ops/s | +1553.6% | 16.54x |
| overlap-n11-r5-001 | complete-false | 2.28M ops/s | 37.87M ops/s | +1559.3% | 16.59x |
| overlap-n11-r5-001 | partial-false | 2.28M ops/s | 37.96M ops/s | +1561.8% | 16.62x |
| overlap-n11-r5-001 | partial-true | 2.18M ops/s | 37.34M ops/s | +1613.2% | 17.13x |
| overlap-n12-r5-001 | full-execution-true | 2.00M ops/s | 37.66M ops/s | +1778.6% | 18.79x |
| overlap-n12-r5-001 | full-execution-false | 1.94M ops/s | 37.15M ops/s | +1810.9% | 19.11x |
| overlap-n12-r5-001 | partial-false | 1.98M ops/s | 37.80M ops/s | +1811.5% | 19.11x |
| overlap-n12-r5-001 | empty-context | 1.96M ops/s | 37.72M ops/s | +1824.4% | 19.24x |
| overlap-n12-r5-001 | complete-true | 1.96M ops/s | 37.78M ops/s | +1824.9% | 19.25x |
| overlap-n12-r5-001 | complete-false | 1.95M ops/s | 37.84M ops/s | +1840.5% | 19.40x |
| overlap-n12-r5-001 | partial-true | 1.92M ops/s | 37.84M ops/s | +1874.5% | 19.74x |
| 250-or-and-in | complete-false | 1.07M ops/s | 37.42M ops/s | +3400.0% | 35.00x |
| 250-or-and-in | partial-false | 1.06M ops/s | 37.95M ops/s | +3469.5% | 35.69x |
| 250-or-and-in | empty-context | 1.07M ops/s | 38.48M ops/s | +3494.4% | 35.94x |
| 250-or-and-in | full-execution-false | 1.07M ops/s | 38.71M ops/s | +3532.2% | 36.32x |
| 250-or-and-in | complete-true | 1.06M ops/s | 38.60M ops/s | +3542.4% | 36.42x |
| 250-or-and-in | partial-true | 1.06M ops/s | 38.52M ops/s | +3548.8% | 36.49x |

### Regressions

_No regressions._

