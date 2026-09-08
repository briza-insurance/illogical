# Benchmark Comparison Report — simplify

**Baseline:** `results-sample-simplify-oop.json`
**Improved:** `results-sample-simplify-bytecode.json`
**Total cases compared:** 616

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 608 |
| Slower (>-5%) | 2 |
| Unchanged | 6 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n4691-r2-001 | full-execution-true | 31.22K ops/s | 8.73M ops/s | +27872.2% | 279.72x |
| or-n4691-r2-001 | full-execution-false | 31.70K ops/s | 8.72M ops/s | +27392.6% | 274.93x |
| or-n4691-r2-001 | complete-false | 41.61K ops/s | 7.02M ops/s | +16781.2% | 168.81x |
| or-n3412-r101-001 | full-execution-false | 4.95K ops/s | 173.21K ops/s | +3398.3% | 34.98x |
| or-n3412-r101-001 | complete-false | 5.22K ops/s | 168.49K ops/s | +3127.2% | 32.27x |
| or-n1968-r105-001 | full-execution-false | 9.33K ops/s | 255.13K ops/s | +2634.6% | 27.35x |
| or-n1968-r105-001 | complete-false | 8.96K ops/s | 238.58K ops/s | +2562.3% | 26.62x |
| or-n1968-r105-001 | partial-false | 74.42K ops/s | 1.54M ops/s | +1969.6% | 20.70x |
| or-n1968-r105-001 | empty-context | 74.45K ops/s | 1.52M ops/s | +1937.0% | 20.37x |
| or-n1968-r105-001 | partial-true | 74.81K ops/s | 1.45M ops/s | +1832.4% | 19.32x |
| or-n4691-r2-001 | partial-false | 14.16K ops/s | 263.40K ops/s | +1759.6% | 18.60x |
| or-n4691-r2-001 | empty-context | 14.44K ops/s | 263.92K ops/s | +1727.7% | 18.28x |
| or-n3412-r101-001 | full-execution-true | 7.38K ops/s | 120.84K ops/s | +1536.3% | 16.36x |
| or-n3412-r101-001 | partial-true | 42.31K ops/s | 654.05K ops/s | +1445.9% | 15.46x |
| or-n3412-r101-001 | partial-false | 43.40K ops/s | 667.91K ops/s | +1438.8% | 15.39x |
| or-n3412-r101-001 | empty-context | 43.93K ops/s | 670.72K ops/s | +1426.6% | 15.27x |
| or-n1968-r105-001 | full-execution-true | 13.24K ops/s | 200.44K ops/s | +1414.1% | 15.14x |
| or-n3412-r101-001 | complete-true | 42.45K ops/s | 404.45K ops/s | +852.7% | 9.53x |
| in-n122-r1-001 | complete-false | 1.07M ops/s | 9.37M ops/s | +774.6% | 8.75x |
| in-n122-r1-001 | full-execution-false | 1.09M ops/s | 9.41M ops/s | +761.2% | 8.61x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 249-and-or-eqs | complete-false | 9.98M ops/s | 5.63M ops/s | -43.6% | 0.56x |
| 249-and-or-eqs | complete-true | 3.58M ops/s | 3.36M ops/s | -6.0% | 0.94x |
| 249-and-or-eqs | partial-true | 3.50M ops/s | 3.36M ops/s | -3.9% | 0.96x |
| overlap-n105-r100-012 | partial-false | 8.65M ops/s | 9.02M ops/s | +4.3% | 1.04x |
| overlap-n105-r100-011 | partial-false | 8.65M ops/s | 9.03M ops/s | +4.4% | 1.04x |
| overlap-n105-r100-013 | partial-false | 8.69M ops/s | 9.10M ops/s | +4.7% | 1.05x |
| overlap-n105-r100-006 | partial-false | 8.64M ops/s | 9.06M ops/s | +4.8% | 1.05x |
| overlap-n105-r100-008 | partial-false | 8.57M ops/s | 8.99M ops/s | +4.9% | 1.05x |
| overlap-n105-r100-014 | partial-false | 8.62M ops/s | 9.06M ops/s | +5.1% | 1.05x |
| overlap-n105-r100-009 | partial-false | 8.61M ops/s | 9.10M ops/s | +5.7% | 1.06x |
| overlap-n105-r100-016 | empty-context | 8.87M ops/s | 9.38M ops/s | +5.7% | 1.06x |
| overlap-n105-r100-007 | partial-false | 8.63M ops/s | 9.14M ops/s | +5.9% | 1.06x |
| overlap-n105-r100-008 | empty-context | 8.79M ops/s | 9.32M ops/s | +6.1% | 1.06x |
| overlap-n105-r100-018 | partial-false | 8.68M ops/s | 9.21M ops/s | +6.1% | 1.06x |
| overlap-n105-r100-005 | partial-false | 8.61M ops/s | 9.14M ops/s | +6.2% | 1.06x |
| overlap-n105-r100-010 | partial-false | 8.54M ops/s | 9.07M ops/s | +6.2% | 1.06x |
| overlap-n105-r100-012 | empty-context | 8.83M ops/s | 9.38M ops/s | +6.2% | 1.06x |
| overlap-n105-r100-001 | partial-false | 8.66M ops/s | 9.21M ops/s | +6.4% | 1.06x |
| overlap-n105-r100-001 | empty-context | 8.79M ops/s | 9.37M ops/s | +6.6% | 1.07x |
| overlap-n105-r100-002 | empty-context | 8.80M ops/s | 9.39M ops/s | +6.7% | 1.07x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 249-and-or-eqs | complete-false | 9.98M ops/s | 5.63M ops/s | -43.6% | 0.56x |
| 249-and-or-eqs | complete-true | 3.58M ops/s | 3.36M ops/s | -6.0% | 0.94x |

