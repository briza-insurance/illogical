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
| or-n4691-r2-001 | full-execution-false | 24.47K ops/s | 8.45M ops/s | +34423.0% | 345.23x |
| or-n4691-r2-001 | full-execution-true | 24.83K ops/s | 8.12M ops/s | +32595.5% | 326.96x |
| or-n4691-r2-001 | complete-false | 33.17K ops/s | 6.28M ops/s | +18826.7% | 189.27x |
| or-n4691-r2-001 | empty-context | 12.15K ops/s | 1.13M ops/s | +9169.2% | 92.69x |
| or-n4691-r2-001 | partial-false | 12.16K ops/s | 1.12M ops/s | +9148.0% | 92.48x |
| or-n3412-r101-001 | full-execution-false | 3.58K ops/s | 131.22K ops/s | +3561.4% | 36.61x |
| or-n1968-r105-001 | full-execution-false | 6.35K ops/s | 224.92K ops/s | +3440.2% | 35.40x |
| or-n1968-r105-001 | complete-false | 6.22K ops/s | 210.75K ops/s | +3286.7% | 33.87x |
| or-n3412-r101-001 | complete-false | 3.63K ops/s | 122.43K ops/s | +3274.6% | 33.75x |
| or-n1968-r105-001 | empty-context | 62.78K ops/s | 1.72M ops/s | +2639.2% | 27.39x |
| or-n1968-r105-001 | partial-false | 62.71K ops/s | 1.71M ops/s | +2627.8% | 27.28x |
| or-n1968-r105-001 | partial-true | 61.32K ops/s | 1.61M ops/s | +2519.3% | 26.19x |
| or-n3412-r101-001 | empty-context | 34.57K ops/s | 773.80K ops/s | +2138.2% | 22.38x |
| or-n3412-r101-001 | partial-false | 37.83K ops/s | 773.18K ops/s | +1943.6% | 20.44x |
| or-n3412-r101-001 | partial-true | 37.25K ops/s | 750.70K ops/s | +1915.5% | 20.15x |
| or-n3412-r101-001 | full-execution-true | 5.18K ops/s | 96.33K ops/s | +1759.9% | 18.60x |
| or-n1968-r105-001 | full-execution-true | 9.08K ops/s | 158.88K ops/s | +1650.2% | 17.50x |
| in-n122-r1-001 | full-execution-false | 770.86K ops/s | 10.28M ops/s | +1234.1% | 13.34x |
| in-n122-r1-001 | complete-false | 873.33K ops/s | 10.26M ops/s | +1074.7% | 11.75x |
| in-n122-r1-001 | complete-true | 952.80K ops/s | 9.91M ops/s | +940.0% | 10.40x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n105-r100-010 | empty-context | 7.20M ops/s | 8.66M ops/s | +20.3% | 1.20x |
| overlap-n105-r100-022 | partial-false | 7.20M ops/s | 8.90M ops/s | +23.5% | 1.23x |
| overlap-n105-r100-012 | partial-false | 7.21M ops/s | 8.92M ops/s | +23.7% | 1.24x |
| overlap-n105-r100-016 | empty-context | 7.16M ops/s | 8.88M ops/s | +24.0% | 1.24x |
| overlap-n105-r100-023 | partial-false | 7.23M ops/s | 8.98M ops/s | +24.3% | 1.24x |
| overlap-n105-r100-013 | empty-context | 7.20M ops/s | 8.96M ops/s | +24.3% | 1.24x |
| overlap-n105-r100-022 | empty-context | 7.23M ops/s | 8.99M ops/s | +24.4% | 1.24x |
| overlap-n105-r100-013 | partial-false | 7.21M ops/s | 8.98M ops/s | +24.6% | 1.25x |
| overlap-n105-r100-014 | partial-false | 7.21M ops/s | 9.00M ops/s | +24.9% | 1.25x |
| overlap-n105-r100-012 | empty-context | 7.16M ops/s | 8.94M ops/s | +24.9% | 1.25x |
| overlap-n105-r100-020 | empty-context | 7.12M ops/s | 8.89M ops/s | +24.9% | 1.25x |
| overlap-n105-r100-020 | partial-false | 7.19M ops/s | 8.98M ops/s | +24.9% | 1.25x |
| overlap-n105-r100-018 | partial-false | 7.15M ops/s | 8.94M ops/s | +25.1% | 1.25x |
| overlap-n105-r100-008 | partial-false | 7.18M ops/s | 8.98M ops/s | +25.1% | 1.25x |
| overlap-n105-r100-009 | partial-false | 7.16M ops/s | 8.96M ops/s | +25.2% | 1.25x |
| overlap-n105-r100-014 | empty-context | 7.19M ops/s | 9.00M ops/s | +25.2% | 1.25x |
| overlap-n105-r100-019 | partial-false | 7.15M ops/s | 8.95M ops/s | +25.2% | 1.25x |
| overlap-n105-r100-011 | partial-false | 7.22M ops/s | 9.04M ops/s | +25.2% | 1.25x |
| overlap-n105-r100-010 | partial-false | 7.20M ops/s | 9.02M ops/s | +25.3% | 1.25x |
| overlap-n105-r100-016 | partial-false | 7.16M ops/s | 8.98M ops/s | +25.3% | 1.25x |

### Regressions

_No regressions._

