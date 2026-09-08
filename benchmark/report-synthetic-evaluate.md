# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-oop.json`
**Improved:** `results-synthetic-evaluate-bytecode.json`
**Total cases compared:** 106

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 84 |
| Slower (>-5%) | 9 |
| Unchanged | 13 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n1026-r1000-10x | full-execution-true | 32.00K ops/s | 14.30M ops/s | +44587.8% | 446.88x |
| overlap-n1026-r1000-10x | complete-true | 32.72K ops/s | 14.50M ops/s | +44228.3% | 443.28x |
| overlap-n1026-r1000-10x | early-true | 31.73K ops/s | 13.97M ops/s | +43923.3% | 440.23x |
| overlap-n1026-r1000-10x | partial-true | 43.29K ops/s | 15.51M ops/s | +35717.1% | 358.17x |
| overlap-n526-r500-5x | complete-true | 67.90K ops/s | 14.44M ops/s | +21172.6% | 212.73x |
| overlap-n526-r500-5x | early-true | 68.32K ops/s | 14.40M ops/s | +20975.6% | 210.76x |
| overlap-n526-r500-5x | full-execution-true | 67.69K ops/s | 13.59M ops/s | +19982.0% | 200.82x |
| overlap-n526-r500-5x | partial-true | 91.98K ops/s | 14.73M ops/s | +15915.4% | 160.15x |
| in-n1224-r1-10x | late-true | 259.71K ops/s | 20.63M ops/s | +7843.7% | 79.44x |
| in-n1224-r1-10x | empty-context | 326.58K ops/s | 24.22M ops/s | +7316.9% | 74.17x |
| in-n1224-r1-10x | full-execution-false | 272.30K ops/s | 19.16M ops/s | +6937.6% | 70.38x |
| in-n1224-r1-10x | complete-false | 271.71K ops/s | 19.05M ops/s | +6911.8% | 70.12x |
| in-n1224-r1-10x | partial-false | 333.98K ops/s | 23.06M ops/s | +6804.6% | 69.05x |
| in-n1224-r1-10x | early-true | 333.83K ops/s | 18.88M ops/s | +5556.5% | 56.56x |
| in-n1224-r1-10x | full-execution-true | 336.29K ops/s | 18.84M ops/s | +5501.9% | 56.02x |
| in-n1224-r1-10x | partial-true | 334.77K ops/s | 17.57M ops/s | +5148.1% | 52.48x |
| in-n1224-r1-10x | complete-true | 335.47K ops/s | 17.48M ops/s | +5109.8% | 52.10x |
| in-n614-r1-5x | late-true | 496.47K ops/s | 20.75M ops/s | +4079.7% | 41.80x |
| in-n614-r1-5x | empty-context | 653.34K ops/s | 23.53M ops/s | +3501.8% | 36.02x |
| overlap-n447-r50-10x | early-true | 492.86K ops/s | 17.59M ops/s | +3468.6% | 35.69x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | complete-true | 20.23M ops/s | 16.21M ops/s | -19.9% | 0.80x |
| expression-medium-or | partial-true | 20.17M ops/s | 16.37M ops/s | -18.8% | 0.81x |
| expression-medium-or | early-true | 20.05M ops/s | 16.31M ops/s | -18.7% | 0.81x |
| expression-medium-or | empty-context | 10.76M ops/s | 8.91M ops/s | -17.3% | 0.83x |
| expression-medium-or | full-execution-true | 10.59M ops/s | 8.87M ops/s | -16.2% | 0.84x |
| expression-medium-or | late-true | 10.62M ops/s | 8.90M ops/s | -16.2% | 0.84x |
| expression-medium-or | partial-false | 9.96M ops/s | 8.39M ops/s | -15.8% | 0.84x |
| expression-medium-or | complete-false | 10.46M ops/s | 8.94M ops/s | -14.5% | 0.85x |
| expression-medium-or | full-execution-false | 10.23M ops/s | 8.79M ops/s | -14.1% | 0.86x |
| expression-reference-nested | empty-context | 15.23M ops/s | 15.05M ops/s | -1.2% | 0.99x |
| expression-reference-nested | partial-false | 14.79M ops/s | 14.65M ops/s | -0.9% | 0.99x |
| expression-complex-nested | empty-context | 15.72M ops/s | 15.58M ops/s | -0.9% | 0.99x |
| expression-deep-nested | full-execution-false | 4.22M ops/s | 4.21M ops/s | -0.3% | 1.00x |
| expression-deep-nested | partial-false | 14.57M ops/s | 14.59M ops/s | +0.1% | 1.00x |
| expression-complex-nested | partial-false | 15.33M ops/s | 15.42M ops/s | +0.5% | 1.01x |
| expression-medium-and | empty-context | 15.59M ops/s | 15.81M ops/s | +1.4% | 1.01x |
| expression-reference-nested | complete-false | 13.72M ops/s | 13.98M ops/s | +1.9% | 1.02x |
| expression-deep-nested | empty-context | 14.69M ops/s | 14.98M ops/s | +2.0% | 1.02x |
| expression-deep-nested | late-true | 4.14M ops/s | 4.22M ops/s | +2.0% | 1.02x |
| expression-medium-and | complete-false | 15.28M ops/s | 15.74M ops/s | +3.0% | 1.03x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | complete-true | 20.23M ops/s | 16.21M ops/s | -19.9% | 0.80x |
| expression-medium-or | partial-true | 20.17M ops/s | 16.37M ops/s | -18.8% | 0.81x |
| expression-medium-or | early-true | 20.05M ops/s | 16.31M ops/s | -18.7% | 0.81x |
| expression-medium-or | empty-context | 10.76M ops/s | 8.91M ops/s | -17.3% | 0.83x |
| expression-medium-or | full-execution-true | 10.59M ops/s | 8.87M ops/s | -16.2% | 0.84x |
| expression-medium-or | late-true | 10.62M ops/s | 8.90M ops/s | -16.2% | 0.84x |
| expression-medium-or | partial-false | 9.96M ops/s | 8.39M ops/s | -15.8% | 0.84x |
| expression-medium-or | complete-false | 10.46M ops/s | 8.94M ops/s | -14.5% | 0.85x |
| expression-medium-or | full-execution-false | 10.23M ops/s | 8.79M ops/s | -14.1% | 0.86x |

