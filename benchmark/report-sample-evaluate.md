# Benchmark Comparison Report — evaluate

**Baseline:** `results-sample-evaluate-baseline.json`
**Improved:** `results-sample-evaluate-current.json`
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
| or-n4691-r2-001 | partial-false | 105.92K ops/s | 21.12M ops/s | +19842.8% | 199.43x |
| or-n4691-r2-001 | empty-context | 109.34K ops/s | 19.81M ops/s | +18022.1% | 181.22x |
| or-n3412-r101-001 | early-true | 104.98K ops/s | 18.48M ops/s | +17501.2% | 176.01x |
| or-n3412-r101-001 | complete-true | 103.72K ops/s | 18.17M ops/s | +17415.5% | 175.15x |
| or-n3412-r101-001 | partial-true | 113.40K ops/s | 18.60M ops/s | +16302.6% | 164.03x |
| or-n1968-r105-001 | early-true | 150.67K ops/s | 18.23M ops/s | +11996.7% | 120.97x |
| or-n1968-r105-001 | complete-true | 152.04K ops/s | 18.34M ops/s | +11961.1% | 120.61x |
| or-n1968-r105-001 | partial-true | 167.98K ops/s | 18.40M ops/s | +10852.0% | 109.52x |
| or-n3730-r105-001 | early-true | 305.93K ops/s | 18.02M ops/s | +5788.9% | 58.89x |
| overlap-n105-r100-020 | complete-true | 410.81K ops/s | 23.90M ops/s | +5717.3% | 58.17x |
| overlap-n105-r100-010 | full-execution-true | 411.28K ops/s | 23.84M ops/s | +5697.5% | 57.97x |
| overlap-n105-r100-007 | complete-true | 411.47K ops/s | 23.84M ops/s | +5694.4% | 57.94x |
| overlap-n105-r100-009 | full-execution-true | 410.53K ops/s | 23.77M ops/s | +5691.3% | 57.91x |
| overlap-n105-r100-018 | full-execution-true | 413.54K ops/s | 23.86M ops/s | +5669.4% | 57.69x |
| overlap-n105-r100-018 | early-true | 412.91K ops/s | 23.82M ops/s | +5668.7% | 57.69x |
| overlap-n105-r100-023 | complete-true | 412.24K ops/s | 23.77M ops/s | +5667.2% | 57.67x |
| overlap-n105-r100-016 | complete-true | 412.59K ops/s | 23.79M ops/s | +5666.4% | 57.66x |
| or-n3730-r105-001 | complete-true | 305.82K ops/s | 17.62M ops/s | +5661.5% | 57.61x |
| overlap-n105-r100-015 | early-true | 413.79K ops/s | 23.81M ops/s | +5654.0% | 57.54x |
| overlap-n105-r100-008 | early-true | 414.70K ops/s | 23.85M ops/s | +5650.4% | 57.50x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n4691-r2-001 | early-true | 8.89M ops/s | 13.39M ops/s | +50.6% | 1.51x |
| or-n4691-r2-001 | complete-true | 8.98M ops/s | 13.72M ops/s | +52.8% | 1.53x |
| or-n4691-r2-001 | partial-true | 8.93M ops/s | 13.66M ops/s | +52.9% | 1.53x |
| overlap-n12-r5-001 | complete-false | 8.06M ops/s | 12.39M ops/s | +53.9% | 1.54x |
| overlap-n12-r5-001 | full-execution-false | 7.85M ops/s | 12.54M ops/s | +59.7% | 1.60x |
| overlap-n11-r5-001 | full-execution-false | 8.27M ops/s | 13.68M ops/s | +65.4% | 1.65x |
| overlap-n11-r5-001 | complete-false | 8.15M ops/s | 14.05M ops/s | +72.4% | 1.72x |
| overlap-n112-r100-003 | full-execution-false | 337.78K ops/s | 621.69K ops/s | +84.1% | 1.84x |
| overlap-n112-r100-011 | complete-false | 336.94K ops/s | 628.37K ops/s | +86.5% | 1.86x |
| overlap-n112-r100-003 | complete-false | 341.46K ops/s | 637.07K ops/s | +86.6% | 1.87x |
| overlap-n12-r5-001 | partial-false | 7.98M ops/s | 15.08M ops/s | +88.9% | 1.89x |
| overlap-n107-r100-001 | complete-false | 371.36K ops/s | 701.52K ops/s | +88.9% | 1.89x |
| overlap-n112-r100-005 | complete-false | 347.40K ops/s | 656.73K ops/s | +89.0% | 1.89x |
| overlap-n112-r100-008 | complete-false | 347.50K ops/s | 658.15K ops/s | +89.4% | 1.89x |
| overlap-n108-r100-005 | complete-false | 359.77K ops/s | 686.33K ops/s | +90.8% | 1.91x |
| overlap-n12-r5-001 | empty-context | 8.07M ops/s | 15.41M ops/s | +91.1% | 1.91x |
| overlap-n105-r100-003 | late-true | 389.31K ops/s | 746.08K ops/s | +91.6% | 1.92x |
| overlap-n108-r100-007 | complete-false | 361.69K ops/s | 699.21K ops/s | +93.3% | 1.93x |
| overlap-n106-r100-007 | complete-false | 372.60K ops/s | 724.50K ops/s | +94.4% | 1.94x |
| overlap-n106-r100-002 | complete-false | 369.35K ops/s | 719.91K ops/s | +94.9% | 1.95x |

### Regressions

_No regressions._

