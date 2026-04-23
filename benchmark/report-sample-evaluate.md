# Benchmark Comparison Report — evaluate

**Baseline:** `results-sample-evaluate-oop.json`
**Improved:** `results-sample-evaluate-bytecode.json`
**Total cases compared:** 765

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 765 |
| Slower (>-5%) | 0 |
| Unchanged | 0 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n4691-r2-001 | late-true | 64.20K ops/s | 14.38M ops/s | +22302.6% | 224.03x |
| or-n4691-r2-001 | full-execution-false | 65.67K ops/s | 14.15M ops/s | +21444.4% | 215.44x |
| or-n4691-r2-001 | full-execution-true | 65.68K ops/s | 13.50M ops/s | +20453.9% | 205.54x |
| or-n4691-r2-001 | partial-false | 103.84K ops/s | 19.91M ops/s | +19077.5% | 191.77x |
| or-n3412-r101-001 | complete-true | 98.52K ops/s | 18.79M ops/s | +18974.3% | 190.74x |
| or-n4691-r2-001 | empty-context | 104.77K ops/s | 19.10M ops/s | +18127.5% | 182.28x |
| or-n3412-r101-001 | early-true | 102.24K ops/s | 18.33M ops/s | +17832.6% | 179.33x |
| or-n3412-r101-001 | partial-true | 105.86K ops/s | 18.80M ops/s | +17658.2% | 177.58x |
| or-n1968-r105-001 | early-true | 141.68K ops/s | 17.64M ops/s | +12349.0% | 124.49x |
| or-n1968-r105-001 | complete-true | 141.22K ops/s | 17.24M ops/s | +12110.8% | 122.11x |
| or-n4691-r2-001 | complete-false | 86.79K ops/s | 10.52M ops/s | +12017.7% | 121.18x |
| or-n1968-r105-001 | partial-true | 158.19K ops/s | 16.62M ops/s | +10408.5% | 105.09x |
| or-n3730-r105-001 | early-true | 293.51K ops/s | 18.34M ops/s | +6148.3% | 62.48x |
| overlap-n105-r100-018 | complete-true | 388.44K ops/s | 23.70M ops/s | +6000.9% | 61.01x |
| overlap-n105-r100-015 | early-true | 391.00K ops/s | 23.67M ops/s | +5954.8% | 60.55x |
| overlap-n105-r100-021 | early-true | 393.97K ops/s | 23.62M ops/s | +5896.0% | 59.96x |
| overlap-n105-r100-018 | early-true | 392.57K ops/s | 23.53M ops/s | +5894.0% | 59.94x |
| overlap-n105-r100-009 | complete-true | 397.04K ops/s | 23.65M ops/s | +5857.0% | 59.57x |
| overlap-n105-r100-006 | full-execution-true | 397.03K ops/s | 23.44M ops/s | +5803.2% | 59.03x |
| overlap-n105-r100-018 | full-execution-true | 401.61K ops/s | 23.63M ops/s | +5784.5% | 58.84x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n4691-r2-001 | complete-true | 8.39M ops/s | 12.94M ops/s | +54.2% | 1.54x |
| overlap-n12-r5-001 | complete-false | 7.73M ops/s | 12.34M ops/s | +59.6% | 1.60x |
| overlap-n12-r5-001 | full-execution-false | 7.72M ops/s | 12.64M ops/s | +63.8% | 1.64x |
| or-n4691-r2-001 | early-true | 8.27M ops/s | 13.90M ops/s | +68.1% | 1.68x |
| or-n4691-r2-001 | partial-true | 7.98M ops/s | 13.62M ops/s | +70.6% | 1.71x |
| overlap-n112-r100-003 | full-execution-false | 334.53K ops/s | 583.76K ops/s | +74.5% | 1.75x |
| overlap-n11-r5-001 | full-execution-false | 8.00M ops/s | 14.17M ops/s | +77.2% | 1.77x |
| overlap-n112-r100-003 | complete-false | 332.93K ops/s | 597.50K ops/s | +79.5% | 1.79x |
| overlap-n108-r100-007 | complete-false | 358.05K ops/s | 646.82K ops/s | +80.6% | 1.81x |
| overlap-n105-r100-009 | empty-context | 548.41K ops/s | 997.61K ops/s | +81.9% | 1.82x |
| overlap-n11-r5-001 | complete-false | 7.84M ops/s | 14.26M ops/s | +82.0% | 1.82x |
| overlap-n105-r100-018 | late-true | 375.59K ops/s | 687.30K ops/s | +83.0% | 1.83x |
| overlap-n105-r100-005 | empty-context | 550.65K ops/s | 1.01M ops/s | +84.2% | 1.84x |
| overlap-n105-r100-010 | complete-false | 372.57K ops/s | 687.63K ops/s | +84.6% | 1.85x |
| overlap-n105-r100-009 | late-true | 382.40K ops/s | 708.30K ops/s | +85.2% | 1.85x |
| overlap-n108-r100-007 | full-execution-false | 349.10K ops/s | 646.89K ops/s | +85.3% | 1.85x |
| overlap-n110-r100-001 | complete-false | 348.17K ops/s | 645.50K ops/s | +85.4% | 1.85x |
| overlap-n105-r100-007 | late-true | 392.84K ops/s | 728.96K ops/s | +85.6% | 1.86x |
| overlap-n105-r100-009 | full-execution-false | 373.54K ops/s | 694.11K ops/s | +85.8% | 1.86x |
| overlap-n105-r100-022 | full-execution-false | 366.47K ops/s | 682.23K ops/s | +86.2% | 1.86x |

### Regressions

_No regressions._

