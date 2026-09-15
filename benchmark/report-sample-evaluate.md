# Benchmark Comparison Report — evaluate

**Baseline:** `results-sample-evaluate-oop.json`
**Improved:** `results-sample-evaluate-bytecode.json`
**Total cases compared:** 792

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 765 |
| Slower (>-5%) | 27 |
| Unchanged | 0 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n3412-r101-001 | complete-true | 107.19K ops/s | 11.81M ops/s | +10920.0% | 110.20x |
| or-n3412-r101-001 | early-true | 107.88K ops/s | 11.29M ops/s | +10368.9% | 104.69x |
| or-n3412-r101-001 | partial-true | 119.40K ops/s | 11.83M ops/s | +9806.1% | 99.06x |
| or-n1968-r105-001 | complete-true | 146.84K ops/s | 11.68M ops/s | +7852.0% | 79.52x |
| or-n1968-r105-001 | early-true | 146.59K ops/s | 11.04M ops/s | +7434.2% | 75.34x |
| or-n1968-r105-001 | partial-true | 168.51K ops/s | 11.54M ops/s | +6750.8% | 68.51x |
| overlap-n105-r100-015 | full-execution-true | 322.86K ops/s | 21.23M ops/s | +6475.1% | 65.75x |
| overlap-n105-r100-002 | early-true | 303.47K ops/s | 19.73M ops/s | +6402.2% | 65.02x |
| overlap-n105-r100-009 | full-execution-true | 322.85K ops/s | 20.93M ops/s | +6382.0% | 64.82x |
| overlap-n105-r100-002 | complete-true | 304.62K ops/s | 19.68M ops/s | +6361.4% | 64.61x |
| overlap-n105-r100-002 | full-execution-true | 303.41K ops/s | 19.56M ops/s | +6347.8% | 64.48x |
| overlap-n105-r100-015 | complete-true | 329.29K ops/s | 21.20M ops/s | +6339.4% | 64.39x |
| overlap-n105-r100-013 | complete-true | 330.34K ops/s | 21.26M ops/s | +6335.5% | 64.36x |
| overlap-n105-r100-013 | full-execution-true | 329.96K ops/s | 21.06M ops/s | +6282.9% | 63.83x |
| overlap-n105-r100-015 | early-true | 330.58K ops/s | 21.05M ops/s | +6267.4% | 63.67x |
| overlap-n105-r100-009 | early-true | 326.30K ops/s | 20.76M ops/s | +6262.2% | 63.62x |
| overlap-n105-r100-012 | full-execution-true | 330.02K ops/s | 20.93M ops/s | +6241.3% | 63.41x |
| overlap-n105-r100-007 | full-execution-true | 325.37K ops/s | 20.63M ops/s | +6239.8% | 63.40x |
| overlap-n105-r100-011 | complete-true | 328.66K ops/s | 20.79M ops/s | +6225.7% | 63.26x |
| overlap-n105-r100-016 | early-true | 332.01K ops/s | 20.97M ops/s | +6217.4% | 63.17x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 250-or-and-in | empty-context | 11.61M ops/s | 8.14M ops/s | -29.9% | 0.70x |
| 250-or-and-in | complete-false | 11.40M ops/s | 8.13M ops/s | -28.7% | 0.71x |
| 249-and-or-eqs | complete-false | 16.83M ops/s | 12.23M ops/s | -27.4% | 0.73x |
| 250-or-and-in | partial-false | 10.85M ops/s | 7.95M ops/s | -26.7% | 0.73x |
| 249-and-or-eqs | empty-context | 16.47M ops/s | 12.29M ops/s | -25.4% | 0.75x |
| 249-and-or-eqs | partial-false | 16.13M ops/s | 12.08M ops/s | -25.1% | 0.75x |
| 251-or-and-in-mixed-eq-in | empty-context | 10.59M ops/s | 8.03M ops/s | -24.2% | 0.76x |
| 251-or-and-in-mixed-eq-in | partial-false | 10.12M ops/s | 7.83M ops/s | -22.7% | 0.77x |
| 250-or-and-in | partial-true | 12.33M ops/s | 9.78M ops/s | -20.7% | 0.79x |
| 251-or-and-in-mixed-eq-in | partial-true | 12.20M ops/s | 9.72M ops/s | -20.3% | 0.80x |
| 251-or-and-in-mixed-eq-in | complete-false | 9.90M ops/s | 7.90M ops/s | -20.3% | 0.80x |
| 251-or-and-in-mixed-eq-in | complete-true | 12.24M ops/s | 9.76M ops/s | -20.2% | 0.80x |
| 251-or-and-in-mixed-eq-in | early-true | 12.03M ops/s | 9.64M ops/s | -19.9% | 0.80x |
| 250-or-and-in | complete-true | 12.06M ops/s | 9.77M ops/s | -19.0% | 0.81x |
| 250-or-and-in | early-true | 12.08M ops/s | 9.85M ops/s | -18.5% | 0.81x |
| 249-and-or-eqs | partial-true | 6.34M ops/s | 5.41M ops/s | -14.7% | 0.85x |
| 249-and-or-eqs | complete-true | 6.30M ops/s | 5.46M ops/s | -13.3% | 0.87x |
| 249-and-or-eqs | early-true | 6.30M ops/s | 5.47M ops/s | -13.2% | 0.87x |
| 250-or-and-in | full-execution-true | 6.90M ops/s | 6.06M ops/s | -12.1% | 0.88x |
| 250-or-and-in | late-true | 6.88M ops/s | 6.05M ops/s | -12.0% | 0.88x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 250-or-and-in | empty-context | 11.61M ops/s | 8.14M ops/s | -29.9% | 0.70x |
| 250-or-and-in | complete-false | 11.40M ops/s | 8.13M ops/s | -28.7% | 0.71x |
| 249-and-or-eqs | complete-false | 16.83M ops/s | 12.23M ops/s | -27.4% | 0.73x |
| 250-or-and-in | partial-false | 10.85M ops/s | 7.95M ops/s | -26.7% | 0.73x |
| 249-and-or-eqs | empty-context | 16.47M ops/s | 12.29M ops/s | -25.4% | 0.75x |
| 249-and-or-eqs | partial-false | 16.13M ops/s | 12.08M ops/s | -25.1% | 0.75x |
| 251-or-and-in-mixed-eq-in | empty-context | 10.59M ops/s | 8.03M ops/s | -24.2% | 0.76x |
| 251-or-and-in-mixed-eq-in | partial-false | 10.12M ops/s | 7.83M ops/s | -22.7% | 0.77x |
| 250-or-and-in | partial-true | 12.33M ops/s | 9.78M ops/s | -20.7% | 0.79x |
| 251-or-and-in-mixed-eq-in | partial-true | 12.20M ops/s | 9.72M ops/s | -20.3% | 0.80x |
| 251-or-and-in-mixed-eq-in | complete-false | 9.90M ops/s | 7.90M ops/s | -20.3% | 0.80x |
| 251-or-and-in-mixed-eq-in | complete-true | 12.24M ops/s | 9.76M ops/s | -20.2% | 0.80x |
| 251-or-and-in-mixed-eq-in | early-true | 12.03M ops/s | 9.64M ops/s | -19.9% | 0.80x |
| 250-or-and-in | complete-true | 12.06M ops/s | 9.77M ops/s | -19.0% | 0.81x |
| 250-or-and-in | early-true | 12.08M ops/s | 9.85M ops/s | -18.5% | 0.81x |
| 249-and-or-eqs | partial-true | 6.34M ops/s | 5.41M ops/s | -14.7% | 0.85x |
| 249-and-or-eqs | complete-true | 6.30M ops/s | 5.46M ops/s | -13.3% | 0.87x |
| 249-and-or-eqs | early-true | 6.30M ops/s | 5.47M ops/s | -13.2% | 0.87x |
| 250-or-and-in | full-execution-true | 6.90M ops/s | 6.06M ops/s | -12.1% | 0.88x |
| 250-or-and-in | late-true | 6.88M ops/s | 6.05M ops/s | -12.0% | 0.88x |
| 251-or-and-in-mixed-eq-in | late-true | 7.61M ops/s | 6.73M ops/s | -11.7% | 0.88x |
| 249-and-or-eqs | full-execution-false | 4.54M ops/s | 4.05M ops/s | -10.9% | 0.89x |
| 251-or-and-in-mixed-eq-in | full-execution-true | 7.61M ops/s | 6.79M ops/s | -10.8% | 0.89x |
| 250-or-and-in | full-execution-false | 6.75M ops/s | 6.02M ops/s | -10.8% | 0.89x |
| 249-and-or-eqs | late-true | 4.54M ops/s | 4.07M ops/s | -10.5% | 0.90x |
| 249-and-or-eqs | full-execution-true | 4.56M ops/s | 4.10M ops/s | -10.2% | 0.90x |
| 251-or-and-in-mixed-eq-in | full-execution-false | 6.22M ops/s | 5.88M ops/s | -5.6% | 0.94x |

