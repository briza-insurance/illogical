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
| or-n3412-r101-001 | complete-true | 107.69K ops/s | 12.03M ops/s | +11074.3% | 111.74x |
| or-n3412-r101-001 | early-true | 109.28K ops/s | 12.00M ops/s | +10880.2% | 109.80x |
| or-n3412-r101-001 | partial-true | 118.57K ops/s | 12.25M ops/s | +10233.7% | 103.34x |
| or-n1968-r105-001 | early-true | 149.06K ops/s | 12.03M ops/s | +7970.6% | 80.71x |
| or-n1968-r105-001 | complete-true | 149.53K ops/s | 11.83M ops/s | +7811.9% | 79.12x |
| or-n1968-r105-001 | partial-true | 168.12K ops/s | 12.04M ops/s | +7062.2% | 71.62x |
| overlap-n105-r100-020 | early-true | 292.21K ops/s | 19.90M ops/s | +6709.3% | 68.09x |
| overlap-n105-r100-020 | full-execution-true | 297.57K ops/s | 19.55M ops/s | +6468.4% | 65.68x |
| overlap-n105-r100-001 | complete-true | 297.82K ops/s | 19.34M ops/s | +6393.0% | 64.93x |
| overlap-n105-r100-005 | early-true | 297.45K ops/s | 19.15M ops/s | +6337.3% | 64.37x |
| overlap-n105-r100-001 | full-execution-true | 299.80K ops/s | 18.88M ops/s | +6198.3% | 62.98x |
| overlap-n105-r100-017 | early-true | 344.83K ops/s | 19.99M ops/s | +5697.1% | 57.97x |
| overlap-n105-r100-023 | complete-true | 346.61K ops/s | 20.02M ops/s | +5677.3% | 57.77x |
| overlap-n105-r100-023 | full-execution-true | 345.87K ops/s | 19.91M ops/s | +5657.0% | 57.57x |
| overlap-n105-r100-022 | complete-true | 345.94K ops/s | 19.82M ops/s | +5628.4% | 57.28x |
| overlap-n105-r100-018 | complete-true | 347.65K ops/s | 19.84M ops/s | +5605.9% | 57.06x |
| overlap-n105-r100-016 | complete-true | 346.63K ops/s | 19.76M ops/s | +5601.0% | 57.01x |
| overlap-n105-r100-022 | full-execution-true | 341.52K ops/s | 19.43M ops/s | +5588.5% | 56.89x |
| overlap-n105-r100-022 | early-true | 345.35K ops/s | 19.63M ops/s | +5583.7% | 56.84x |
| overlap-n105-r100-017 | full-execution-true | 352.49K ops/s | 20.02M ops/s | +5580.5% | 56.80x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 250-or-and-in | complete-false | 11.32M ops/s | 7.82M ops/s | -30.9% | 0.69x |
| 249-and-or-eqs | complete-false | 17.11M ops/s | 11.84M ops/s | -30.8% | 0.69x |
| 249-and-or-eqs | partial-false | 16.70M ops/s | 11.57M ops/s | -30.7% | 0.69x |
| 250-or-and-in | partial-false | 10.80M ops/s | 7.49M ops/s | -30.6% | 0.69x |
| 249-and-or-eqs | empty-context | 16.89M ops/s | 11.76M ops/s | -30.3% | 0.70x |
| 250-or-and-in | empty-context | 11.25M ops/s | 7.85M ops/s | -30.2% | 0.70x |
| 250-or-and-in | early-true | 11.94M ops/s | 9.37M ops/s | -21.5% | 0.78x |
| 251-or-and-in-mixed-eq-in | early-true | 11.91M ops/s | 9.39M ops/s | -21.2% | 0.79x |
| 250-or-and-in | complete-true | 11.83M ops/s | 9.34M ops/s | -21.0% | 0.79x |
| 250-or-and-in | partial-true | 11.89M ops/s | 9.40M ops/s | -21.0% | 0.79x |
| 251-or-and-in-mixed-eq-in | partial-true | 11.86M ops/s | 9.39M ops/s | -20.9% | 0.79x |
| 251-or-and-in-mixed-eq-in | empty-context | 10.00M ops/s | 7.93M ops/s | -20.7% | 0.79x |
| 251-or-and-in-mixed-eq-in | complete-true | 11.84M ops/s | 9.40M ops/s | -20.6% | 0.79x |
| 251-or-and-in-mixed-eq-in | partial-false | 9.66M ops/s | 7.70M ops/s | -20.3% | 0.80x |
| 251-or-and-in-mixed-eq-in | complete-false | 9.72M ops/s | 7.78M ops/s | -20.0% | 0.80x |
| 249-and-or-eqs | early-true | 6.42M ops/s | 5.21M ops/s | -18.8% | 0.81x |
| 249-and-or-eqs | complete-true | 6.39M ops/s | 5.21M ops/s | -18.5% | 0.82x |
| 249-and-or-eqs | partial-true | 6.36M ops/s | 5.21M ops/s | -18.0% | 0.82x |
| 249-and-or-eqs | full-execution-true | 4.56M ops/s | 3.84M ops/s | -15.8% | 0.84x |
| 250-or-and-in | full-execution-true | 6.80M ops/s | 5.77M ops/s | -15.2% | 0.85x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 250-or-and-in | complete-false | 11.32M ops/s | 7.82M ops/s | -30.9% | 0.69x |
| 249-and-or-eqs | complete-false | 17.11M ops/s | 11.84M ops/s | -30.8% | 0.69x |
| 249-and-or-eqs | partial-false | 16.70M ops/s | 11.57M ops/s | -30.7% | 0.69x |
| 250-or-and-in | partial-false | 10.80M ops/s | 7.49M ops/s | -30.6% | 0.69x |
| 249-and-or-eqs | empty-context | 16.89M ops/s | 11.76M ops/s | -30.3% | 0.70x |
| 250-or-and-in | empty-context | 11.25M ops/s | 7.85M ops/s | -30.2% | 0.70x |
| 250-or-and-in | early-true | 11.94M ops/s | 9.37M ops/s | -21.5% | 0.78x |
| 251-or-and-in-mixed-eq-in | early-true | 11.91M ops/s | 9.39M ops/s | -21.2% | 0.79x |
| 250-or-and-in | complete-true | 11.83M ops/s | 9.34M ops/s | -21.0% | 0.79x |
| 250-or-and-in | partial-true | 11.89M ops/s | 9.40M ops/s | -21.0% | 0.79x |
| 251-or-and-in-mixed-eq-in | partial-true | 11.86M ops/s | 9.39M ops/s | -20.9% | 0.79x |
| 251-or-and-in-mixed-eq-in | empty-context | 10.00M ops/s | 7.93M ops/s | -20.7% | 0.79x |
| 251-or-and-in-mixed-eq-in | complete-true | 11.84M ops/s | 9.40M ops/s | -20.6% | 0.79x |
| 251-or-and-in-mixed-eq-in | partial-false | 9.66M ops/s | 7.70M ops/s | -20.3% | 0.80x |
| 251-or-and-in-mixed-eq-in | complete-false | 9.72M ops/s | 7.78M ops/s | -20.0% | 0.80x |
| 249-and-or-eqs | early-true | 6.42M ops/s | 5.21M ops/s | -18.8% | 0.81x |
| 249-and-or-eqs | complete-true | 6.39M ops/s | 5.21M ops/s | -18.5% | 0.82x |
| 249-and-or-eqs | partial-true | 6.36M ops/s | 5.21M ops/s | -18.0% | 0.82x |
| 249-and-or-eqs | full-execution-true | 4.56M ops/s | 3.84M ops/s | -15.8% | 0.84x |
| 250-or-and-in | full-execution-true | 6.80M ops/s | 5.77M ops/s | -15.2% | 0.85x |
| 249-and-or-eqs | full-execution-false | 4.51M ops/s | 3.83M ops/s | -15.1% | 0.85x |
| 249-and-or-eqs | late-true | 4.54M ops/s | 3.87M ops/s | -14.7% | 0.85x |
| 250-or-and-in | late-true | 6.75M ops/s | 5.78M ops/s | -14.4% | 0.86x |
| 250-or-and-in | full-execution-false | 6.68M ops/s | 5.75M ops/s | -14.0% | 0.86x |
| 251-or-and-in-mixed-eq-in | late-true | 7.47M ops/s | 6.54M ops/s | -12.5% | 0.88x |
| 251-or-and-in-mixed-eq-in | full-execution-true | 7.46M ops/s | 6.58M ops/s | -11.8% | 0.88x |
| 251-or-and-in-mixed-eq-in | full-execution-false | 6.15M ops/s | 5.66M ops/s | -7.8% | 0.92x |

