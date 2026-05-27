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
| or-n4691-r2-001 | full-execution-true | 44.23K ops/s | 10.73M ops/s | +24158.3% | 242.58x |
| or-n4691-r2-001 | partial-false | 71.83K ops/s | 17.23M ops/s | +23882.3% | 239.82x |
| or-n4691-r2-001 | full-execution-false | 44.06K ops/s | 10.53M ops/s | +23790.2% | 238.90x |
| or-n4691-r2-001 | late-true | 44.25K ops/s | 10.49M ops/s | +23603.7% | 237.04x |
| or-n4691-r2-001 | empty-context | 72.22K ops/s | 16.94M ops/s | +23360.8% | 234.61x |
| or-n3412-r101-001 | complete-true | 75.17K ops/s | 10.65M ops/s | +14069.4% | 141.69x |
| or-n3412-r101-001 | early-true | 75.56K ops/s | 10.50M ops/s | +13803.6% | 139.04x |
| or-n3412-r101-001 | partial-true | 79.60K ops/s | 11.05M ops/s | +13778.1% | 138.78x |
| or-n4691-r2-001 | complete-false | 58.61K ops/s | 7.19M ops/s | +12165.0% | 122.65x |
| or-n1968-r105-001 | complete-true | 96.74K ops/s | 11.28M ops/s | +11558.8% | 116.59x |
| or-n1968-r105-001 | early-true | 105.07K ops/s | 11.27M ops/s | +10623.6% | 107.24x |
| or-n1968-r105-001 | partial-true | 111.78K ops/s | 11.26M ops/s | +9977.2% | 100.77x |
| overlap-n105-r100-019 | complete-true | 272.57K ops/s | 18.79M ops/s | +6794.4% | 68.94x |
| overlap-n105-r100-005 | complete-true | 287.60K ops/s | 19.61M ops/s | +6718.3% | 68.18x |
| overlap-n105-r100-005 | early-true | 291.64K ops/s | 19.67M ops/s | +6646.1% | 67.46x |
| overlap-n105-r100-009 | complete-true | 284.30K ops/s | 19.07M ops/s | +6607.0% | 67.07x |
| overlap-n105-r100-007 | complete-true | 292.76K ops/s | 19.49M ops/s | +6556.9% | 66.57x |
| overlap-n105-r100-009 | full-execution-true | 286.13K ops/s | 19.03M ops/s | +6549.8% | 66.50x |
| overlap-n105-r100-008 | full-execution-true | 278.43K ops/s | 18.48M ops/s | +6537.4% | 66.37x |
| overlap-n105-r100-002 | early-true | 299.83K ops/s | 19.84M ops/s | +6515.9% | 66.16x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n105-r100-020 | late-true | 276.43K ops/s | 404.06K ops/s | +46.2% | 1.46x |
| overlap-n105-r100-021 | complete-false | 275.47K ops/s | 410.17K ops/s | +48.9% | 1.49x |
| overlap-n105-r100-020 | complete-false | 273.84K ops/s | 410.60K ops/s | +49.9% | 1.50x |
| overlap-n112-r100-005 | full-execution-false | 237.47K ops/s | 364.10K ops/s | +53.3% | 1.53x |
| overlap-n105-r100-023 | complete-false | 274.85K ops/s | 421.63K ops/s | +53.4% | 1.53x |
| overlap-n112-r100-005 | complete-false | 231.62K ops/s | 356.18K ops/s | +53.8% | 1.54x |
| overlap-n106-r100-002 | full-execution-false | 270.50K ops/s | 418.86K ops/s | +54.8% | 1.55x |
| overlap-n105-r100-016 | complete-false | 275.44K ops/s | 428.17K ops/s | +55.5% | 1.55x |
| overlap-n11-r5-001 | full-execution-false | 5.69M ops/s | 8.85M ops/s | +55.5% | 1.56x |
| overlap-n105-r100-013 | full-execution-false | 273.49K ops/s | 426.85K ops/s | +56.1% | 1.56x |
| overlap-n105-r100-020 | full-execution-false | 273.75K ops/s | 428.80K ops/s | +56.6% | 1.57x |
| overlap-n105-r100-018 | late-true | 278.68K ops/s | 436.62K ops/s | +56.7% | 1.57x |
| overlap-n105-r100-021 | empty-context | 399.14K ops/s | 626.74K ops/s | +57.0% | 1.57x |
| overlap-n105-r100-015 | complete-false | 272.58K ops/s | 428.17K ops/s | +57.1% | 1.57x |
| overlap-n105-r100-019 | complete-false | 274.92K ops/s | 432.42K ops/s | +57.3% | 1.57x |
| overlap-n11-r5-001 | complete-false | 5.66M ops/s | 8.93M ops/s | +57.8% | 1.58x |
| overlap-n105-r100-023 | late-true | 278.51K ops/s | 439.82K ops/s | +57.9% | 1.58x |
| overlap-n105-r100-016 | late-true | 277.02K ops/s | 437.82K ops/s | +58.0% | 1.58x |
| overlap-n112-r100-003 | full-execution-false | 237.00K ops/s | 374.82K ops/s | +58.2% | 1.58x |
| overlap-n105-r100-019 | late-true | 276.50K ops/s | 438.06K ops/s | +58.4% | 1.58x |

### Regressions

_No regressions._

