# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 87

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 53 |
| Slower (>-5%) | 28 |
| Unchanged | 6 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| in-n1224-r1-10x | complete-false | 102.90K ops/s | 8.21M ops/s | +7880.9% | 79.81x |
| in-n1224-r1-10x | full-execution-false | 102.84K ops/s | 8.11M ops/s | +7788.3% | 78.88x |
| in-n1224-r1-10x | partial-true | 108.70K ops/s | 8.16M ops/s | +7403.9% | 75.04x |
| in-n1224-r1-10x | complete-true | 108.77K ops/s | 8.15M ops/s | +7389.9% | 74.90x |
| in-n1224-r1-10x | full-execution-true | 111.08K ops/s | 8.21M ops/s | +7291.8% | 73.92x |
| in-n1224-r1-10x | empty-context | 112.70K ops/s | 7.30M ops/s | +6381.2% | 64.81x |
| in-n1224-r1-10x | partial-false | 111.94K ops/s | 7.20M ops/s | +6335.0% | 64.35x |
| in-n614-r1-5x | complete-false | 186.02K ops/s | 8.04M ops/s | +4223.2% | 43.23x |
| in-n614-r1-5x | complete-true | 197.14K ops/s | 8.10M ops/s | +4010.9% | 41.11x |
| in-n614-r1-5x | full-execution-false | 193.50K ops/s | 7.89M ops/s | +3977.2% | 40.77x |
| in-n614-r1-5x | full-execution-true | 209.85K ops/s | 8.21M ops/s | +3810.6% | 39.11x |
| in-n614-r1-5x | partial-true | 206.82K ops/s | 8.07M ops/s | +3801.2% | 39.01x |
| in-n614-r1-5x | partial-false | 200.20K ops/s | 7.45M ops/s | +3622.5% | 37.22x |
| in-n614-r1-5x | empty-context | 207.06K ops/s | 7.38M ops/s | +3462.7% | 35.63x |
| overlap-n447-r50-10x | partial-false | 323.83K ops/s | 8.13M ops/s | +2411.3% | 25.11x |
| overlap-n447-r50-10x | empty-context | 337.22K ops/s | 8.17M ops/s | +2322.4% | 24.22x |
| overlap-n447-r50-10x | full-execution-true | 329.34K ops/s | 7.91M ops/s | +2303.1% | 24.03x |
| overlap-n447-r50-10x | complete-true | 332.59K ops/s | 7.86M ops/s | +2263.6% | 23.64x |
| overlap-n447-r50-10x | partial-true | 329.53K ops/s | 7.08M ops/s | +2049.0% | 21.49x |
| overlap-n447-r50-10x | full-execution-false | 64.31K ops/s | 1.01M ops/s | +1470.1% | 15.70x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | complete-true | 9.54M ops/s | 6.36M ops/s | -33.4% | 0.67x |
| expression-medium-or | partial-true | 9.59M ops/s | 6.44M ops/s | -32.8% | 0.67x |
| expression-date-arithmetic | complete-false | 9.86M ops/s | 6.64M ops/s | -32.7% | 0.67x |
| expression-reference-nested | complete-false | 8.83M ops/s | 5.99M ops/s | -32.2% | 0.68x |
| expression-simple-eq | complete-true | 12.13M ops/s | 8.23M ops/s | -32.1% | 0.68x |
| expression-simple-ne | complete-true | 12.08M ops/s | 8.26M ops/s | -31.6% | 0.68x |
| expression-simple-eq | full-execution-false | 12.04M ops/s | 8.28M ops/s | -31.2% | 0.69x |
| expression-medium-and | complete-false | 9.68M ops/s | 6.70M ops/s | -30.8% | 0.69x |
| expression-simple-eq | partial-true | 12.07M ops/s | 8.36M ops/s | -30.8% | 0.69x |
| expression-complex-nested | complete-false | 9.36M ops/s | 6.48M ops/s | -30.8% | 0.69x |
| expression-deep-nested | complete-false | 8.88M ops/s | 6.16M ops/s | -30.6% | 0.69x |
| expression-simple-eq | full-execution-true | 11.86M ops/s | 8.36M ops/s | -29.5% | 0.70x |
| expression-simple-eq | complete-false | 11.72M ops/s | 8.34M ops/s | -28.8% | 0.71x |
| expression-simple-ne | full-execution-true | 9.47M ops/s | 7.13M ops/s | -24.7% | 0.75x |
| expression-simple-ne | partial-true | 9.27M ops/s | 7.05M ops/s | -23.9% | 0.76x |
| expression-simple-eq | empty-context | 9.28M ops/s | 7.08M ops/s | -23.7% | 0.76x |
| expression-simple-ne | empty-context | 9.29M ops/s | 7.11M ops/s | -23.5% | 0.77x |
| expression-reference-nested | full-execution-false | 4.88M ops/s | 3.76M ops/s | -22.9% | 0.77x |
| expression-simple-eq | partial-false | 9.06M ops/s | 7.10M ops/s | -21.6% | 0.78x |
| expression-medium-and | full-execution-false | 3.35M ops/s | 2.85M ops/s | -15.1% | 0.85x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | complete-true | 9.54M ops/s | 6.36M ops/s | -33.4% | 0.67x |
| expression-medium-or | partial-true | 9.59M ops/s | 6.44M ops/s | -32.8% | 0.67x |
| expression-date-arithmetic | complete-false | 9.86M ops/s | 6.64M ops/s | -32.7% | 0.67x |
| expression-reference-nested | complete-false | 8.83M ops/s | 5.99M ops/s | -32.2% | 0.68x |
| expression-simple-eq | complete-true | 12.13M ops/s | 8.23M ops/s | -32.1% | 0.68x |
| expression-simple-ne | complete-true | 12.08M ops/s | 8.26M ops/s | -31.6% | 0.68x |
| expression-simple-eq | full-execution-false | 12.04M ops/s | 8.28M ops/s | -31.2% | 0.69x |
| expression-medium-and | complete-false | 9.68M ops/s | 6.70M ops/s | -30.8% | 0.69x |
| expression-simple-eq | partial-true | 12.07M ops/s | 8.36M ops/s | -30.8% | 0.69x |
| expression-complex-nested | complete-false | 9.36M ops/s | 6.48M ops/s | -30.8% | 0.69x |
| expression-deep-nested | complete-false | 8.88M ops/s | 6.16M ops/s | -30.6% | 0.69x |
| expression-simple-eq | full-execution-true | 11.86M ops/s | 8.36M ops/s | -29.5% | 0.70x |
| expression-simple-eq | complete-false | 11.72M ops/s | 8.34M ops/s | -28.8% | 0.71x |
| expression-simple-ne | full-execution-true | 9.47M ops/s | 7.13M ops/s | -24.7% | 0.75x |
| expression-simple-ne | partial-true | 9.27M ops/s | 7.05M ops/s | -23.9% | 0.76x |
| expression-simple-eq | empty-context | 9.28M ops/s | 7.08M ops/s | -23.7% | 0.76x |
| expression-simple-ne | empty-context | 9.29M ops/s | 7.11M ops/s | -23.5% | 0.77x |
| expression-reference-nested | full-execution-false | 4.88M ops/s | 3.76M ops/s | -22.9% | 0.77x |
| expression-simple-eq | partial-false | 9.06M ops/s | 7.10M ops/s | -21.6% | 0.78x |
| expression-medium-and | full-execution-false | 3.35M ops/s | 2.85M ops/s | -15.1% | 0.85x |
| expression-medium-or | full-execution-true | 4.27M ops/s | 3.65M ops/s | -14.7% | 0.85x |
| expression-medium-or | complete-false | 4.19M ops/s | 3.64M ops/s | -13.0% | 0.87x |
| expression-deep-nested | full-execution-false | 2.34M ops/s | 2.04M ops/s | -12.7% | 0.87x |
| expression-arithmetic | partial-false | 2.40M ops/s | 2.15M ops/s | -10.5% | 0.90x |
| expression-arithmetic | full-execution-false | 2.43M ops/s | 2.20M ops/s | -9.7% | 0.90x |
| expression-reference-nested | partial-false | 2.40M ops/s | 2.19M ops/s | -9.0% | 0.91x |
| expression-arithmetic | empty-context | 2.42M ops/s | 2.22M ops/s | -8.3% | 0.92x |
| expression-reference-nested | empty-context | 2.44M ops/s | 2.25M ops/s | -7.9% | 0.92x |

