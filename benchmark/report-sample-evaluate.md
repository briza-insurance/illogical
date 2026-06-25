# Benchmark Comparison Report — evaluate

**Baseline:** `results-sample-evaluate-oop.json`
**Improved:** `results-sample-evaluate-bytecode.json`
**Total cases compared:** 792

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 779 |
| Slower (>-5%) | 12 |
| Unchanged | 1 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n3412-r101-001 | early-true | 108.80K ops/s | 10.80M ops/s | +9823.2% | 99.23x |
| or-n3412-r101-001 | complete-true | 109.30K ops/s | 10.71M ops/s | +9696.4% | 97.96x |
| or-n3412-r101-001 | partial-true | 120.21K ops/s | 11.54M ops/s | +9501.0% | 96.01x |
| or-n1968-r105-001 | complete-true | 149.94K ops/s | 12.49M ops/s | +8232.5% | 83.33x |
| or-n1968-r105-001 | early-true | 149.49K ops/s | 11.60M ops/s | +7659.4% | 77.59x |
| or-n1968-r105-001 | partial-true | 171.66K ops/s | 12.25M ops/s | +7038.1% | 71.38x |
| overlap-n105-r100-001 | early-true | 289.27K ops/s | 20.17M ops/s | +6872.6% | 69.73x |
| overlap-n105-r100-001 | complete-true | 290.03K ops/s | 20.01M ops/s | +6799.0% | 68.99x |
| overlap-n105-r100-019 | early-true | 290.23K ops/s | 19.99M ops/s | +6789.2% | 68.89x |
| overlap-n105-r100-001 | full-execution-true | 289.96K ops/s | 19.68M ops/s | +6687.9% | 67.88x |
| overlap-n105-r100-020 | complete-true | 287.60K ops/s | 19.43M ops/s | +6657.5% | 67.57x |
| overlap-n105-r100-019 | full-execution-true | 290.38K ops/s | 19.31M ops/s | +6551.5% | 66.52x |
| overlap-n105-r100-019 | complete-true | 310.38K ops/s | 19.47M ops/s | +6172.2% | 62.72x |
| overlap-n105-r100-002 | complete-true | 288.73K ops/s | 17.93M ops/s | +6108.4% | 62.08x |
| overlap-n105-r100-016 | complete-true | 343.45K ops/s | 20.71M ops/s | +5930.9% | 60.31x |
| overlap-n105-r100-016 | early-true | 342.39K ops/s | 20.52M ops/s | +5892.4% | 59.92x |
| overlap-n105-r100-023 | complete-true | 343.71K ops/s | 20.59M ops/s | +5889.2% | 59.89x |
| overlap-n105-r100-007 | full-execution-true | 343.00K ops/s | 20.48M ops/s | +5871.7% | 59.72x |
| overlap-n105-r100-007 | early-true | 342.02K ops/s | 20.42M ops/s | +5871.5% | 59.72x |
| overlap-n105-r100-016 | full-execution-true | 341.78K ops/s | 20.34M ops/s | +5851.2% | 59.51x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 249-and-or-eqs | partial-false | 16.51M ops/s | 11.29M ops/s | -31.6% | 0.68x |
| 249-and-or-eqs | empty-context | 17.06M ops/s | 11.68M ops/s | -31.5% | 0.68x |
| 249-and-or-eqs | complete-false | 17.27M ops/s | 11.99M ops/s | -30.5% | 0.69x |
| 251-or-and-in-mixed-eq-in | partial-false | 9.88M ops/s | 7.70M ops/s | -22.1% | 0.78x |
| 251-or-and-in-mixed-eq-in | complete-false | 9.75M ops/s | 7.62M ops/s | -21.8% | 0.78x |
| 251-or-and-in-mixed-eq-in | empty-context | 10.11M ops/s | 7.94M ops/s | -21.4% | 0.79x |
| 251-or-and-in-mixed-eq-in | early-true | 11.83M ops/s | 9.41M ops/s | -20.4% | 0.80x |
| 251-or-and-in-mixed-eq-in | partial-true | 11.82M ops/s | 9.44M ops/s | -20.1% | 0.80x |
| 251-or-and-in-mixed-eq-in | complete-true | 11.80M ops/s | 9.44M ops/s | -20.0% | 0.80x |
| 251-or-and-in-mixed-eq-in | late-true | 7.55M ops/s | 6.54M ops/s | -13.3% | 0.87x |
| 251-or-and-in-mixed-eq-in | full-execution-true | 7.45M ops/s | 6.55M ops/s | -12.0% | 0.88x |
| 251-or-and-in-mixed-eq-in | full-execution-false | 6.03M ops/s | 5.58M ops/s | -7.5% | 0.93x |
| 249-and-or-eqs | partial-true | 6.33M ops/s | 6.65M ops/s | +4.9% | 1.05x |
| 249-and-or-eqs | early-true | 6.27M ops/s | 6.65M ops/s | +6.1% | 1.06x |
| 249-and-or-eqs | complete-true | 6.38M ops/s | 6.87M ops/s | +7.8% | 1.08x |
| or-n4691-r2-001 | partial-true | 6.12M ops/s | 8.22M ops/s | +34.3% | 1.34x |
| or-n4691-r2-001 | early-true | 6.08M ops/s | 8.17M ops/s | +34.3% | 1.34x |
| or-n4691-r2-001 | complete-true | 6.10M ops/s | 8.22M ops/s | +34.8% | 1.35x |
| or-n4691-r2-001 | partial-false | 101.45K ops/s | 143.01K ops/s | +41.0% | 1.41x |
| or-n4691-r2-001 | empty-context | 103.03K ops/s | 146.00K ops/s | +41.7% | 1.42x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 249-and-or-eqs | partial-false | 16.51M ops/s | 11.29M ops/s | -31.6% | 0.68x |
| 249-and-or-eqs | empty-context | 17.06M ops/s | 11.68M ops/s | -31.5% | 0.68x |
| 249-and-or-eqs | complete-false | 17.27M ops/s | 11.99M ops/s | -30.5% | 0.69x |
| 251-or-and-in-mixed-eq-in | partial-false | 9.88M ops/s | 7.70M ops/s | -22.1% | 0.78x |
| 251-or-and-in-mixed-eq-in | complete-false | 9.75M ops/s | 7.62M ops/s | -21.8% | 0.78x |
| 251-or-and-in-mixed-eq-in | empty-context | 10.11M ops/s | 7.94M ops/s | -21.4% | 0.79x |
| 251-or-and-in-mixed-eq-in | early-true | 11.83M ops/s | 9.41M ops/s | -20.4% | 0.80x |
| 251-or-and-in-mixed-eq-in | partial-true | 11.82M ops/s | 9.44M ops/s | -20.1% | 0.80x |
| 251-or-and-in-mixed-eq-in | complete-true | 11.80M ops/s | 9.44M ops/s | -20.0% | 0.80x |
| 251-or-and-in-mixed-eq-in | late-true | 7.55M ops/s | 6.54M ops/s | -13.3% | 0.87x |
| 251-or-and-in-mixed-eq-in | full-execution-true | 7.45M ops/s | 6.55M ops/s | -12.0% | 0.88x |
| 251-or-and-in-mixed-eq-in | full-execution-false | 6.03M ops/s | 5.58M ops/s | -7.5% | 0.93x |

