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
| or-n4691-r2-001 | full-execution-false | 45.31K ops/s | 10.98M ops/s | +24130.5% | 242.30x |
| or-n4691-r2-001 | full-execution-true | 44.27K ops/s | 10.42M ops/s | +23449.9% | 235.50x |
| or-n4691-r2-001 | late-true | 44.98K ops/s | 10.52M ops/s | +23282.1% | 233.82x |
| or-n4691-r2-001 | empty-context | 74.14K ops/s | 17.04M ops/s | +22878.9% | 229.79x |
| or-n4691-r2-001 | partial-false | 73.64K ops/s | 16.72M ops/s | +22608.9% | 227.09x |
| or-n3412-r101-001 | complete-true | 74.83K ops/s | 10.10M ops/s | +13393.4% | 134.93x |
| or-n3412-r101-001 | early-true | 76.04K ops/s | 10.12M ops/s | +13214.8% | 133.15x |
| or-n3412-r101-001 | partial-true | 80.40K ops/s | 10.48M ops/s | +12936.1% | 130.36x |
| or-n4691-r2-001 | complete-false | 60.25K ops/s | 7.11M ops/s | +11697.1% | 117.97x |
| or-n1968-r105-001 | complete-true | 105.82K ops/s | 11.74M ops/s | +10993.6% | 110.94x |
| or-n1968-r105-001 | early-true | 105.20K ops/s | 11.58M ops/s | +10905.6% | 110.06x |
| or-n1968-r105-001 | partial-true | 116.06K ops/s | 11.87M ops/s | +10130.8% | 102.31x |
| overlap-n105-r100-021 | early-true | 277.71K ops/s | 20.24M ops/s | +7187.5% | 72.88x |
| overlap-n105-r100-022 | early-true | 296.14K ops/s | 20.21M ops/s | +6725.2% | 68.25x |
| overlap-n105-r100-009 | complete-true | 297.16K ops/s | 20.19M ops/s | +6693.7% | 67.94x |
| overlap-n105-r100-013 | complete-true | 300.87K ops/s | 20.42M ops/s | +6688.2% | 67.88x |
| overlap-n105-r100-013 | full-execution-true | 299.09K ops/s | 20.26M ops/s | +6674.3% | 67.74x |
| overlap-n105-r100-015 | complete-true | 300.06K ops/s | 20.32M ops/s | +6671.9% | 67.72x |
| overlap-n105-r100-022 | complete-true | 301.40K ops/s | 20.36M ops/s | +6654.4% | 67.54x |
| overlap-n105-r100-013 | early-true | 300.65K ops/s | 20.26M ops/s | +6639.0% | 67.39x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n112-r100-011 | complete-false | 237.88K ops/s | 318.68K ops/s | +34.0% | 1.34x |
| overlap-n112-r100-011 | full-execution-false | 215.55K ops/s | 320.64K ops/s | +48.8% | 1.49x |
| overlap-n112-r100-001 | full-execution-false | 239.25K ops/s | 373.90K ops/s | +56.3% | 1.56x |
| overlap-n112-r100-002 | complete-false | 239.35K ops/s | 375.13K ops/s | +56.7% | 1.57x |
| overlap-n112-r100-002 | full-execution-false | 237.28K ops/s | 377.63K ops/s | +59.1% | 1.59x |
| overlap-n112-r100-001 | complete-false | 238.06K ops/s | 379.80K ops/s | +59.5% | 1.60x |
| overlap-n105-r100-001 | full-execution-false | 277.14K ops/s | 457.71K ops/s | +65.2% | 1.65x |
| overlap-n105-r100-005 | full-execution-false | 275.32K ops/s | 456.17K ops/s | +65.7% | 1.66x |
| overlap-n105-r100-019 | late-true | 279.69K ops/s | 463.90K ops/s | +65.9% | 1.66x |
| overlap-n105-r100-018 | late-true | 279.24K ops/s | 466.60K ops/s | +67.1% | 1.67x |
| overlap-n105-r100-001 | late-true | 278.22K ops/s | 465.12K ops/s | +67.2% | 1.67x |
| overlap-n108-r100-003 | full-execution-false | 256.09K ops/s | 429.27K ops/s | +67.6% | 1.68x |
| overlap-n105-r100-021 | complete-false | 274.52K ops/s | 462.35K ops/s | +68.4% | 1.68x |
| overlap-n112-r100-004 | complete-false | 238.77K ops/s | 402.53K ops/s | +68.6% | 1.69x |
| overlap-n111-r100-002 | full-execution-false | 241.50K ops/s | 407.29K ops/s | +68.6% | 1.69x |
| overlap-n105-r100-010 | partial-false | 384.99K ops/s | 650.39K ops/s | +68.9% | 1.69x |
| overlap-n105-r100-008 | full-execution-false | 274.37K ops/s | 464.13K ops/s | +69.2% | 1.69x |
| overlap-n111-r100-002 | complete-false | 241.85K ops/s | 409.21K ops/s | +69.2% | 1.69x |
| overlap-n11-r5-001 | full-execution-false | 5.71M ops/s | 9.66M ops/s | +69.2% | 1.69x |
| overlap-n105-r100-004 | late-true | 281.80K ops/s | 477.10K ops/s | +69.3% | 1.69x |

### Regressions

_No regressions._

