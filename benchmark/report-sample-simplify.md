# Benchmark Comparison Report — simplify

**Baseline:** `results-sample-simplify-oop.json`
**Improved:** `results-sample-simplify-bytecode.json`
**Total cases compared:** 595

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 595 |
| Slower (>-5%) | 0 |
| Unchanged | 0 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n4691-r2-001 | full-execution-true | 34.95K ops/s | 10.77M ops/s | +30701.0% | 308.01x |
| or-n4691-r2-001 | full-execution-false | 35.20K ops/s | 10.01M ops/s | +28340.3% | 284.40x |
| or-n4691-r2-001 | complete-false | 46.08K ops/s | 9.26M ops/s | +20005.1% | 201.05x |
| or-n4691-r2-001 | empty-context | 17.08K ops/s | 1.40M ops/s | +8081.0% | 81.81x |
| or-n4691-r2-001 | partial-false | 17.07K ops/s | 1.39M ops/s | +8049.0% | 81.49x |
| or-n1968-r105-001 | full-execution-false | 9.77K ops/s | 299.93K ops/s | +2969.3% | 30.69x |
| or-n1968-r105-001 | empty-context | 80.45K ops/s | 2.40M ops/s | +2885.4% | 29.85x |
| or-n3412-r101-001 | complete-false | 5.62K ops/s | 165.47K ops/s | +2843.3% | 29.43x |
| or-n1968-r105-001 | partial-false | 83.14K ops/s | 2.39M ops/s | +2771.7% | 28.72x |
| or-n1968-r105-001 | partial-true | 81.83K ops/s | 2.34M ops/s | +2756.4% | 28.56x |
| or-n3412-r101-001 | full-execution-false | 6.01K ops/s | 166.51K ops/s | +2669.8% | 27.70x |
| or-n1968-r105-001 | complete-false | 11.06K ops/s | 298.61K ops/s | +2600.9% | 27.01x |
| or-n3412-r101-001 | empty-context | 45.86K ops/s | 1.08M ops/s | +2245.3% | 23.45x |
| or-n3412-r101-001 | partial-false | 47.37K ops/s | 1.03M ops/s | +2075.6% | 21.76x |
| or-n3412-r101-001 | partial-true | 46.49K ops/s | 1.01M ops/s | +2068.1% | 21.68x |
| or-n3412-r101-001 | full-execution-true | 7.52K ops/s | 141.24K ops/s | +1777.9% | 18.78x |
| or-n1968-r105-001 | full-execution-true | 13.85K ops/s | 232.42K ops/s | +1578.7% | 16.79x |
| in-n122-r1-001 | partial-false | 1.11M ops/s | 16.41M ops/s | +1374.7% | 14.75x |
| in-n122-r1-001 | complete-false | 1.06M ops/s | 15.57M ops/s | +1365.8% | 14.66x |
| in-n122-r1-001 | empty-context | 1.10M ops/s | 15.91M ops/s | +1348.4% | 14.48x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n105-r100-015 | empty-context | 10.21M ops/s | 10.75M ops/s | +5.3% | 1.05x |
| overlap-n105-r100-021 | empty-context | 10.29M ops/s | 10.98M ops/s | +6.7% | 1.07x |
| overlap-n105-r100-023 | partial-false | 10.72M ops/s | 11.50M ops/s | +7.3% | 1.07x |
| overlap-n105-r100-020 | partial-false | 10.43M ops/s | 11.34M ops/s | +8.8% | 1.09x |
| overlap-n105-r100-014 | empty-context | 10.27M ops/s | 11.20M ops/s | +9.0% | 1.09x |
| overlap-n105-r100-017 | partial-false | 10.57M ops/s | 11.54M ops/s | +9.1% | 1.09x |
| overlap-n105-r100-022 | empty-context | 10.03M ops/s | 11.02M ops/s | +9.9% | 1.10x |
| overlap-n105-r100-020 | empty-context | 10.41M ops/s | 11.45M ops/s | +9.9% | 1.10x |
| overlap-n105-r100-011 | partial-false | 10.56M ops/s | 11.66M ops/s | +10.4% | 1.10x |
| overlap-n105-r100-019 | empty-context | 10.30M ops/s | 11.39M ops/s | +10.5% | 1.11x |
| overlap-n106-r100-002 | empty-context | 9.94M ops/s | 11.01M ops/s | +10.8% | 1.11x |
| overlap-n105-r100-013 | partial-false | 10.60M ops/s | 11.75M ops/s | +10.9% | 1.11x |
| overlap-n106-r100-005 | empty-context | 9.89M ops/s | 10.96M ops/s | +10.9% | 1.11x |
| overlap-n106-r100-004 | empty-context | 9.82M ops/s | 10.92M ops/s | +11.1% | 1.11x |
| overlap-n106-r100-007 | empty-context | 9.75M ops/s | 10.92M ops/s | +12.0% | 1.12x |
| overlap-n105-r100-015 | partial-false | 10.61M ops/s | 11.88M ops/s | +12.1% | 1.12x |
| overlap-n105-r100-021 | partial-false | 10.57M ops/s | 11.88M ops/s | +12.3% | 1.12x |
| overlap-n105-r100-019 | partial-false | 10.59M ops/s | 11.92M ops/s | +12.6% | 1.13x |
| overlap-n106-r100-004 | partial-false | 10.21M ops/s | 11.51M ops/s | +12.7% | 1.13x |
| overlap-n105-r100-009 | empty-context | 10.34M ops/s | 11.67M ops/s | +12.9% | 1.13x |

### Regressions

_No regressions._

