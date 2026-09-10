# Benchmark Comparison Report — parse

**Baseline:** `results-sample-parse-oop.json`
**Improved:** `results-sample-parse-bytecode.json`
**Total cases compared:** 616

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 19 |
| Slower (>-5%) | 34 |
| Unchanged | 563 |

---

## parse

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n298-r105-001 | full-execution-false | 113.27K ops/s | 141.35K ops/s | +24.8% | 1.25x |
| or-n1495-r105-001 | empty-context | 31.68K ops/s | 37.75K ops/s | +19.1% | 1.19x |
| or-n326-r105-001 | empty-context | 100.20K ops/s | 118.05K ops/s | +17.8% | 1.18x |
| or-n298-r105-001 | full-execution-true | 117.35K ops/s | 137.79K ops/s | +17.4% | 1.17x |
| or-n3412-r101-001 | empty-context | 5.81K ops/s | 6.74K ops/s | +15.9% | 1.16x |
| or-n3412-r101-001 | partial-false | 5.83K ops/s | 6.72K ops/s | +15.4% | 1.15x |
| or-n3412-r101-001 | complete-true | 5.95K ops/s | 6.65K ops/s | +11.9% | 1.12x |
| or-n3730-r105-001 | complete-true | 10.76K ops/s | 12.02K ops/s | +11.8% | 1.12x |
| or-n3412-r101-001 | full-execution-true | 5.96K ops/s | 6.61K ops/s | +11.0% | 1.11x |
| or-n3412-r101-001 | complete-false | 6.06K ops/s | 6.73K ops/s | +10.9% | 1.11x |
| or-n298-r105-001 | partial-true | 121.60K ops/s | 134.73K ops/s | +10.8% | 1.11x |
| or-n3412-r101-001 | partial-true | 6.18K ops/s | 6.73K ops/s | +8.9% | 1.09x |
| or-n326-r105-001 | full-execution-true | 109.31K ops/s | 118.68K ops/s | +8.6% | 1.09x |
| or-n3730-r105-001 | partial-false | 11.07K ops/s | 11.97K ops/s | +8.2% | 1.08x |
| or-n4691-r2-001 | empty-context | 3.85K ops/s | 4.15K ops/s | +8.0% | 1.08x |
| or-n3730-r105-001 | partial-true | 11.13K ops/s | 12.00K ops/s | +7.8% | 1.08x |
| or-n3730-r105-001 | full-execution-true | 11.08K ops/s | 11.93K ops/s | +7.7% | 1.08x |
| or-n298-r105-001 | partial-false | 127.17K ops/s | 136.34K ops/s | +7.2% | 1.07x |
| or-n3412-r101-001 | full-execution-false | 6.35K ops/s | 6.77K ops/s | +6.7% | 1.07x |
| overlap-n105-r100-012 | partial-false | 677.94K ops/s | 709.27K ops/s | +4.6% | 1.05x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n11-r5-001 | partial-true | 2.31M ops/s | 2.06M ops/s | -10.6% | 0.89x |
| overlap-n11-r5-001 | complete-true | 2.32M ops/s | 2.08M ops/s | -10.4% | 0.90x |
| overlap-n12-r5-001 | complete-true | 2.03M ops/s | 1.84M ops/s | -9.5% | 0.90x |
| overlap-n11-r5-001 | empty-context | 2.31M ops/s | 2.10M ops/s | -9.2% | 0.91x |
| overlap-n11-r5-001 | full-execution-false | 2.31M ops/s | 2.10M ops/s | -9.2% | 0.91x |
| overlap-n11-r5-001 | complete-false | 2.32M ops/s | 2.11M ops/s | -8.7% | 0.91x |
| overlap-n11-r5-001 | full-execution-true | 2.32M ops/s | 2.13M ops/s | -8.4% | 0.92x |
| overlap-n12-r5-001 | partial-false | 2.00M ops/s | 1.84M ops/s | -8.3% | 0.92x |
| overlap-n12-r5-001 | complete-false | 2.01M ops/s | 1.85M ops/s | -8.2% | 0.92x |
| overlap-n11-r5-001 | partial-false | 2.29M ops/s | 2.10M ops/s | -8.2% | 0.92x |
| overlap-n12-r5-001 | partial-true | 2.01M ops/s | 1.86M ops/s | -7.4% | 0.93x |
| overlap-n12-r5-001 | full-execution-false | 1.99M ops/s | 1.84M ops/s | -7.2% | 0.93x |
| overlap-n55-r5-002 | complete-false | 378.45K ops/s | 351.12K ops/s | -7.2% | 0.93x |
| overlap-n113-r100-003 | complete-true | 560.12K ops/s | 519.91K ops/s | -7.2% | 0.93x |
| overlap-n12-r5-001 | empty-context | 2.00M ops/s | 1.86M ops/s | -6.8% | 0.93x |
| overlap-n12-r5-001 | full-execution-true | 2.00M ops/s | 1.86M ops/s | -6.7% | 0.93x |
| overlap-n113-r100-003 | complete-false | 559.27K ops/s | 522.98K ops/s | -6.5% | 0.94x |
| overlap-n55-r5-003 | complete-false | 377.31K ops/s | 353.07K ops/s | -6.4% | 0.94x |
| overlap-n55-r5-002 | empty-context | 373.51K ops/s | 349.55K ops/s | -6.4% | 0.94x |
| overlap-n106-r100-008 | complete-true | 701.37K ops/s | 658.28K ops/s | -6.1% | 0.94x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n11-r5-001 | partial-true | 2.31M ops/s | 2.06M ops/s | -10.6% | 0.89x |
| overlap-n11-r5-001 | complete-true | 2.32M ops/s | 2.08M ops/s | -10.4% | 0.90x |
| overlap-n12-r5-001 | complete-true | 2.03M ops/s | 1.84M ops/s | -9.5% | 0.90x |
| overlap-n11-r5-001 | empty-context | 2.31M ops/s | 2.10M ops/s | -9.2% | 0.91x |
| overlap-n11-r5-001 | full-execution-false | 2.31M ops/s | 2.10M ops/s | -9.2% | 0.91x |
| overlap-n11-r5-001 | complete-false | 2.32M ops/s | 2.11M ops/s | -8.7% | 0.91x |
| overlap-n11-r5-001 | full-execution-true | 2.32M ops/s | 2.13M ops/s | -8.4% | 0.92x |
| overlap-n12-r5-001 | partial-false | 2.00M ops/s | 1.84M ops/s | -8.3% | 0.92x |
| overlap-n12-r5-001 | complete-false | 2.01M ops/s | 1.85M ops/s | -8.2% | 0.92x |
| overlap-n11-r5-001 | partial-false | 2.29M ops/s | 2.10M ops/s | -8.2% | 0.92x |
| overlap-n12-r5-001 | partial-true | 2.01M ops/s | 1.86M ops/s | -7.4% | 0.93x |
| overlap-n12-r5-001 | full-execution-false | 1.99M ops/s | 1.84M ops/s | -7.2% | 0.93x |
| overlap-n55-r5-002 | complete-false | 378.45K ops/s | 351.12K ops/s | -7.2% | 0.93x |
| overlap-n113-r100-003 | complete-true | 560.12K ops/s | 519.91K ops/s | -7.2% | 0.93x |
| overlap-n12-r5-001 | empty-context | 2.00M ops/s | 1.86M ops/s | -6.8% | 0.93x |
| overlap-n12-r5-001 | full-execution-true | 2.00M ops/s | 1.86M ops/s | -6.7% | 0.93x |
| overlap-n113-r100-003 | complete-false | 559.27K ops/s | 522.98K ops/s | -6.5% | 0.94x |
| overlap-n55-r5-003 | complete-false | 377.31K ops/s | 353.07K ops/s | -6.4% | 0.94x |
| overlap-n55-r5-002 | empty-context | 373.51K ops/s | 349.55K ops/s | -6.4% | 0.94x |
| overlap-n106-r100-008 | complete-true | 701.37K ops/s | 658.28K ops/s | -6.1% | 0.94x |
| overlap-n55-r5-004 | partial-true | 376.10K ops/s | 353.09K ops/s | -6.1% | 0.94x |
| overlap-n55-r5-003 | partial-true | 372.89K ops/s | 350.12K ops/s | -6.1% | 0.94x |
| 250-or-and-in | full-execution-false | 1.02M ops/s | 964.37K ops/s | -5.7% | 0.94x |
| overlap-n55-r5-003 | partial-false | 377.20K ops/s | 356.17K ops/s | -5.6% | 0.94x |
| overlap-n55-r5-003 | full-execution-true | 371.37K ops/s | 350.83K ops/s | -5.5% | 0.94x |
| overlap-n113-r100-003 | partial-true | 555.51K ops/s | 525.49K ops/s | -5.4% | 0.95x |
| overlap-n121-r100-001 | complete-true | 459.50K ops/s | 434.91K ops/s | -5.4% | 0.95x |
| overlap-n121-r100-001 | partial-true | 453.62K ops/s | 429.61K ops/s | -5.3% | 0.95x |
| overlap-n55-r5-003 | complete-true | 372.35K ops/s | 352.82K ops/s | -5.2% | 0.95x |
| overlap-n55-r5-001 | partial-false | 374.24K ops/s | 354.79K ops/s | -5.2% | 0.95x |
| overlap-n105-r100-022 | full-execution-true | 724.74K ops/s | 687.43K ops/s | -5.1% | 0.95x |
| 251-or-and-in-mixed-eq-in | complete-false | 851.97K ops/s | 808.47K ops/s | -5.1% | 0.95x |
| overlap-n55-r5-002 | complete-true | 371.98K ops/s | 353.01K ops/s | -5.1% | 0.95x |
| overlap-n113-r100-003 | full-execution-true | 558.26K ops/s | 529.81K ops/s | -5.1% | 0.95x |

