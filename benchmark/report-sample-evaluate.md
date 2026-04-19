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
| or-n4691-r2-001 | full-execution-false | 57.45K ops/s | 15.02M ops/s | +26039.6% | 261.40x |
| or-n4691-r2-001 | late-true | 60.48K ops/s | 14.61M ops/s | +24065.1% | 241.65x |
| or-n4691-r2-001 | full-execution-true | 59.98K ops/s | 14.36M ops/s | +23833.5% | 239.34x |
| or-n4691-r2-001 | partial-false | 92.82K ops/s | 19.74M ops/s | +21170.8% | 212.71x |
| or-n4691-r2-001 | empty-context | 94.17K ops/s | 19.22M ops/s | +20307.1% | 204.07x |
| or-n3412-r101-001 | early-true | 97.33K ops/s | 18.34M ops/s | +18738.9% | 188.39x |
| or-n3412-r101-001 | complete-true | 95.52K ops/s | 17.96M ops/s | +18707.4% | 188.07x |
| or-n3412-r101-001 | partial-true | 108.23K ops/s | 18.30M ops/s | +16807.1% | 169.07x |
| or-n4691-r2-001 | complete-false | 80.16K ops/s | 10.49M ops/s | +12990.4% | 130.90x |
| or-n1968-r105-001 | early-true | 132.32K ops/s | 16.01M ops/s | +11998.4% | 120.98x |
| or-n1968-r105-001 | complete-true | 134.83K ops/s | 16.16M ops/s | +11882.8% | 119.83x |
| or-n1968-r105-001 | partial-true | 149.28K ops/s | 16.56M ops/s | +10995.7% | 110.96x |
| overlap-n105-r100-008 | full-execution-true | 356.57K ops/s | 23.24M ops/s | +6418.9% | 65.19x |
| or-n3730-r105-001 | early-true | 274.02K ops/s | 17.76M ops/s | +6382.5% | 64.82x |
| overlap-n105-r100-015 | early-true | 359.43K ops/s | 23.24M ops/s | +6366.4% | 64.66x |
| overlap-n105-r100-020 | full-execution-true | 361.86K ops/s | 23.15M ops/s | +6297.2% | 63.97x |
| or-n3730-r105-001 | complete-true | 274.94K ops/s | 17.54M ops/s | +6279.3% | 63.79x |
| overlap-n105-r100-007 | complete-true | 364.26K ops/s | 23.21M ops/s | +6272.7% | 63.73x |
| overlap-n105-r100-012 | full-execution-true | 356.31K ops/s | 22.64M ops/s | +6253.0% | 63.53x |
| overlap-n105-r100-005 | full-execution-true | 365.65K ops/s | 23.19M ops/s | +6241.4% | 63.41x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n105-r100-022 | late-true | 359.36K ops/s | 651.76K ops/s | +81.4% | 1.81x |
| overlap-n11-r5-001 | complete-false | 7.27M ops/s | 13.22M ops/s | +81.8% | 1.82x |
| overlap-n11-r5-001 | full-execution-false | 7.27M ops/s | 13.22M ops/s | +81.8% | 1.82x |
| overlap-n12-r5-001 | full-execution-false | 7.26M ops/s | 13.32M ops/s | +83.6% | 1.84x |
| overlap-n105-r100-008 | complete-false | 352.62K ops/s | 649.46K ops/s | +84.2% | 1.84x |
| overlap-n105-r100-021 | late-true | 362.12K ops/s | 675.87K ops/s | +86.6% | 1.87x |
| overlap-n105-r100-001 | full-execution-false | 349.19K ops/s | 652.34K ops/s | +86.8% | 1.87x |
| overlap-n105-r100-007 | late-true | 359.60K ops/s | 675.32K ops/s | +87.8% | 1.88x |
| overlap-n105-r100-002 | complete-false | 349.65K ops/s | 660.99K ops/s | +89.0% | 1.89x |
| overlap-n105-r100-001 | late-true | 356.21K ops/s | 676.36K ops/s | +89.9% | 1.90x |
| overlap-n105-r100-013 | complete-false | 340.09K ops/s | 646.60K ops/s | +90.1% | 1.90x |
| overlap-n105-r100-022 | full-execution-false | 334.77K ops/s | 637.26K ops/s | +90.4% | 1.90x |
| overlap-n105-r100-007 | complete-false | 356.93K ops/s | 680.51K ops/s | +90.7% | 1.91x |
| overlap-n105-r100-009 | full-execution-false | 344.50K ops/s | 657.97K ops/s | +91.0% | 1.91x |
| overlap-n105-r100-004 | late-true | 361.42K ops/s | 690.39K ops/s | +91.0% | 1.91x |
| overlap-n105-r100-023 | late-true | 349.46K ops/s | 667.59K ops/s | +91.0% | 1.91x |
| overlap-n105-r100-008 | late-true | 361.89K ops/s | 693.55K ops/s | +91.6% | 1.92x |
| overlap-n105-r100-020 | full-execution-false | 343.74K ops/s | 660.71K ops/s | +92.2% | 1.92x |
| overlap-n12-r5-001 | complete-false | 7.06M ops/s | 13.58M ops/s | +92.3% | 1.92x |
| overlap-n105-r100-018 | complete-false | 344.43K ops/s | 664.56K ops/s | +92.9% | 1.93x |

### Regressions

_No regressions._

