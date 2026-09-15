# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 87

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 58 |
| Slower (>-5%) | 24 |
| Unchanged | 5 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| in-n1224-r1-10x | complete-false | 108.65K ops/s | 10.26M ops/s | +9340.1% | 94.40x |
| in-n1224-r1-10x | full-execution-false | 109.14K ops/s | 10.22M ops/s | +9260.8% | 93.61x |
| in-n1224-r1-10x | complete-true | 118.34K ops/s | 9.75M ops/s | +8140.4% | 82.40x |
| in-n1224-r1-10x | partial-true | 118.00K ops/s | 9.64M ops/s | +8068.3% | 81.68x |
| in-n1224-r1-10x | full-execution-true | 117.89K ops/s | 9.61M ops/s | +8052.0% | 81.52x |
| in-n1224-r1-10x | empty-context | 116.31K ops/s | 8.78M ops/s | +7445.1% | 75.45x |
| in-n1224-r1-10x | partial-false | 118.01K ops/s | 8.57M ops/s | +7163.4% | 72.63x |
| in-n614-r1-5x | complete-false | 200.08K ops/s | 10.14M ops/s | +4966.3% | 50.66x |
| in-n614-r1-5x | full-execution-false | 200.53K ops/s | 10.14M ops/s | +4954.9% | 50.55x |
| in-n614-r1-5x | partial-true | 218.50K ops/s | 9.91M ops/s | +4437.2% | 45.37x |
| in-n614-r1-5x | full-execution-true | 219.21K ops/s | 9.93M ops/s | +4429.6% | 45.30x |
| in-n614-r1-5x | complete-true | 219.22K ops/s | 9.83M ops/s | +4382.7% | 44.83x |
| in-n614-r1-5x | empty-context | 213.51K ops/s | 8.67M ops/s | +3958.9% | 40.59x |
| in-n614-r1-5x | partial-false | 217.64K ops/s | 8.51M ops/s | +3810.6% | 39.11x |
| overlap-n447-r50-10x | empty-context | 335.16K ops/s | 9.68M ops/s | +2788.3% | 28.88x |
| overlap-n447-r50-10x | partial-false | 336.45K ops/s | 9.68M ops/s | +2776.9% | 28.77x |
| overlap-n447-r50-10x | full-execution-true | 334.99K ops/s | 9.01M ops/s | +2588.1% | 26.88x |
| overlap-n447-r50-10x | complete-true | 337.96K ops/s | 9.00M ops/s | +2561.9% | 26.62x |
| overlap-n447-r50-10x | partial-true | 337.94K ops/s | 8.62M ops/s | +2449.3% | 25.49x |
| overlap-n447-r50-10x | full-execution-false | 64.87K ops/s | 1.16M ops/s | +1686.3% | 17.86x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | complete-true | 9.74M ops/s | 7.08M ops/s | -27.3% | 0.73x |
| expression-reference-nested | complete-false | 8.94M ops/s | 6.62M ops/s | -25.9% | 0.74x |
| expression-medium-or | partial-true | 9.36M ops/s | 7.05M ops/s | -24.6% | 0.75x |
| expression-medium-and | complete-false | 9.78M ops/s | 7.43M ops/s | -24.0% | 0.76x |
| expression-date-arithmetic | complete-false | 9.73M ops/s | 7.46M ops/s | -23.4% | 0.77x |
| expression-simple-eq | full-execution-false | 12.56M ops/s | 9.71M ops/s | -22.7% | 0.77x |
| expression-simple-ne | complete-true | 12.76M ops/s | 9.94M ops/s | -22.1% | 0.78x |
| expression-simple-eq | complete-false | 12.53M ops/s | 9.82M ops/s | -21.6% | 0.78x |
| expression-deep-nested | complete-false | 8.56M ops/s | 6.71M ops/s | -21.5% | 0.78x |
| expression-simple-eq | full-execution-true | 12.53M ops/s | 9.85M ops/s | -21.4% | 0.79x |
| expression-simple-eq | partial-true | 12.58M ops/s | 9.95M ops/s | -20.9% | 0.79x |
| expression-reference-nested | full-execution-false | 5.03M ops/s | 4.05M ops/s | -19.5% | 0.81x |
| expression-complex-nested | complete-false | 9.11M ops/s | 7.38M ops/s | -18.9% | 0.81x |
| expression-simple-eq | empty-context | 9.93M ops/s | 8.22M ops/s | -17.2% | 0.83x |
| expression-simple-eq | complete-true | 12.15M ops/s | 10.38M ops/s | -14.6% | 0.85x |
| expression-simple-eq | partial-false | 9.79M ops/s | 8.39M ops/s | -14.3% | 0.86x |
| expression-simple-ne | full-execution-true | 9.90M ops/s | 8.61M ops/s | -13.0% | 0.87x |
| expression-simple-ne | partial-true | 9.36M ops/s | 8.17M ops/s | -12.8% | 0.87x |
| expression-simple-ne | empty-context | 9.35M ops/s | 8.34M ops/s | -10.8% | 0.89x |
| expression-arithmetic | full-execution-false | 2.50M ops/s | 2.27M ops/s | -9.3% | 0.91x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | complete-true | 9.74M ops/s | 7.08M ops/s | -27.3% | 0.73x |
| expression-reference-nested | complete-false | 8.94M ops/s | 6.62M ops/s | -25.9% | 0.74x |
| expression-medium-or | partial-true | 9.36M ops/s | 7.05M ops/s | -24.6% | 0.75x |
| expression-medium-and | complete-false | 9.78M ops/s | 7.43M ops/s | -24.0% | 0.76x |
| expression-date-arithmetic | complete-false | 9.73M ops/s | 7.46M ops/s | -23.4% | 0.77x |
| expression-simple-eq | full-execution-false | 12.56M ops/s | 9.71M ops/s | -22.7% | 0.77x |
| expression-simple-ne | complete-true | 12.76M ops/s | 9.94M ops/s | -22.1% | 0.78x |
| expression-simple-eq | complete-false | 12.53M ops/s | 9.82M ops/s | -21.6% | 0.78x |
| expression-deep-nested | complete-false | 8.56M ops/s | 6.71M ops/s | -21.5% | 0.78x |
| expression-simple-eq | full-execution-true | 12.53M ops/s | 9.85M ops/s | -21.4% | 0.79x |
| expression-simple-eq | partial-true | 12.58M ops/s | 9.95M ops/s | -20.9% | 0.79x |
| expression-reference-nested | full-execution-false | 5.03M ops/s | 4.05M ops/s | -19.5% | 0.81x |
| expression-complex-nested | complete-false | 9.11M ops/s | 7.38M ops/s | -18.9% | 0.81x |
| expression-simple-eq | empty-context | 9.93M ops/s | 8.22M ops/s | -17.2% | 0.83x |
| expression-simple-eq | complete-true | 12.15M ops/s | 10.38M ops/s | -14.6% | 0.85x |
| expression-simple-eq | partial-false | 9.79M ops/s | 8.39M ops/s | -14.3% | 0.86x |
| expression-simple-ne | full-execution-true | 9.90M ops/s | 8.61M ops/s | -13.0% | 0.87x |
| expression-simple-ne | partial-true | 9.36M ops/s | 8.17M ops/s | -12.8% | 0.87x |
| expression-simple-ne | empty-context | 9.35M ops/s | 8.34M ops/s | -10.8% | 0.89x |
| expression-arithmetic | full-execution-false | 2.50M ops/s | 2.27M ops/s | -9.3% | 0.91x |
| expression-deep-nested | full-execution-false | 2.35M ops/s | 2.16M ops/s | -7.8% | 0.92x |
| expression-medium-or | full-execution-false | 4.29M ops/s | 3.98M ops/s | -7.3% | 0.93x |
| expression-medium-or | complete-false | 4.22M ops/s | 3.97M ops/s | -5.9% | 0.94x |
| expression-reference-nested | partial-false | 2.46M ops/s | 2.33M ops/s | -5.3% | 0.95x |

