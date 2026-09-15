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
| or-n3412-r101-001 | early-true | 109.13K ops/s | 11.49M ops/s | +10429.9% | 105.30x |
| or-n3412-r101-001 | complete-true | 108.59K ops/s | 11.38M ops/s | +10375.7% | 104.76x |
| or-n3412-r101-001 | partial-true | 117.24K ops/s | 11.51M ops/s | +9719.5% | 98.20x |
| or-n1968-r105-001 | complete-true | 147.56K ops/s | 10.95M ops/s | +7324.0% | 74.24x |
| or-n1968-r105-001 | early-true | 147.02K ops/s | 10.81M ops/s | +7251.2% | 73.51x |
| or-n1968-r105-001 | partial-true | 165.81K ops/s | 10.97M ops/s | +6516.5% | 66.16x |
| overlap-n105-r100-001 | full-execution-true | 337.08K ops/s | 20.41M ops/s | +5954.4% | 60.54x |
| overlap-n105-r100-001 | complete-true | 337.48K ops/s | 20.36M ops/s | +5932.9% | 60.33x |
| overlap-n105-r100-001 | early-true | 337.02K ops/s | 20.33M ops/s | +5932.4% | 60.32x |
| overlap-n105-r100-013 | full-execution-true | 327.98K ops/s | 19.44M ops/s | +5826.4% | 59.26x |
| overlap-n105-r100-013 | complete-true | 339.08K ops/s | 19.82M ops/s | +5745.5% | 58.46x |
| overlap-n105-r100-012 | early-true | 342.15K ops/s | 19.90M ops/s | +5716.7% | 58.17x |
| overlap-n105-r100-010 | early-true | 337.22K ops/s | 19.60M ops/s | +5713.1% | 58.13x |
| overlap-n105-r100-012 | complete-true | 342.25K ops/s | 19.73M ops/s | +5665.2% | 57.65x |
| overlap-n105-r100-011 | complete-true | 340.05K ops/s | 19.42M ops/s | +5611.2% | 57.11x |
| overlap-n105-r100-014 | full-execution-true | 340.87K ops/s | 19.45M ops/s | +5606.8% | 57.07x |
| overlap-n105-r100-002 | complete-true | 339.54K ops/s | 19.37M ops/s | +5605.4% | 57.05x |
| overlap-n105-r100-012 | full-execution-true | 339.52K ops/s | 19.29M ops/s | +5580.2% | 56.80x |
| overlap-n105-r100-010 | full-execution-true | 337.91K ops/s | 19.16M ops/s | +5569.5% | 56.70x |
| overlap-n105-r100-004 | full-execution-true | 338.19K ops/s | 18.87M ops/s | +5480.4% | 55.80x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 250-or-and-in | complete-false | 11.23M ops/s | 7.74M ops/s | -31.1% | 0.69x |
| 250-or-and-in | empty-context | 11.17M ops/s | 7.74M ops/s | -30.7% | 0.69x |
| 250-or-and-in | partial-false | 10.65M ops/s | 7.59M ops/s | -28.7% | 0.71x |
| 249-and-or-eqs | empty-context | 16.17M ops/s | 11.76M ops/s | -27.2% | 0.73x |
| 249-and-or-eqs | complete-false | 16.33M ops/s | 11.89M ops/s | -27.2% | 0.73x |
| 249-and-or-eqs | partial-false | 15.78M ops/s | 11.79M ops/s | -25.3% | 0.75x |
| 250-or-and-in | partial-true | 11.75M ops/s | 9.25M ops/s | -21.3% | 0.79x |
| 251-or-and-in-mixed-eq-in | early-true | 11.84M ops/s | 9.32M ops/s | -21.3% | 0.79x |
| 250-or-and-in | complete-true | 11.69M ops/s | 9.22M ops/s | -21.1% | 0.79x |
| 251-or-and-in-mixed-eq-in | partial-true | 11.73M ops/s | 9.27M ops/s | -20.9% | 0.79x |
| 251-or-and-in-mixed-eq-in | partial-false | 9.82M ops/s | 7.84M ops/s | -20.1% | 0.80x |
| 250-or-and-in | early-true | 11.53M ops/s | 9.22M ops/s | -20.1% | 0.80x |
| 251-or-and-in-mixed-eq-in | complete-true | 11.60M ops/s | 9.29M ops/s | -19.9% | 0.80x |
| 251-or-and-in-mixed-eq-in | complete-false | 9.53M ops/s | 7.66M ops/s | -19.6% | 0.80x |
| 251-or-and-in-mixed-eq-in | empty-context | 9.78M ops/s | 7.98M ops/s | -18.5% | 0.82x |
| 250-or-and-in | full-execution-false | 6.64M ops/s | 5.58M ops/s | -16.0% | 0.84x |
| 250-or-and-in | late-true | 6.75M ops/s | 5.69M ops/s | -15.6% | 0.84x |
| 249-and-or-eqs | early-true | 6.14M ops/s | 5.20M ops/s | -15.3% | 0.85x |
| 249-and-or-eqs | partial-true | 6.20M ops/s | 5.29M ops/s | -14.8% | 0.85x |
| 249-and-or-eqs | complete-true | 6.14M ops/s | 5.28M ops/s | -14.0% | 0.86x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 250-or-and-in | complete-false | 11.23M ops/s | 7.74M ops/s | -31.1% | 0.69x |
| 250-or-and-in | empty-context | 11.17M ops/s | 7.74M ops/s | -30.7% | 0.69x |
| 250-or-and-in | partial-false | 10.65M ops/s | 7.59M ops/s | -28.7% | 0.71x |
| 249-and-or-eqs | empty-context | 16.17M ops/s | 11.76M ops/s | -27.2% | 0.73x |
| 249-and-or-eqs | complete-false | 16.33M ops/s | 11.89M ops/s | -27.2% | 0.73x |
| 249-and-or-eqs | partial-false | 15.78M ops/s | 11.79M ops/s | -25.3% | 0.75x |
| 250-or-and-in | partial-true | 11.75M ops/s | 9.25M ops/s | -21.3% | 0.79x |
| 251-or-and-in-mixed-eq-in | early-true | 11.84M ops/s | 9.32M ops/s | -21.3% | 0.79x |
| 250-or-and-in | complete-true | 11.69M ops/s | 9.22M ops/s | -21.1% | 0.79x |
| 251-or-and-in-mixed-eq-in | partial-true | 11.73M ops/s | 9.27M ops/s | -20.9% | 0.79x |
| 251-or-and-in-mixed-eq-in | partial-false | 9.82M ops/s | 7.84M ops/s | -20.1% | 0.80x |
| 250-or-and-in | early-true | 11.53M ops/s | 9.22M ops/s | -20.1% | 0.80x |
| 251-or-and-in-mixed-eq-in | complete-true | 11.60M ops/s | 9.29M ops/s | -19.9% | 0.80x |
| 251-or-and-in-mixed-eq-in | complete-false | 9.53M ops/s | 7.66M ops/s | -19.6% | 0.80x |
| 251-or-and-in-mixed-eq-in | empty-context | 9.78M ops/s | 7.98M ops/s | -18.5% | 0.82x |
| 250-or-and-in | full-execution-false | 6.64M ops/s | 5.58M ops/s | -16.0% | 0.84x |
| 250-or-and-in | late-true | 6.75M ops/s | 5.69M ops/s | -15.6% | 0.84x |
| 249-and-or-eqs | early-true | 6.14M ops/s | 5.20M ops/s | -15.3% | 0.85x |
| 249-and-or-eqs | partial-true | 6.20M ops/s | 5.29M ops/s | -14.8% | 0.85x |
| 249-and-or-eqs | complete-true | 6.14M ops/s | 5.28M ops/s | -14.0% | 0.86x |
| 249-and-or-eqs | full-execution-true | 4.49M ops/s | 3.87M ops/s | -13.8% | 0.86x |
| 250-or-and-in | full-execution-true | 6.56M ops/s | 5.66M ops/s | -13.6% | 0.86x |
| 251-or-and-in-mixed-eq-in | full-execution-true | 7.46M ops/s | 6.51M ops/s | -12.8% | 0.87x |
| 249-and-or-eqs | full-execution-false | 4.42M ops/s | 3.87M ops/s | -12.3% | 0.88x |
| 249-and-or-eqs | late-true | 4.37M ops/s | 3.87M ops/s | -11.5% | 0.89x |
| 251-or-and-in-mixed-eq-in | late-true | 7.33M ops/s | 6.52M ops/s | -11.0% | 0.89x |
| 251-or-and-in-mixed-eq-in | full-execution-false | 6.02M ops/s | 5.61M ops/s | -6.7% | 0.93x |

