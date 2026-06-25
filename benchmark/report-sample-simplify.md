# Benchmark Comparison Report — simplify

**Baseline:** `results-sample-simplify-oop.json`
**Improved:** `results-sample-simplify-bytecode.json`
**Total cases compared:** 616

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 606 |
| Slower (>-5%) | 6 |
| Unchanged | 4 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n3412-r101-001 | full-execution-false | 5.29K ops/s | 153.34K ops/s | +2799.5% | 29.00x |
| or-n1968-r105-001 | full-execution-false | 9.11K ops/s | 262.14K ops/s | +2778.5% | 28.79x |
| or-n1968-r105-001 | complete-false | 8.89K ops/s | 251.53K ops/s | +2728.0% | 28.28x |
| or-n3412-r101-001 | complete-false | 5.19K ops/s | 141.91K ops/s | +2632.3% | 27.32x |
| or-n1968-r105-001 | empty-context | 75.05K ops/s | 1.56M ops/s | +1974.6% | 20.75x |
| or-n1968-r105-001 | partial-false | 74.92K ops/s | 1.55M ops/s | +1965.6% | 20.66x |
| or-n1968-r105-001 | partial-true | 74.23K ops/s | 1.46M ops/s | +1863.0% | 19.63x |
| or-n3412-r101-001 | full-execution-true | 7.58K ops/s | 124.53K ops/s | +1542.6% | 16.43x |
| or-n1968-r105-001 | full-execution-true | 12.77K ops/s | 202.10K ops/s | +1482.0% | 15.82x |
| or-n3412-r101-001 | empty-context | 45.86K ops/s | 715.12K ops/s | +1459.2% | 15.59x |
| or-n3412-r101-001 | partial-false | 45.94K ops/s | 703.57K ops/s | +1431.4% | 15.31x |
| or-n3412-r101-001 | partial-true | 45.07K ops/s | 681.94K ops/s | +1413.2% | 15.13x |
| or-n3412-r101-001 | complete-true | 42.16K ops/s | 412.74K ops/s | +879.0% | 9.79x |
| in-n122-r1-001 | complete-false | 1.08M ops/s | 9.11M ops/s | +742.9% | 8.43x |
| in-n122-r1-001 | full-execution-false | 1.08M ops/s | 9.03M ops/s | +735.9% | 8.36x |
| in-n122-r1-001 | full-execution-true | 1.14M ops/s | 9.19M ops/s | +702.8% | 8.03x |
| in-n122-r1-001 | complete-true | 1.17M ops/s | 9.23M ops/s | +686.1% | 7.86x |
| in-n122-r1-001 | partial-true | 1.18M ops/s | 9.16M ops/s | +673.0% | 7.73x |
| in-n122-r1-001 | empty-context | 1.17M ops/s | 8.34M ops/s | +614.7% | 7.15x |
| or-n3730-r105-001 | full-execution-false | 7.09K ops/s | 49.37K ops/s | +595.9% | 6.96x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 249-and-or-eqs | complete-false | 9.48M ops/s | 5.91M ops/s | -37.6% | 0.62x |
| 251-or-and-in-mixed-eq-in | complete-true | 6.59M ops/s | 4.41M ops/s | -33.0% | 0.67x |
| 251-or-and-in-mixed-eq-in | partial-true | 6.61M ops/s | 4.49M ops/s | -32.1% | 0.68x |
| 251-or-and-in-mixed-eq-in | complete-false | 5.01M ops/s | 3.95M ops/s | -21.2% | 0.79x |
| 251-or-and-in-mixed-eq-in | full-execution-true | 4.03M ops/s | 3.27M ops/s | -18.8% | 0.81x |
| 251-or-and-in-mixed-eq-in | full-execution-false | 3.41M ops/s | 2.89M ops/s | -15.1% | 0.85x |
| 249-and-or-eqs | complete-true | 3.60M ops/s | 3.58M ops/s | -0.5% | 0.99x |
| 251-or-and-in-mixed-eq-in | empty-context | 1.61M ops/s | 1.64M ops/s | +1.6% | 1.02x |
| 251-or-and-in-mixed-eq-in | partial-false | 1.59M ops/s | 1.63M ops/s | +3.0% | 1.03x |
| 249-and-or-eqs | partial-true | 3.48M ops/s | 3.61M ops/s | +3.7% | 1.04x |
| overlap-n105-r100-014 | partial-false | 8.33M ops/s | 8.99M ops/s | +7.9% | 1.08x |
| overlap-n105-r100-021 | partial-false | 8.25M ops/s | 9.06M ops/s | +9.8% | 1.10x |
| overlap-n105-r100-005 | partial-false | 8.34M ops/s | 9.17M ops/s | +10.0% | 1.10x |
| overlap-n105-r100-014 | empty-context | 8.25M ops/s | 9.09M ops/s | +10.2% | 1.10x |
| overlap-n105-r100-012 | partial-false | 8.25M ops/s | 9.12M ops/s | +10.5% | 1.10x |
| overlap-n105-r100-003 | partial-false | 8.29M ops/s | 9.15M ops/s | +10.5% | 1.10x |
| overlap-n105-r100-002 | partial-false | 8.29M ops/s | 9.16M ops/s | +10.5% | 1.10x |
| overlap-n105-r100-023 | partial-false | 8.26M ops/s | 9.15M ops/s | +10.7% | 1.11x |
| overlap-n105-r100-019 | partial-false | 8.24M ops/s | 9.14M ops/s | +10.9% | 1.11x |
| overlap-n105-r100-013 | partial-false | 8.33M ops/s | 9.25M ops/s | +11.0% | 1.11x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 249-and-or-eqs | complete-false | 9.48M ops/s | 5.91M ops/s | -37.6% | 0.62x |
| 251-or-and-in-mixed-eq-in | complete-true | 6.59M ops/s | 4.41M ops/s | -33.0% | 0.67x |
| 251-or-and-in-mixed-eq-in | partial-true | 6.61M ops/s | 4.49M ops/s | -32.1% | 0.68x |
| 251-or-and-in-mixed-eq-in | complete-false | 5.01M ops/s | 3.95M ops/s | -21.2% | 0.79x |
| 251-or-and-in-mixed-eq-in | full-execution-true | 4.03M ops/s | 3.27M ops/s | -18.8% | 0.81x |
| 251-or-and-in-mixed-eq-in | full-execution-false | 3.41M ops/s | 2.89M ops/s | -15.1% | 0.85x |

