# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 82

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 66 |
| Slower (>-5%) | 7 |
| Unchanged | 9 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| in-n1224-r1-10x | full-execution-false | 86.42K ops/s | 9.99M ops/s | +11457.4% | 115.57x |
| in-n1224-r1-10x | complete-false | 87.35K ops/s | 9.67M ops/s | +10965.1% | 110.65x |
| in-n1224-r1-10x | full-execution-true | 92.43K ops/s | 9.91M ops/s | +10621.9% | 107.22x |
| in-n1224-r1-10x | partial-true | 93.53K ops/s | 9.81M ops/s | +10385.3% | 104.85x |
| in-n1224-r1-10x | complete-true | 94.04K ops/s | 9.75M ops/s | +10265.6% | 103.66x |
| in-n1224-r1-10x | empty-context | 82.84K ops/s | 8.21M ops/s | +9811.3% | 99.11x |
| in-n1224-r1-10x | partial-false | 88.88K ops/s | 8.30M ops/s | +9234.8% | 93.35x |
| in-n614-r1-5x | complete-false | 171.54K ops/s | 9.75M ops/s | +5585.7% | 56.86x |
| in-n614-r1-5x | complete-true | 172.33K ops/s | 9.74M ops/s | +5551.6% | 56.52x |
| in-n614-r1-5x | full-execution-false | 173.61K ops/s | 9.81M ops/s | +5548.1% | 56.48x |
| in-n614-r1-5x | full-execution-true | 187.61K ops/s | 9.97M ops/s | +5214.2% | 53.14x |
| in-n614-r1-5x | partial-true | 185.86K ops/s | 9.87M ops/s | +5210.3% | 53.10x |
| in-n614-r1-5x | partial-false | 183.24K ops/s | 8.40M ops/s | +4483.2% | 45.83x |
| in-n614-r1-5x | empty-context | 186.73K ops/s | 8.41M ops/s | +4404.0% | 45.04x |
| overlap-n447-r50-10x | partial-false | 288.87K ops/s | 9.16M ops/s | +3072.4% | 31.72x |
| overlap-n447-r50-10x | empty-context | 290.02K ops/s | 9.00M ops/s | +3002.7% | 31.03x |
| overlap-n447-r50-10x | complete-true | 287.62K ops/s | 8.04M ops/s | +2693.7% | 27.94x |
| overlap-n447-r50-10x | full-execution-true | 284.05K ops/s | 7.92M ops/s | +2688.1% | 27.88x |
| overlap-n447-r50-10x | partial-true | 284.60K ops/s | 7.74M ops/s | +2619.8% | 27.20x |
| overlap-n447-r50-10x | full-execution-false | 42.65K ops/s | 756.25K ops/s | +1673.3% | 17.73x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-simple-ne | empty-context | 8.62M ops/s | 7.76M ops/s | -10.0% | 0.90x |
| expression-simple-ne | partial-true | 8.44M ops/s | 7.62M ops/s | -9.8% | 0.90x |
| expression-simple-eq | partial-false | 8.54M ops/s | 7.83M ops/s | -8.3% | 0.92x |
| expression-simple-ne | full-execution-true | 8.64M ops/s | 7.93M ops/s | -8.3% | 0.92x |
| expression-simple-eq | empty-context | 8.44M ops/s | 7.89M ops/s | -6.5% | 0.93x |
| expression-medium-or | complete-true | 8.26M ops/s | 7.73M ops/s | -6.4% | 0.94x |
| expression-medium-or | partial-true | 8.21M ops/s | 7.71M ops/s | -6.1% | 0.94x |
| expression-medium-and | complete-false | 7.87M ops/s | 7.58M ops/s | -3.7% | 0.96x |
| expression-reference-nested | complete-false | 7.37M ops/s | 7.27M ops/s | -1.4% | 0.99x |
| expression-deep-nested | complete-false | 7.37M ops/s | 7.28M ops/s | -1.3% | 0.99x |
| expression-simple-ne | complete-true | 10.19M ops/s | 10.10M ops/s | -0.9% | 0.99x |
| expression-simple-eq | partial-true | 9.99M ops/s | 10.22M ops/s | +2.3% | 1.02x |
| expression-simple-eq | complete-true | 10.02M ops/s | 10.34M ops/s | +3.2% | 1.03x |
| expression-simple-eq | full-execution-true | 9.96M ops/s | 10.38M ops/s | +4.3% | 1.04x |
| expression-complex-nested | complete-false | 7.50M ops/s | 7.83M ops/s | +4.4% | 1.04x |
| expression-simple-eq | full-execution-false | 9.86M ops/s | 10.30M ops/s | +4.5% | 1.04x |
| expression-simple-eq | complete-false | 9.86M ops/s | 10.40M ops/s | +5.5% | 1.05x |
| expression-reference-nested | full-execution-false | 3.91M ops/s | 4.13M ops/s | +5.6% | 1.06x |
| expression-arithmetic | empty-context | 2.15M ops/s | 2.34M ops/s | +8.8% | 1.09x |
| expression-arithmetic | partial-false | 2.15M ops/s | 2.34M ops/s | +8.9% | 1.09x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-simple-ne | empty-context | 8.62M ops/s | 7.76M ops/s | -10.0% | 0.90x |
| expression-simple-ne | partial-true | 8.44M ops/s | 7.62M ops/s | -9.8% | 0.90x |
| expression-simple-eq | partial-false | 8.54M ops/s | 7.83M ops/s | -8.3% | 0.92x |
| expression-simple-ne | full-execution-true | 8.64M ops/s | 7.93M ops/s | -8.3% | 0.92x |
| expression-simple-eq | empty-context | 8.44M ops/s | 7.89M ops/s | -6.5% | 0.93x |
| expression-medium-or | complete-true | 8.26M ops/s | 7.73M ops/s | -6.4% | 0.94x |
| expression-medium-or | partial-true | 8.21M ops/s | 7.71M ops/s | -6.1% | 0.94x |

