# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-oop.json`
**Improved:** `results-synthetic-evaluate-bytecode.json`
**Total cases compared:** 106

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 86 |
| Slower (>-5%) | 13 |
| Unchanged | 7 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n1026-r1000-10x | complete-true | 27.60K ops/s | 14.62M ops/s | +52863.5% | 529.64x |
| overlap-n1026-r1000-10x | full-execution-true | 27.49K ops/s | 14.39M ops/s | +52236.7% | 523.37x |
| overlap-n1026-r1000-10x | early-true | 27.59K ops/s | 14.12M ops/s | +51080.0% | 511.80x |
| overlap-n1026-r1000-10x | partial-true | 36.60K ops/s | 15.63M ops/s | +42613.8% | 427.14x |
| overlap-n526-r500-5x | complete-true | 67.12K ops/s | 14.75M ops/s | +21868.7% | 219.69x |
| overlap-n526-r500-5x | full-execution-true | 66.11K ops/s | 14.41M ops/s | +21696.9% | 217.97x |
| overlap-n526-r500-5x | early-true | 65.83K ops/s | 14.22M ops/s | +21505.6% | 216.06x |
| overlap-n526-r500-5x | partial-true | 91.41K ops/s | 14.94M ops/s | +16248.0% | 163.48x |
| in-n1224-r1-10x | late-true | 265.06K ops/s | 21.01M ops/s | +7827.1% | 79.27x |
| in-n1224-r1-10x | empty-context | 333.52K ops/s | 25.08M ops/s | +7420.9% | 75.21x |
| in-n1224-r1-10x | full-execution-false | 272.66K ops/s | 20.06M ops/s | +7257.0% | 73.57x |
| in-n1224-r1-10x | complete-false | 272.34K ops/s | 19.94M ops/s | +7221.5% | 73.22x |
| in-n1224-r1-10x | partial-false | 333.94K ops/s | 24.25M ops/s | +7160.3% | 72.60x |
| in-n1224-r1-10x | complete-true | 333.07K ops/s | 21.51M ops/s | +6357.6% | 64.58x |
| in-n1224-r1-10x | full-execution-true | 334.53K ops/s | 21.50M ops/s | +6326.8% | 64.27x |
| in-n1224-r1-10x | early-true | 334.27K ops/s | 21.43M ops/s | +6311.4% | 64.11x |
| in-n1224-r1-10x | partial-true | 332.77K ops/s | 20.94M ops/s | +6192.2% | 62.92x |
| in-n614-r1-5x | late-true | 506.89K ops/s | 21.14M ops/s | +4070.8% | 41.71x |
| in-n614-r1-5x | full-execution-false | 534.39K ops/s | 20.80M ops/s | +3791.7% | 38.92x |
| in-n614-r1-5x | complete-false | 534.30K ops/s | 20.54M ops/s | +3744.3% | 38.44x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | empty-context | 10.99M ops/s | 8.61M ops/s | -21.7% | 0.78x |
| expression-medium-or | late-true | 10.85M ops/s | 8.70M ops/s | -19.8% | 0.80x |
| expression-medium-or | full-execution-true | 10.74M ops/s | 8.73M ops/s | -18.8% | 0.81x |
| expression-medium-or | partial-true | 19.78M ops/s | 16.27M ops/s | -17.7% | 0.82x |
| expression-medium-or | complete-false | 10.67M ops/s | 8.78M ops/s | -17.7% | 0.82x |
| expression-medium-or | complete-true | 19.86M ops/s | 16.42M ops/s | -17.4% | 0.83x |
| expression-medium-or | partial-false | 9.76M ops/s | 8.11M ops/s | -16.9% | 0.83x |
| expression-medium-or | full-execution-false | 10.56M ops/s | 8.86M ops/s | -16.1% | 0.84x |
| expression-medium-or | early-true | 19.53M ops/s | 16.39M ops/s | -16.1% | 0.84x |
| expression-reference-nested | partial-false | 15.36M ops/s | 13.46M ops/s | -12.3% | 0.88x |
| expression-reference-nested | empty-context | 15.55M ops/s | 14.18M ops/s | -8.8% | 0.91x |
| expression-reference-nested | complete-false | 13.98M ops/s | 13.08M ops/s | -6.4% | 0.94x |
| expression-deep-nested | empty-context | 15.26M ops/s | 14.39M ops/s | -5.7% | 0.94x |
| expression-deep-nested | late-true | 4.52M ops/s | 4.30M ops/s | -4.9% | 0.95x |
| expression-deep-nested | full-execution-false | 4.46M ops/s | 4.24M ops/s | -4.9% | 0.95x |
| expression-deep-nested | partial-false | 14.69M ops/s | 14.98M ops/s | +1.9% | 1.02x |
| expression-medium-and | complete-false | 15.95M ops/s | 16.48M ops/s | +3.3% | 1.03x |
| expression-medium-and | empty-context | 15.66M ops/s | 16.21M ops/s | +3.5% | 1.04x |
| expression-reference-nested | full-execution-false | 7.67M ops/s | 7.99M ops/s | +4.2% | 1.04x |
| expression-medium-and | partial-false | 15.12M ops/s | 15.86M ops/s | +4.9% | 1.05x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | empty-context | 10.99M ops/s | 8.61M ops/s | -21.7% | 0.78x |
| expression-medium-or | late-true | 10.85M ops/s | 8.70M ops/s | -19.8% | 0.80x |
| expression-medium-or | full-execution-true | 10.74M ops/s | 8.73M ops/s | -18.8% | 0.81x |
| expression-medium-or | partial-true | 19.78M ops/s | 16.27M ops/s | -17.7% | 0.82x |
| expression-medium-or | complete-false | 10.67M ops/s | 8.78M ops/s | -17.7% | 0.82x |
| expression-medium-or | complete-true | 19.86M ops/s | 16.42M ops/s | -17.4% | 0.83x |
| expression-medium-or | partial-false | 9.76M ops/s | 8.11M ops/s | -16.9% | 0.83x |
| expression-medium-or | full-execution-false | 10.56M ops/s | 8.86M ops/s | -16.1% | 0.84x |
| expression-medium-or | early-true | 19.53M ops/s | 16.39M ops/s | -16.1% | 0.84x |
| expression-reference-nested | partial-false | 15.36M ops/s | 13.46M ops/s | -12.3% | 0.88x |
| expression-reference-nested | empty-context | 15.55M ops/s | 14.18M ops/s | -8.8% | 0.91x |
| expression-reference-nested | complete-false | 13.98M ops/s | 13.08M ops/s | -6.4% | 0.94x |
| expression-deep-nested | empty-context | 15.26M ops/s | 14.39M ops/s | -5.7% | 0.94x |

