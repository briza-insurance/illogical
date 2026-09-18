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
| or-n4691-r2-001 | full-execution-false | 4.06K ops/s | 37.30M ops/s | +918593.9% | 9186.94x |
| or-n4691-r2-001 | empty-context | 4.04K ops/s | 36.51M ops/s | +903431.0% | 9035.31x |
| or-n4691-r2-001 | partial-false | 4.09K ops/s | 36.90M ops/s | +901718.6% | 9018.19x |
| or-n4691-r2-001 | partial-true | 4.16K ops/s | 37.14M ops/s | +892258.8% | 8923.59x |
| or-n4691-r2-001 | full-execution-true | 4.12K ops/s | 35.86M ops/s | +871027.5% | 8711.28x |
| or-n4691-r2-001 | complete-true | 4.20K ops/s | 35.93M ops/s | +854606.7% | 8547.07x |
| or-n4691-r2-001 | complete-false | 4.19K ops/s | 35.78M ops/s | +853883.4% | 8539.83x |
| or-n3412-r101-001 | partial-false | 6.60K ops/s | 37.88M ops/s | +573751.0% | 5738.51x |
| or-n3412-r101-001 | full-execution-true | 6.65K ops/s | 37.58M ops/s | +564772.2% | 5648.72x |
| or-n3412-r101-001 | partial-true | 6.63K ops/s | 36.79M ops/s | +554474.2% | 5545.74x |
| or-n3412-r101-001 | full-execution-false | 6.55K ops/s | 36.18M ops/s | +552128.8% | 5522.29x |
| or-n3412-r101-001 | empty-context | 6.58K ops/s | 36.09M ops/s | +548151.8% | 5482.52x |
| or-n3412-r101-001 | complete-false | 6.64K ops/s | 36.37M ops/s | +548033.4% | 5481.33x |
| or-n3412-r101-001 | complete-true | 6.57K ops/s | 35.72M ops/s | +543588.1% | 5436.88x |
| or-n1968-r105-001 | full-execution-true | 11.00K ops/s | 35.79M ops/s | +325250.3% | 3253.50x |
| or-n1968-r105-001 | full-execution-false | 10.97K ops/s | 35.36M ops/s | +322343.7% | 3224.44x |
| or-n3730-r105-001 | complete-false | 11.70K ops/s | 37.54M ops/s | +320730.4% | 3208.30x |
| or-n1968-r105-001 | partial-true | 11.08K ops/s | 35.47M ops/s | +320088.9% | 3201.89x |
| or-n3730-r105-001 | full-execution-false | 11.76K ops/s | 37.44M ops/s | +318376.8% | 3184.77x |
| or-n3730-r105-001 | complete-true | 11.76K ops/s | 37.15M ops/s | +315877.2% | 3159.77x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n11-r5-001 | complete-false | 2.23M ops/s | 34.64M ops/s | +1455.0% | 15.55x |
| overlap-n11-r5-001 | full-execution-true | 2.25M ops/s | 35.21M ops/s | +1464.7% | 15.65x |
| overlap-n11-r5-001 | full-execution-false | 2.26M ops/s | 35.47M ops/s | +1472.2% | 15.72x |
| overlap-n11-r5-001 | partial-true | 2.24M ops/s | 35.34M ops/s | +1480.5% | 15.81x |
| overlap-n11-r5-001 | partial-false | 2.24M ops/s | 35.68M ops/s | +1491.3% | 15.91x |
| overlap-n11-r5-001 | complete-true | 2.25M ops/s | 35.95M ops/s | +1501.3% | 16.01x |
| overlap-n11-r5-001 | empty-context | 2.23M ops/s | 36.05M ops/s | +1515.3% | 16.15x |
| overlap-n12-r5-001 | complete-true | 1.88M ops/s | 33.63M ops/s | +1690.5% | 17.90x |
| overlap-n12-r5-001 | full-execution-false | 1.93M ops/s | 36.22M ops/s | +1772.7% | 18.73x |
| overlap-n12-r5-001 | empty-context | 1.91M ops/s | 36.29M ops/s | +1799.1% | 18.99x |
| overlap-n12-r5-001 | partial-false | 1.89M ops/s | 36.08M ops/s | +1805.0% | 19.05x |
| overlap-n12-r5-001 | partial-true | 1.93M ops/s | 37.02M ops/s | +1816.1% | 19.16x |
| overlap-n12-r5-001 | full-execution-true | 1.91M ops/s | 36.67M ops/s | +1823.3% | 19.23x |
| overlap-n12-r5-001 | complete-false | 1.89M ops/s | 36.64M ops/s | +1841.5% | 19.42x |
| 250-or-and-in | partial-true | 981.63K ops/s | 35.79M ops/s | +3545.8% | 36.46x |
| 250-or-and-in | full-execution-true | 989.54K ops/s | 36.68M ops/s | +3606.7% | 37.07x |
| 250-or-and-in | complete-true | 989.55K ops/s | 36.90M ops/s | +3628.5% | 37.29x |
| 250-or-and-in | empty-context | 982.62K ops/s | 36.79M ops/s | +3643.8% | 37.44x |
| 250-or-and-in | partial-false | 992.97K ops/s | 37.24M ops/s | +3650.5% | 37.50x |
| 250-or-and-in | full-execution-false | 966.09K ops/s | 38.07M ops/s | +3840.2% | 39.40x |

### Regressions

_No regressions._

