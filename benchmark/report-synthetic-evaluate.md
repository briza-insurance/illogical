# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-oop.json`
**Improved:** `results-synthetic-evaluate-bytecode.json`
**Total cases compared:** 106

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 80 |
| Slower (>-5%) | 17 |
| Unchanged | 9 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n1026-r1000-10x | early-true | 33.57K ops/s | 13.64M ops/s | +40515.8% | 406.16x |
| overlap-n1026-r1000-10x | complete-true | 33.81K ops/s | 13.65M ops/s | +40271.4% | 403.71x |
| overlap-n1026-r1000-10x | full-execution-true | 33.80K ops/s | 13.24M ops/s | +39084.0% | 391.84x |
| overlap-n1026-r1000-10x | partial-true | 45.19K ops/s | 14.01M ops/s | +30888.1% | 309.88x |
| overlap-n526-r500-5x | full-execution-true | 69.02K ops/s | 13.45M ops/s | +19382.9% | 194.83x |
| overlap-n526-r500-5x | early-true | 68.75K ops/s | 13.30M ops/s | +19239.0% | 193.39x |
| overlap-n526-r500-5x | complete-true | 67.83K ops/s | 12.77M ops/s | +18726.5% | 188.26x |
| overlap-n526-r500-5x | partial-true | 93.86K ops/s | 13.64M ops/s | +14432.4% | 145.32x |
| in-n1224-r1-10x | late-true | 266.39K ops/s | 20.93M ops/s | +7755.2% | 78.55x |
| in-n1224-r1-10x | empty-context | 334.48K ops/s | 23.30M ops/s | +6864.8% | 69.65x |
| in-n1224-r1-10x | partial-false | 336.08K ops/s | 23.03M ops/s | +6751.9% | 68.52x |
| in-n1224-r1-10x | full-execution-false | 273.85K ops/s | 18.60M ops/s | +6691.9% | 67.92x |
| in-n1224-r1-10x | complete-false | 274.20K ops/s | 18.17M ops/s | +6527.9% | 66.28x |
| in-n1224-r1-10x | partial-true | 336.26K ops/s | 16.97M ops/s | +4946.4% | 50.46x |
| in-n1224-r1-10x | full-execution-true | 336.18K ops/s | 16.80M ops/s | +4898.5% | 49.98x |
| in-n1224-r1-10x | early-true | 336.18K ops/s | 16.80M ops/s | +4896.0% | 49.96x |
| in-n1224-r1-10x | complete-true | 335.36K ops/s | 16.61M ops/s | +4853.8% | 49.54x |
| in-n614-r1-5x | full-execution-false | 544.25K ops/s | 23.51M ops/s | +4220.4% | 43.20x |
| in-n614-r1-5x | complete-false | 546.50K ops/s | 23.45M ops/s | +4190.2% | 42.90x |
| in-n614-r1-5x | late-true | 516.48K ops/s | 21.23M ops/s | +4010.6% | 41.11x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | partial-true | 20.16M ops/s | 15.23M ops/s | -24.5% | 0.76x |
| expression-medium-or | early-true | 19.65M ops/s | 15.28M ops/s | -22.2% | 0.78x |
| expression-medium-or | complete-true | 19.32M ops/s | 15.17M ops/s | -21.5% | 0.79x |
| expression-medium-or | empty-context | 10.28M ops/s | 8.13M ops/s | -20.9% | 0.79x |
| expression-medium-or | partial-false | 9.70M ops/s | 7.80M ops/s | -19.6% | 0.80x |
| expression-medium-or | complete-false | 10.33M ops/s | 8.31M ops/s | -19.5% | 0.80x |
| expression-medium-or | full-execution-true | 10.42M ops/s | 8.45M ops/s | -18.9% | 0.81x |
| expression-medium-or | full-execution-false | 10.12M ops/s | 8.38M ops/s | -17.2% | 0.83x |
| expression-medium-or | late-true | 9.99M ops/s | 8.38M ops/s | -16.1% | 0.84x |
| expression-deep-nested | empty-context | 15.71M ops/s | 13.93M ops/s | -11.3% | 0.89x |
| expression-reference-nested | empty-context | 15.42M ops/s | 14.08M ops/s | -8.6% | 0.91x |
| expression-deep-nested | partial-false | 15.02M ops/s | 13.77M ops/s | -8.3% | 0.92x |
| expression-deep-nested | late-true | 4.49M ops/s | 4.14M ops/s | -7.8% | 0.92x |
| expression-reference-nested | partial-false | 14.79M ops/s | 13.64M ops/s | -7.8% | 0.92x |
| expression-reference-nested | complete-false | 13.77M ops/s | 12.91M ops/s | -6.3% | 0.94x |
| expression-deep-nested | full-execution-false | 4.42M ops/s | 4.14M ops/s | -6.3% | 0.94x |
| expression-deep-nested | complete-false | 13.77M ops/s | 12.97M ops/s | -5.8% | 0.94x |
| expression-date-arithmetic | empty-context | 15.69M ops/s | 15.01M ops/s | -4.4% | 0.96x |
| expression-medium-and | empty-context | 15.53M ops/s | 15.11M ops/s | -2.7% | 0.97x |
| expression-complex-nested | empty-context | 15.82M ops/s | 15.87M ops/s | +0.3% | 1.00x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | partial-true | 20.16M ops/s | 15.23M ops/s | -24.5% | 0.76x |
| expression-medium-or | early-true | 19.65M ops/s | 15.28M ops/s | -22.2% | 0.78x |
| expression-medium-or | complete-true | 19.32M ops/s | 15.17M ops/s | -21.5% | 0.79x |
| expression-medium-or | empty-context | 10.28M ops/s | 8.13M ops/s | -20.9% | 0.79x |
| expression-medium-or | partial-false | 9.70M ops/s | 7.80M ops/s | -19.6% | 0.80x |
| expression-medium-or | complete-false | 10.33M ops/s | 8.31M ops/s | -19.5% | 0.80x |
| expression-medium-or | full-execution-true | 10.42M ops/s | 8.45M ops/s | -18.9% | 0.81x |
| expression-medium-or | full-execution-false | 10.12M ops/s | 8.38M ops/s | -17.2% | 0.83x |
| expression-medium-or | late-true | 9.99M ops/s | 8.38M ops/s | -16.1% | 0.84x |
| expression-deep-nested | empty-context | 15.71M ops/s | 13.93M ops/s | -11.3% | 0.89x |
| expression-reference-nested | empty-context | 15.42M ops/s | 14.08M ops/s | -8.6% | 0.91x |
| expression-deep-nested | partial-false | 15.02M ops/s | 13.77M ops/s | -8.3% | 0.92x |
| expression-deep-nested | late-true | 4.49M ops/s | 4.14M ops/s | -7.8% | 0.92x |
| expression-reference-nested | partial-false | 14.79M ops/s | 13.64M ops/s | -7.8% | 0.92x |
| expression-reference-nested | complete-false | 13.77M ops/s | 12.91M ops/s | -6.3% | 0.94x |
| expression-deep-nested | full-execution-false | 4.42M ops/s | 4.14M ops/s | -6.3% | 0.94x |
| expression-deep-nested | complete-false | 13.77M ops/s | 12.97M ops/s | -5.8% | 0.94x |

