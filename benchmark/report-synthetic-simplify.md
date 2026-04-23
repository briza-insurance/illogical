# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 82

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 69 |
| Slower (>-5%) | 10 |
| Unchanged | 3 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| in-n1224-r1-10x | full-execution-false | 109.97K ops/s | 14.48M ops/s | +13063.2% | 131.63x |
| in-n1224-r1-10x | partial-false | 120.04K ops/s | 15.49M ops/s | +12805.5% | 129.05x |
| in-n1224-r1-10x | empty-context | 114.41K ops/s | 14.66M ops/s | +12711.8% | 128.12x |
| in-n1224-r1-10x | complete-false | 112.50K ops/s | 14.00M ops/s | +12346.0% | 124.46x |
| in-n1224-r1-10x | complete-true | 115.64K ops/s | 12.19M ops/s | +10442.3% | 105.42x |
| in-n1224-r1-10x | full-execution-true | 116.66K ops/s | 11.77M ops/s | +9986.1% | 100.86x |
| in-n1224-r1-10x | partial-true | 122.14K ops/s | 11.96M ops/s | +9690.2% | 97.90x |
| in-n614-r1-5x | partial-false | 239.07K ops/s | 15.34M ops/s | +6315.3% | 64.15x |
| in-n614-r1-5x | empty-context | 237.95K ops/s | 14.83M ops/s | +6132.2% | 62.32x |
| in-n614-r1-5x | complete-false | 212.72K ops/s | 12.85M ops/s | +5939.7% | 60.40x |
| in-n614-r1-5x | full-execution-false | 223.08K ops/s | 12.80M ops/s | +5637.0% | 57.37x |
| in-n614-r1-5x | partial-true | 228.76K ops/s | 12.40M ops/s | +5320.0% | 54.20x |
| in-n614-r1-5x | complete-true | 226.95K ops/s | 12.06M ops/s | +5212.2% | 53.12x |
| in-n614-r1-5x | full-execution-true | 238.64K ops/s | 12.13M ops/s | +4981.7% | 50.82x |
| overlap-n447-r50-10x | partial-false | 402.04K ops/s | 15.59M ops/s | +3776.7% | 38.77x |
| overlap-n447-r50-10x | empty-context | 400.95K ops/s | 14.60M ops/s | +3541.9% | 36.42x |
| overlap-n447-r50-10x | full-execution-true | 388.52K ops/s | 13.34M ops/s | +3334.5% | 34.35x |
| overlap-n447-r50-10x | complete-true | 399.54K ops/s | 13.28M ops/s | +3223.2% | 33.23x |
| overlap-n447-r50-10x | partial-true | 397.39K ops/s | 12.74M ops/s | +3106.7% | 32.07x |
| overlap-n252-r25-5x | empty-context | 654.52K ops/s | 14.55M ops/s | +2123.6% | 22.24x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-simple-eq | complete-true | 16.11M ops/s | 13.26M ops/s | -17.7% | 0.82x |
| expression-simple-eq | complete-false | 16.22M ops/s | 13.82M ops/s | -14.8% | 0.85x |
| expression-simple-eq | full-execution-false | 15.24M ops/s | 13.07M ops/s | -14.2% | 0.86x |
| expression-simple-eq | partial-true | 16.13M ops/s | 13.89M ops/s | -13.9% | 0.86x |
| expression-simple-ne | complete-true | 15.78M ops/s | 13.78M ops/s | -12.6% | 0.87x |
| expression-medium-or | complete-true | 11.93M ops/s | 10.64M ops/s | -10.8% | 0.89x |
| expression-simple-eq | full-execution-true | 15.78M ops/s | 14.23M ops/s | -9.9% | 0.90x |
| expression-medium-or | partial-true | 11.65M ops/s | 10.83M ops/s | -7.0% | 0.93x |
| expression-deep-nested | complete-false | 10.90M ops/s | 10.28M ops/s | -5.8% | 0.94x |
| expression-reference-nested | full-execution-false | 6.29M ops/s | 5.95M ops/s | -5.4% | 0.95x |
| expression-reference-nested | complete-false | 10.95M ops/s | 10.43M ops/s | -4.7% | 0.95x |
| expression-medium-and | complete-false | 11.12M ops/s | 10.77M ops/s | -3.1% | 0.97x |
| expression-complex-nested | complete-false | 11.02M ops/s | 10.95M ops/s | -0.7% | 0.99x |
| expression-medium-or | complete-false | 5.38M ops/s | 5.70M ops/s | +6.0% | 1.06x |
| expression-medium-or | full-execution-true | 5.37M ops/s | 5.71M ops/s | +6.4% | 1.06x |
| expression-medium-or | full-execution-false | 5.45M ops/s | 5.84M ops/s | +7.2% | 1.07x |
| expression-medium-and | full-execution-false | 4.28M ops/s | 4.75M ops/s | +10.8% | 1.11x |
| expression-arithmetic | partial-false | 3.36M ops/s | 3.82M ops/s | +13.6% | 1.14x |
| expression-simple-eq | partial-false | 12.46M ops/s | 14.43M ops/s | +15.8% | 1.16x |
| expression-simple-ne | empty-context | 12.42M ops/s | 14.39M ops/s | +15.9% | 1.16x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-simple-eq | complete-true | 16.11M ops/s | 13.26M ops/s | -17.7% | 0.82x |
| expression-simple-eq | complete-false | 16.22M ops/s | 13.82M ops/s | -14.8% | 0.85x |
| expression-simple-eq | full-execution-false | 15.24M ops/s | 13.07M ops/s | -14.2% | 0.86x |
| expression-simple-eq | partial-true | 16.13M ops/s | 13.89M ops/s | -13.9% | 0.86x |
| expression-simple-ne | complete-true | 15.78M ops/s | 13.78M ops/s | -12.6% | 0.87x |
| expression-medium-or | complete-true | 11.93M ops/s | 10.64M ops/s | -10.8% | 0.89x |
| expression-simple-eq | full-execution-true | 15.78M ops/s | 14.23M ops/s | -9.9% | 0.90x |
| expression-medium-or | partial-true | 11.65M ops/s | 10.83M ops/s | -7.0% | 0.93x |
| expression-deep-nested | complete-false | 10.90M ops/s | 10.28M ops/s | -5.8% | 0.94x |
| expression-reference-nested | full-execution-false | 6.29M ops/s | 5.95M ops/s | -5.4% | 0.95x |

