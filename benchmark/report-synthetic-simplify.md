# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 82

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 68 |
| Slower (>-5%) | 13 |
| Unchanged | 1 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| in-n1224-r1-10x | empty-context | 108.92K ops/s | 13.36M ops/s | +12162.7% | 122.63x |
| in-n1224-r1-10x | full-execution-false | 103.80K ops/s | 12.70M ops/s | +12132.6% | 122.33x |
| in-n1224-r1-10x | partial-false | 109.10K ops/s | 12.88M ops/s | +11703.6% | 118.04x |
| in-n1224-r1-10x | complete-false | 104.03K ops/s | 11.95M ops/s | +11385.2% | 114.85x |
| in-n1224-r1-10x | partial-true | 110.37K ops/s | 12.57M ops/s | +11289.5% | 113.90x |
| in-n1224-r1-10x | complete-true | 111.73K ops/s | 12.38M ops/s | +10982.7% | 110.83x |
| in-n1224-r1-10x | full-execution-true | 110.70K ops/s | 11.63M ops/s | +10406.6% | 105.07x |
| in-n614-r1-5x | full-execution-false | 189.84K ops/s | 12.46M ops/s | +6463.8% | 65.64x |
| in-n614-r1-5x | empty-context | 197.56K ops/s | 12.84M ops/s | +6398.7% | 64.99x |
| in-n614-r1-5x | partial-false | 213.49K ops/s | 13.85M ops/s | +6386.6% | 64.87x |
| in-n614-r1-5x | complete-false | 203.65K ops/s | 12.87M ops/s | +6218.2% | 63.18x |
| in-n614-r1-5x | full-execution-true | 208.39K ops/s | 11.85M ops/s | +5584.3% | 56.84x |
| in-n614-r1-5x | complete-true | 213.96K ops/s | 11.68M ops/s | +5357.2% | 54.57x |
| in-n614-r1-5x | partial-true | 214.92K ops/s | 11.42M ops/s | +5213.4% | 53.13x |
| overlap-n447-r50-10x | empty-context | 341.56K ops/s | 12.04M ops/s | +3426.0% | 35.26x |
| overlap-n447-r50-10x | partial-false | 353.42K ops/s | 12.23M ops/s | +3361.3% | 34.61x |
| overlap-n447-r50-10x | complete-true | 353.82K ops/s | 10.85M ops/s | +2967.7% | 30.68x |
| overlap-n447-r50-10x | partial-true | 350.22K ops/s | 10.53M ops/s | +2906.9% | 30.07x |
| overlap-n447-r50-10x | full-execution-true | 354.39K ops/s | 10.35M ops/s | +2820.5% | 29.21x |
| overlap-n252-r25-5x | partial-false | 582.87K ops/s | 11.89M ops/s | +1939.2% | 20.39x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-simple-ne | complete-true | 14.43M ops/s | 11.93M ops/s | -17.3% | 0.83x |
| expression-simple-eq | complete-true | 14.39M ops/s | 11.91M ops/s | -17.2% | 0.83x |
| expression-simple-eq | partial-true | 14.21M ops/s | 11.96M ops/s | -15.8% | 0.84x |
| expression-simple-eq | complete-false | 14.20M ops/s | 12.15M ops/s | -14.4% | 0.86x |
| expression-medium-or | partial-true | 11.00M ops/s | 9.43M ops/s | -14.3% | 0.86x |
| expression-medium-or | complete-true | 11.22M ops/s | 9.66M ops/s | -13.9% | 0.86x |
| expression-medium-and | complete-false | 10.49M ops/s | 9.17M ops/s | -12.5% | 0.87x |
| expression-simple-eq | full-execution-false | 13.36M ops/s | 11.69M ops/s | -12.5% | 0.88x |
| expression-complex-nested | complete-false | 10.30M ops/s | 9.35M ops/s | -9.2% | 0.91x |
| expression-deep-nested | complete-false | 10.01M ops/s | 9.10M ops/s | -9.1% | 0.91x |
| expression-reference-nested | complete-false | 9.98M ops/s | 9.22M ops/s | -7.5% | 0.92x |
| expression-simple-eq | full-execution-true | 13.06M ops/s | 12.15M ops/s | -7.0% | 0.93x |
| expression-reference-nested | full-execution-false | 5.87M ops/s | 5.49M ops/s | -6.4% | 0.94x |
| expression-medium-or | full-execution-false | 4.97M ops/s | 5.14M ops/s | +3.4% | 1.03x |
| expression-simple-eq | empty-context | 11.56M ops/s | 12.59M ops/s | +8.9% | 1.09x |
| expression-arithmetic | full-execution-false | 3.21M ops/s | 3.55M ops/s | +10.6% | 1.11x |
| expression-medium-and | full-execution-false | 3.95M ops/s | 4.41M ops/s | +11.6% | 1.12x |
| expression-simple-ne | partial-true | 11.81M ops/s | 13.25M ops/s | +12.1% | 1.12x |
| expression-simple-ne | full-execution-true | 11.85M ops/s | 13.32M ops/s | +12.4% | 1.12x |
| expression-simple-eq | partial-false | 11.81M ops/s | 13.36M ops/s | +13.1% | 1.13x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-simple-ne | complete-true | 14.43M ops/s | 11.93M ops/s | -17.3% | 0.83x |
| expression-simple-eq | complete-true | 14.39M ops/s | 11.91M ops/s | -17.2% | 0.83x |
| expression-simple-eq | partial-true | 14.21M ops/s | 11.96M ops/s | -15.8% | 0.84x |
| expression-simple-eq | complete-false | 14.20M ops/s | 12.15M ops/s | -14.4% | 0.86x |
| expression-medium-or | partial-true | 11.00M ops/s | 9.43M ops/s | -14.3% | 0.86x |
| expression-medium-or | complete-true | 11.22M ops/s | 9.66M ops/s | -13.9% | 0.86x |
| expression-medium-and | complete-false | 10.49M ops/s | 9.17M ops/s | -12.5% | 0.87x |
| expression-simple-eq | full-execution-false | 13.36M ops/s | 11.69M ops/s | -12.5% | 0.88x |
| expression-complex-nested | complete-false | 10.30M ops/s | 9.35M ops/s | -9.2% | 0.91x |
| expression-deep-nested | complete-false | 10.01M ops/s | 9.10M ops/s | -9.1% | 0.91x |
| expression-reference-nested | complete-false | 9.98M ops/s | 9.22M ops/s | -7.5% | 0.92x |
| expression-simple-eq | full-execution-true | 13.06M ops/s | 12.15M ops/s | -7.0% | 0.93x |
| expression-reference-nested | full-execution-false | 5.87M ops/s | 5.49M ops/s | -6.4% | 0.94x |

