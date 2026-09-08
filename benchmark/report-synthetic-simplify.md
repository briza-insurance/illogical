# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 87

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 55 |
| Slower (>-5%) | 26 |
| Unchanged | 6 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| in-n1224-r1-10x | complete-false | 101.55K ops/s | 9.64M ops/s | +9397.6% | 94.98x |
| in-n1224-r1-10x | full-execution-false | 101.04K ops/s | 9.53M ops/s | +9328.2% | 94.28x |
| in-n1224-r1-10x | partial-true | 108.98K ops/s | 9.52M ops/s | +8637.2% | 87.37x |
| in-n1224-r1-10x | complete-true | 110.08K ops/s | 9.56M ops/s | +8583.9% | 86.84x |
| in-n1224-r1-10x | full-execution-true | 108.96K ops/s | 9.45M ops/s | +8574.8% | 86.75x |
| in-n1224-r1-10x | partial-false | 107.96K ops/s | 8.57M ops/s | +7842.3% | 79.42x |
| in-n1224-r1-10x | empty-context | 109.65K ops/s | 8.54M ops/s | +7689.8% | 77.90x |
| in-n614-r1-5x | complete-false | 189.90K ops/s | 9.69M ops/s | +5003.7% | 51.04x |
| in-n614-r1-5x | full-execution-false | 193.13K ops/s | 9.63M ops/s | +4886.2% | 49.86x |
| in-n614-r1-5x | complete-true | 204.51K ops/s | 9.68M ops/s | +4631.8% | 47.32x |
| in-n614-r1-5x | partial-true | 203.51K ops/s | 9.63M ops/s | +4629.4% | 47.29x |
| in-n614-r1-5x | full-execution-true | 205.14K ops/s | 9.61M ops/s | +4583.4% | 46.83x |
| in-n614-r1-5x | partial-false | 205.75K ops/s | 8.51M ops/s | +4034.2% | 41.34x |
| in-n614-r1-5x | empty-context | 209.76K ops/s | 8.57M ops/s | +3985.8% | 40.86x |
| overlap-n447-r50-10x | empty-context | 327.05K ops/s | 9.25M ops/s | +2726.9% | 28.27x |
| overlap-n447-r50-10x | partial-false | 326.75K ops/s | 9.12M ops/s | +2691.3% | 27.91x |
| overlap-n447-r50-10x | full-execution-true | 323.45K ops/s | 8.56M ops/s | +2547.8% | 26.48x |
| overlap-n447-r50-10x | complete-true | 328.36K ops/s | 8.65M ops/s | +2533.3% | 26.33x |
| overlap-n447-r50-10x | partial-true | 319.54K ops/s | 8.08M ops/s | +2429.5% | 25.29x |
| overlap-n447-r50-10x | complete-false | 65.71K ops/s | 1.12M ops/s | +1598.4% | 16.98x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | complete-true | 10.24M ops/s | 7.21M ops/s | -29.6% | 0.70x |
| expression-medium-or | partial-true | 10.15M ops/s | 7.14M ops/s | -29.6% | 0.70x |
| expression-date-arithmetic | complete-false | 9.91M ops/s | 7.38M ops/s | -25.6% | 0.74x |
| expression-medium-and | complete-false | 9.84M ops/s | 7.38M ops/s | -25.1% | 0.75x |
| expression-simple-eq | partial-true | 12.86M ops/s | 9.72M ops/s | -24.5% | 0.76x |
| expression-simple-eq | complete-true | 12.97M ops/s | 9.82M ops/s | -24.3% | 0.76x |
| expression-reference-nested | complete-false | 8.90M ops/s | 6.79M ops/s | -23.7% | 0.76x |
| expression-simple-ne | complete-true | 12.69M ops/s | 9.68M ops/s | -23.7% | 0.76x |
| expression-simple-eq | full-execution-false | 12.55M ops/s | 9.64M ops/s | -23.2% | 0.77x |
| expression-simple-eq | complete-false | 12.70M ops/s | 9.76M ops/s | -23.2% | 0.77x |
| expression-deep-nested | complete-false | 8.88M ops/s | 6.85M ops/s | -22.9% | 0.77x |
| expression-simple-eq | full-execution-true | 12.59M ops/s | 9.75M ops/s | -22.5% | 0.77x |
| expression-complex-nested | complete-false | 9.38M ops/s | 7.35M ops/s | -21.7% | 0.78x |
| expression-simple-ne | empty-context | 9.75M ops/s | 7.97M ops/s | -18.2% | 0.82x |
| expression-reference-nested | full-execution-false | 4.98M ops/s | 4.09M ops/s | -17.9% | 0.82x |
| expression-simple-eq | partial-false | 9.76M ops/s | 8.03M ops/s | -17.7% | 0.82x |
| expression-simple-eq | empty-context | 9.78M ops/s | 8.08M ops/s | -17.4% | 0.83x |
| expression-simple-ne | full-execution-true | 9.98M ops/s | 8.28M ops/s | -17.0% | 0.83x |
| expression-simple-ne | partial-true | 9.58M ops/s | 8.02M ops/s | -16.3% | 0.84x |
| expression-medium-or | full-execution-true | 4.46M ops/s | 3.98M ops/s | -10.7% | 0.89x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | complete-true | 10.24M ops/s | 7.21M ops/s | -29.6% | 0.70x |
| expression-medium-or | partial-true | 10.15M ops/s | 7.14M ops/s | -29.6% | 0.70x |
| expression-date-arithmetic | complete-false | 9.91M ops/s | 7.38M ops/s | -25.6% | 0.74x |
| expression-medium-and | complete-false | 9.84M ops/s | 7.38M ops/s | -25.1% | 0.75x |
| expression-simple-eq | partial-true | 12.86M ops/s | 9.72M ops/s | -24.5% | 0.76x |
| expression-simple-eq | complete-true | 12.97M ops/s | 9.82M ops/s | -24.3% | 0.76x |
| expression-reference-nested | complete-false | 8.90M ops/s | 6.79M ops/s | -23.7% | 0.76x |
| expression-simple-ne | complete-true | 12.69M ops/s | 9.68M ops/s | -23.7% | 0.76x |
| expression-simple-eq | full-execution-false | 12.55M ops/s | 9.64M ops/s | -23.2% | 0.77x |
| expression-simple-eq | complete-false | 12.70M ops/s | 9.76M ops/s | -23.2% | 0.77x |
| expression-deep-nested | complete-false | 8.88M ops/s | 6.85M ops/s | -22.9% | 0.77x |
| expression-simple-eq | full-execution-true | 12.59M ops/s | 9.75M ops/s | -22.5% | 0.77x |
| expression-complex-nested | complete-false | 9.38M ops/s | 7.35M ops/s | -21.7% | 0.78x |
| expression-simple-ne | empty-context | 9.75M ops/s | 7.97M ops/s | -18.2% | 0.82x |
| expression-reference-nested | full-execution-false | 4.98M ops/s | 4.09M ops/s | -17.9% | 0.82x |
| expression-simple-eq | partial-false | 9.76M ops/s | 8.03M ops/s | -17.7% | 0.82x |
| expression-simple-eq | empty-context | 9.78M ops/s | 8.08M ops/s | -17.4% | 0.83x |
| expression-simple-ne | full-execution-true | 9.98M ops/s | 8.28M ops/s | -17.0% | 0.83x |
| expression-simple-ne | partial-true | 9.58M ops/s | 8.02M ops/s | -16.3% | 0.84x |
| expression-medium-or | full-execution-true | 4.46M ops/s | 3.98M ops/s | -10.7% | 0.89x |
| expression-medium-or | full-execution-false | 4.45M ops/s | 3.99M ops/s | -10.4% | 0.90x |
| expression-medium-or | complete-false | 4.43M ops/s | 3.99M ops/s | -9.9% | 0.90x |
| expression-deep-nested | full-execution-false | 2.40M ops/s | 2.17M ops/s | -9.3% | 0.91x |
| expression-medium-and | full-execution-false | 3.43M ops/s | 3.14M ops/s | -8.5% | 0.92x |
| expression-arithmetic | full-execution-false | 2.47M ops/s | 2.27M ops/s | -7.9% | 0.92x |
| expression-arithmetic | empty-context | 2.43M ops/s | 2.26M ops/s | -7.2% | 0.93x |

