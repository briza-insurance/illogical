# Benchmark Comparison Report — simplify

**Baseline:** `results-sample-simplify-oop.json`
**Improved:** `results-sample-simplify-bytecode.json`
**Total cases compared:** 616

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 594 |
| Slower (>-5%) | 15 |
| Unchanged | 7 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n3412-r101-001 | complete-false | 4.98K ops/s | 164.70K ops/s | +3208.6% | 33.09x |
| or-n3412-r101-001 | full-execution-false | 5.23K ops/s | 173.02K ops/s | +3208.6% | 33.09x |
| or-n1968-r105-001 | full-execution-false | 9.16K ops/s | 283.85K ops/s | +2998.2% | 30.98x |
| or-n1968-r105-001 | complete-false | 8.96K ops/s | 271.88K ops/s | +2935.6% | 30.36x |
| or-n1968-r105-001 | empty-context | 77.10K ops/s | 1.59M ops/s | +1962.9% | 20.63x |
| or-n1968-r105-001 | partial-false | 77.09K ops/s | 1.57M ops/s | +1934.3% | 20.34x |
| or-n1968-r105-001 | partial-true | 76.97K ops/s | 1.49M ops/s | +1841.4% | 19.41x |
| or-n3412-r101-001 | full-execution-true | 7.58K ops/s | 128.97K ops/s | +1602.6% | 17.03x |
| or-n1968-r105-001 | full-execution-true | 12.91K ops/s | 211.04K ops/s | +1535.1% | 16.35x |
| or-n3412-r101-001 | empty-context | 45.72K ops/s | 706.83K ops/s | +1446.0% | 15.46x |
| or-n3412-r101-001 | partial-false | 46.52K ops/s | 700.67K ops/s | +1406.3% | 15.06x |
| or-n3412-r101-001 | partial-true | 45.44K ops/s | 679.86K ops/s | +1396.3% | 14.96x |
| or-n3412-r101-001 | complete-true | 43.04K ops/s | 414.72K ops/s | +863.6% | 9.64x |
| in-n122-r1-001 | full-execution-false | 1.13M ops/s | 9.27M ops/s | +719.1% | 8.19x |
| in-n122-r1-001 | complete-false | 1.13M ops/s | 9.21M ops/s | +712.0% | 8.12x |
| or-n3730-r105-001 | complete-false | 6.49K ops/s | 52.45K ops/s | +708.6% | 8.09x |
| in-n122-r1-001 | partial-true | 1.21M ops/s | 9.18M ops/s | +660.1% | 7.60x |
| in-n122-r1-001 | complete-true | 1.23M ops/s | 9.28M ops/s | +655.1% | 7.55x |
| in-n122-r1-001 | empty-context | 1.17M ops/s | 8.84M ops/s | +652.7% | 7.53x |
| or-n3730-r105-001 | full-execution-false | 7.04K ops/s | 52.96K ops/s | +652.0% | 7.52x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 249-and-or-eqs | complete-false | 9.87M ops/s | 6.11M ops/s | -38.1% | 0.62x |
| 251-or-and-in-mixed-eq-in | partial-true | 6.97M ops/s | 4.51M ops/s | -35.3% | 0.65x |
| 250-or-and-in | complete-true | 7.03M ops/s | 4.57M ops/s | -34.9% | 0.65x |
| 251-or-and-in-mixed-eq-in | complete-true | 6.87M ops/s | 4.56M ops/s | -33.6% | 0.66x |
| 250-or-and-in | partial-true | 6.79M ops/s | 4.54M ops/s | -33.1% | 0.67x |
| 250-or-and-in | complete-false | 6.15M ops/s | 4.17M ops/s | -32.2% | 0.68x |
| 251-or-and-in-mixed-eq-in | complete-false | 5.21M ops/s | 3.90M ops/s | -25.2% | 0.75x |
| 249-and-or-eqs | complete-true | 3.61M ops/s | 2.77M ops/s | -23.2% | 0.77x |
| 249-and-or-eqs | partial-true | 3.54M ops/s | 2.76M ops/s | -21.9% | 0.78x |
| 251-or-and-in-mixed-eq-in | full-execution-true | 4.10M ops/s | 3.24M ops/s | -20.9% | 0.79x |
| 250-or-and-in | full-execution-true | 3.77M ops/s | 3.08M ops/s | -18.4% | 0.82x |
| 250-or-and-in | full-execution-false | 3.71M ops/s | 3.09M ops/s | -16.6% | 0.83x |
| 251-or-and-in-mixed-eq-in | full-execution-false | 3.39M ops/s | 2.92M ops/s | -13.9% | 0.86x |
| 249-and-or-eqs | full-execution-true | 2.46M ops/s | 2.16M ops/s | -12.2% | 0.88x |
| 249-and-or-eqs | full-execution-false | 2.45M ops/s | 2.15M ops/s | -12.0% | 0.88x |
| overlap-n105-r100-019 | empty-context | 8.34M ops/s | 8.65M ops/s | +3.6% | 1.04x |
| 250-or-and-in | empty-context | 1.64M ops/s | 1.71M ops/s | +4.0% | 1.04x |
| 251-or-and-in-mixed-eq-in | partial-false | 1.61M ops/s | 1.68M ops/s | +4.3% | 1.04x |
| 249-and-or-eqs | empty-context | 1.09M ops/s | 1.14M ops/s | +4.5% | 1.04x |
| overlap-n105-r100-019 | partial-false | 8.15M ops/s | 8.52M ops/s | +4.5% | 1.05x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 249-and-or-eqs | complete-false | 9.87M ops/s | 6.11M ops/s | -38.1% | 0.62x |
| 251-or-and-in-mixed-eq-in | partial-true | 6.97M ops/s | 4.51M ops/s | -35.3% | 0.65x |
| 250-or-and-in | complete-true | 7.03M ops/s | 4.57M ops/s | -34.9% | 0.65x |
| 251-or-and-in-mixed-eq-in | complete-true | 6.87M ops/s | 4.56M ops/s | -33.6% | 0.66x |
| 250-or-and-in | partial-true | 6.79M ops/s | 4.54M ops/s | -33.1% | 0.67x |
| 250-or-and-in | complete-false | 6.15M ops/s | 4.17M ops/s | -32.2% | 0.68x |
| 251-or-and-in-mixed-eq-in | complete-false | 5.21M ops/s | 3.90M ops/s | -25.2% | 0.75x |
| 249-and-or-eqs | complete-true | 3.61M ops/s | 2.77M ops/s | -23.2% | 0.77x |
| 249-and-or-eqs | partial-true | 3.54M ops/s | 2.76M ops/s | -21.9% | 0.78x |
| 251-or-and-in-mixed-eq-in | full-execution-true | 4.10M ops/s | 3.24M ops/s | -20.9% | 0.79x |
| 250-or-and-in | full-execution-true | 3.77M ops/s | 3.08M ops/s | -18.4% | 0.82x |
| 250-or-and-in | full-execution-false | 3.71M ops/s | 3.09M ops/s | -16.6% | 0.83x |
| 251-or-and-in-mixed-eq-in | full-execution-false | 3.39M ops/s | 2.92M ops/s | -13.9% | 0.86x |
| 249-and-or-eqs | full-execution-true | 2.46M ops/s | 2.16M ops/s | -12.2% | 0.88x |
| 249-and-or-eqs | full-execution-false | 2.45M ops/s | 2.15M ops/s | -12.0% | 0.88x |

