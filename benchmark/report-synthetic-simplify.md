# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 82

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 67 |
| Slower (>-5%) | 6 |
| Unchanged | 9 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| in-n1224-r1-10x | full-execution-false | 87.49K ops/s | 9.66M ops/s | +10942.5% | 110.43x |
| in-n1224-r1-10x | complete-false | 86.09K ops/s | 9.49M ops/s | +10925.3% | 110.25x |
| in-n1224-r1-10x | full-execution-true | 93.72K ops/s | 9.05M ops/s | +9554.5% | 96.54x |
| in-n1224-r1-10x | complete-true | 94.28K ops/s | 9.09M ops/s | +9540.5% | 96.40x |
| in-n1224-r1-10x | partial-true | 94.21K ops/s | 9.03M ops/s | +9489.2% | 95.89x |
| in-n1224-r1-10x | partial-false | 91.49K ops/s | 8.51M ops/s | +9198.4% | 92.98x |
| in-n1224-r1-10x | empty-context | 92.60K ops/s | 8.46M ops/s | +9040.2% | 91.40x |
| in-n614-r1-5x | full-execution-false | 172.59K ops/s | 9.64M ops/s | +5482.9% | 55.83x |
| in-n614-r1-5x | complete-false | 174.82K ops/s | 9.63M ops/s | +5409.3% | 55.09x |
| in-n614-r1-5x | partial-true | 187.26K ops/s | 9.64M ops/s | +5047.1% | 51.47x |
| in-n614-r1-5x | full-execution-true | 187.45K ops/s | 9.58M ops/s | +5008.5% | 51.09x |
| in-n614-r1-5x | complete-true | 189.25K ops/s | 9.61M ops/s | +4978.0% | 50.78x |
| in-n614-r1-5x | empty-context | 169.94K ops/s | 8.37M ops/s | +4826.0% | 49.26x |
| in-n614-r1-5x | partial-false | 187.66K ops/s | 8.40M ops/s | +4376.5% | 44.77x |
| overlap-n447-r50-10x | empty-context | 290.31K ops/s | 9.09M ops/s | +3032.9% | 31.33x |
| overlap-n447-r50-10x | partial-false | 290.87K ops/s | 9.10M ops/s | +3028.5% | 31.29x |
| overlap-n447-r50-10x | complete-true | 285.62K ops/s | 7.98M ops/s | +2693.4% | 27.93x |
| overlap-n447-r50-10x | full-execution-true | 287.12K ops/s | 7.95M ops/s | +2669.4% | 27.69x |
| overlap-n447-r50-10x | partial-true | 286.66K ops/s | 7.26M ops/s | +2432.2% | 25.32x |
| overlap-n447-r50-10x | complete-false | 45.58K ops/s | 838.82K ops/s | +1740.1% | 18.40x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | partial-true | 8.18M ops/s | 7.60M ops/s | -7.1% | 0.93x |
| expression-simple-eq | empty-context | 8.42M ops/s | 7.83M ops/s | -7.0% | 0.93x |
| expression-simple-ne | full-execution-true | 8.60M ops/s | 8.00M ops/s | -7.0% | 0.93x |
| expression-simple-ne | empty-context | 8.41M ops/s | 7.86M ops/s | -6.5% | 0.93x |
| expression-simple-ne | partial-true | 8.40M ops/s | 7.95M ops/s | -5.3% | 0.95x |
| expression-medium-or | complete-true | 8.13M ops/s | 7.70M ops/s | -5.3% | 0.95x |
| expression-simple-eq | partial-false | 8.29M ops/s | 7.91M ops/s | -4.6% | 0.95x |
| expression-simple-ne | complete-true | 10.17M ops/s | 10.17M ops/s | -0.0% | 1.00x |
| expression-medium-and | complete-false | 7.79M ops/s | 7.82M ops/s | +0.4% | 1.00x |
| expression-deep-nested | complete-false | 7.20M ops/s | 7.27M ops/s | +1.1% | 1.01x |
| expression-simple-eq | partial-true | 9.92M ops/s | 10.15M ops/s | +2.3% | 1.02x |
| expression-complex-nested | complete-false | 7.43M ops/s | 7.68M ops/s | +3.5% | 1.03x |
| expression-simple-eq | full-execution-true | 9.88M ops/s | 10.28M ops/s | +4.0% | 1.04x |
| expression-simple-eq | complete-true | 9.92M ops/s | 10.32M ops/s | +4.1% | 1.04x |
| expression-simple-eq | complete-false | 9.81M ops/s | 10.30M ops/s | +5.0% | 1.05x |
| expression-simple-eq | full-execution-false | 9.82M ops/s | 10.32M ops/s | +5.2% | 1.05x |
| expression-reference-nested | full-execution-false | 3.86M ops/s | 4.07M ops/s | +5.3% | 1.05x |
| expression-reference-nested | complete-false | 6.88M ops/s | 7.24M ops/s | +5.3% | 1.05x |
| expression-arithmetic | full-execution-false | 2.18M ops/s | 2.38M ops/s | +9.0% | 1.09x |
| expression-arithmetic | empty-context | 2.13M ops/s | 2.37M ops/s | +11.0% | 1.11x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | partial-true | 8.18M ops/s | 7.60M ops/s | -7.1% | 0.93x |
| expression-simple-eq | empty-context | 8.42M ops/s | 7.83M ops/s | -7.0% | 0.93x |
| expression-simple-ne | full-execution-true | 8.60M ops/s | 8.00M ops/s | -7.0% | 0.93x |
| expression-simple-ne | empty-context | 8.41M ops/s | 7.86M ops/s | -6.5% | 0.93x |
| expression-simple-ne | partial-true | 8.40M ops/s | 7.95M ops/s | -5.3% | 0.95x |
| expression-medium-or | complete-true | 8.13M ops/s | 7.70M ops/s | -5.3% | 0.95x |

