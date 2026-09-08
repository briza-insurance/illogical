# Benchmark Comparison Report — evaluate

**Baseline:** `results-sample-evaluate-oop.json`
**Improved:** `results-sample-evaluate-bytecode.json`
**Total cases compared:** 792

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 787 |
| Slower (>-5%) | 3 |
| Unchanged | 2 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n4691-r2-001 | full-execution-false | 60.18K ops/s | 12.96M ops/s | +21439.3% | 215.39x |
| or-n4691-r2-001 | full-execution-true | 60.34K ops/s | 12.33M ops/s | +20337.1% | 204.37x |
| or-n4691-r2-001 | late-true | 60.50K ops/s | 12.32M ops/s | +20255.8% | 203.56x |
| or-n4691-r2-001 | empty-context | 106.90K ops/s | 17.39M ops/s | +16170.3% | 162.70x |
| or-n4691-r2-001 | partial-false | 105.35K ops/s | 17.02M ops/s | +16053.3% | 161.53x |
| or-n3412-r101-001 | early-true | 98.20K ops/s | 11.38M ops/s | +11487.5% | 115.88x |
| or-n3412-r101-001 | complete-true | 110.07K ops/s | 11.95M ops/s | +10755.4% | 108.55x |
| or-n4691-r2-001 | complete-false | 82.32K ops/s | 8.53M ops/s | +10258.9% | 103.59x |
| or-n3412-r101-001 | partial-true | 119.37K ops/s | 11.36M ops/s | +9416.2% | 95.16x |
| or-n1968-r105-001 | complete-true | 149.72K ops/s | 11.63M ops/s | +7670.5% | 77.71x |
| or-n1968-r105-001 | early-true | 151.46K ops/s | 11.24M ops/s | +7321.5% | 74.22x |
| or-n1968-r105-001 | partial-true | 168.08K ops/s | 11.97M ops/s | +7023.4% | 71.23x |
| overlap-n105-r100-004 | complete-true | 347.86K ops/s | 20.83M ops/s | +5888.8% | 59.89x |
| overlap-n105-r100-014 | complete-true | 349.08K ops/s | 20.88M ops/s | +5881.1% | 59.81x |
| overlap-n105-r100-021 | complete-true | 347.91K ops/s | 20.81M ops/s | +5880.1% | 59.80x |
| overlap-n105-r100-001 | full-execution-true | 346.24K ops/s | 20.62M ops/s | +5854.9% | 59.55x |
| overlap-n105-r100-004 | full-execution-true | 349.37K ops/s | 20.74M ops/s | +5835.6% | 59.36x |
| overlap-n105-r100-008 | full-execution-true | 349.27K ops/s | 20.60M ops/s | +5797.1% | 58.97x |
| overlap-n105-r100-012 | full-execution-true | 346.77K ops/s | 20.38M ops/s | +5777.8% | 58.78x |
| overlap-n105-r100-001 | complete-true | 349.21K ops/s | 20.42M ops/s | +5746.5% | 58.46x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 249-and-or-eqs | empty-context | 17.24M ops/s | 10.96M ops/s | -36.4% | 0.64x |
| 249-and-or-eqs | complete-false | 17.30M ops/s | 11.10M ops/s | -35.8% | 0.64x |
| 249-and-or-eqs | partial-false | 16.69M ops/s | 11.02M ops/s | -34.0% | 0.66x |
| 249-and-or-eqs | partial-true | 6.32M ops/s | 6.54M ops/s | +3.5% | 1.03x |
| 249-and-or-eqs | early-true | 6.31M ops/s | 6.61M ops/s | +4.8% | 1.05x |
| 249-and-or-eqs | complete-true | 6.30M ops/s | 6.65M ops/s | +5.6% | 1.06x |
| 251-or-and-in-mixed-eq-in | partial-true | 11.86M ops/s | 16.41M ops/s | +38.4% | 1.38x |
| 250-or-and-in | partial-true | 11.81M ops/s | 16.49M ops/s | +39.7% | 1.40x |
| 250-or-and-in | complete-true | 11.88M ops/s | 17.14M ops/s | +44.2% | 1.44x |
| 250-or-and-in | early-true | 11.74M ops/s | 17.08M ops/s | +45.5% | 1.46x |
| 251-or-and-in-mixed-eq-in | early-true | 11.75M ops/s | 17.15M ops/s | +46.0% | 1.46x |
| 249-and-or-eqs | full-execution-true | 4.52M ops/s | 6.60M ops/s | +46.2% | 1.46x |
| 249-and-or-eqs | full-execution-false | 4.50M ops/s | 6.61M ops/s | +46.9% | 1.47x |
| 249-and-or-eqs | late-true | 4.44M ops/s | 6.55M ops/s | +47.5% | 1.48x |
| 251-or-and-in-mixed-eq-in | complete-true | 11.64M ops/s | 17.19M ops/s | +47.7% | 1.48x |
| overlap-n11-r5-001 | complete-false | 6.95M ops/s | 11.07M ops/s | +59.3% | 1.59x |
| overlap-n11-r5-001 | full-execution-false | 7.03M ops/s | 11.25M ops/s | +60.0% | 1.60x |
| 250-or-and-in | empty-context | 11.23M ops/s | 17.98M ops/s | +60.1% | 1.60x |
| overlap-n11-r5-001 | partial-false | 6.94M ops/s | 11.33M ops/s | +63.3% | 1.63x |
| overlap-n11-r5-001 | empty-context | 7.35M ops/s | 12.10M ops/s | +64.6% | 1.65x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 249-and-or-eqs | empty-context | 17.24M ops/s | 10.96M ops/s | -36.4% | 0.64x |
| 249-and-or-eqs | complete-false | 17.30M ops/s | 11.10M ops/s | -35.8% | 0.64x |
| 249-and-or-eqs | partial-false | 16.69M ops/s | 11.02M ops/s | -34.0% | 0.66x |

