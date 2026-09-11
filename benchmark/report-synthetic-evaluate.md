# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-oop.json`
**Improved:** `results-synthetic-evaluate-bytecode.json`
**Total cases compared:** 106

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 82 |
| Slower (>-5%) | 17 |
| Unchanged | 7 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n1026-r1000-10x | early-true | 28.41K ops/s | 14.09M ops/s | +49484.7% | 495.85x |
| overlap-n1026-r1000-10x | complete-true | 28.40K ops/s | 13.81M ops/s | +48536.9% | 486.37x |
| overlap-n1026-r1000-10x | full-execution-true | 28.49K ops/s | 13.78M ops/s | +48258.7% | 483.59x |
| overlap-n1026-r1000-10x | partial-true | 38.37K ops/s | 15.07M ops/s | +39162.9% | 392.63x |
| overlap-n526-r500-5x | full-execution-true | 65.72K ops/s | 14.70M ops/s | +22268.0% | 223.68x |
| overlap-n526-r500-5x | complete-true | 66.39K ops/s | 14.55M ops/s | +21808.1% | 219.08x |
| overlap-n526-r500-5x | early-true | 65.68K ops/s | 14.33M ops/s | +21712.8% | 218.13x |
| overlap-n526-r500-5x | partial-true | 92.63K ops/s | 15.05M ops/s | +16142.8% | 162.43x |
| in-n1224-r1-10x | late-true | 267.24K ops/s | 20.05M ops/s | +7403.8% | 75.04x |
| in-n1224-r1-10x | full-execution-false | 274.08K ops/s | 19.15M ops/s | +6887.3% | 69.87x |
| in-n1224-r1-10x | partial-false | 334.38K ops/s | 23.31M ops/s | +6872.2% | 69.72x |
| in-n1224-r1-10x | complete-false | 267.97K ops/s | 18.37M ops/s | +6754.4% | 68.54x |
| in-n1224-r1-10x | empty-context | 332.87K ops/s | 20.84M ops/s | +6161.2% | 62.61x |
| in-n1224-r1-10x | partial-true | 330.28K ops/s | 18.25M ops/s | +5426.3% | 55.26x |
| in-n1224-r1-10x | early-true | 337.55K ops/s | 18.50M ops/s | +5379.3% | 54.79x |
| in-n1224-r1-10x | complete-true | 336.72K ops/s | 18.40M ops/s | +5365.2% | 54.65x |
| in-n1224-r1-10x | full-execution-true | 337.26K ops/s | 18.43M ops/s | +5364.5% | 54.64x |
| in-n614-r1-5x | late-true | 508.19K ops/s | 20.35M ops/s | +3903.6% | 40.04x |
| overlap-n447-r50-10x | complete-true | 498.81K ops/s | 18.22M ops/s | +3552.4% | 36.52x |
| overlap-n447-r50-10x | partial-true | 494.63K ops/s | 17.53M ops/s | +3444.1% | 35.44x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | complete-true | 20.44M ops/s | 15.68M ops/s | -23.3% | 0.77x |
| expression-medium-or | partial-true | 20.31M ops/s | 15.84M ops/s | -22.0% | 0.78x |
| expression-medium-or | early-true | 20.37M ops/s | 16.09M ops/s | -21.0% | 0.79x |
| expression-medium-or | partial-false | 9.90M ops/s | 8.27M ops/s | -16.4% | 0.84x |
| expression-medium-or | full-execution-true | 10.51M ops/s | 8.78M ops/s | -16.4% | 0.84x |
| expression-medium-or | late-true | 10.39M ops/s | 8.76M ops/s | -15.6% | 0.84x |
| expression-medium-or | empty-context | 10.45M ops/s | 8.83M ops/s | -15.6% | 0.84x |
| expression-medium-or | complete-false | 10.33M ops/s | 8.79M ops/s | -15.0% | 0.85x |
| expression-medium-or | full-execution-false | 10.21M ops/s | 8.88M ops/s | -13.0% | 0.87x |
| expression-reference-nested | partial-false | 15.25M ops/s | 13.51M ops/s | -11.4% | 0.89x |
| expression-deep-nested | partial-false | 15.17M ops/s | 13.45M ops/s | -11.3% | 0.89x |
| expression-reference-nested | complete-false | 13.82M ops/s | 12.76M ops/s | -7.7% | 0.92x |
| expression-reference-nested | empty-context | 14.85M ops/s | 13.77M ops/s | -7.3% | 0.93x |
| expression-deep-nested | empty-context | 14.82M ops/s | 13.81M ops/s | -6.8% | 0.93x |
| expression-deep-nested | late-true | 4.39M ops/s | 4.09M ops/s | -6.8% | 0.93x |
| expression-deep-nested | complete-false | 13.76M ops/s | 12.84M ops/s | -6.7% | 0.93x |
| expression-deep-nested | full-execution-false | 4.37M ops/s | 4.12M ops/s | -5.7% | 0.94x |
| expression-complex-nested | complete-false | 15.58M ops/s | 15.39M ops/s | -1.2% | 0.99x |
| expression-date-arithmetic | complete-false | 15.87M ops/s | 15.77M ops/s | -0.6% | 0.99x |
| expression-complex-nested | partial-false | 15.19M ops/s | 15.40M ops/s | +1.4% | 1.01x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | complete-true | 20.44M ops/s | 15.68M ops/s | -23.3% | 0.77x |
| expression-medium-or | partial-true | 20.31M ops/s | 15.84M ops/s | -22.0% | 0.78x |
| expression-medium-or | early-true | 20.37M ops/s | 16.09M ops/s | -21.0% | 0.79x |
| expression-medium-or | partial-false | 9.90M ops/s | 8.27M ops/s | -16.4% | 0.84x |
| expression-medium-or | full-execution-true | 10.51M ops/s | 8.78M ops/s | -16.4% | 0.84x |
| expression-medium-or | late-true | 10.39M ops/s | 8.76M ops/s | -15.6% | 0.84x |
| expression-medium-or | empty-context | 10.45M ops/s | 8.83M ops/s | -15.6% | 0.84x |
| expression-medium-or | complete-false | 10.33M ops/s | 8.79M ops/s | -15.0% | 0.85x |
| expression-medium-or | full-execution-false | 10.21M ops/s | 8.88M ops/s | -13.0% | 0.87x |
| expression-reference-nested | partial-false | 15.25M ops/s | 13.51M ops/s | -11.4% | 0.89x |
| expression-deep-nested | partial-false | 15.17M ops/s | 13.45M ops/s | -11.3% | 0.89x |
| expression-reference-nested | complete-false | 13.82M ops/s | 12.76M ops/s | -7.7% | 0.92x |
| expression-reference-nested | empty-context | 14.85M ops/s | 13.77M ops/s | -7.3% | 0.93x |
| expression-deep-nested | empty-context | 14.82M ops/s | 13.81M ops/s | -6.8% | 0.93x |
| expression-deep-nested | late-true | 4.39M ops/s | 4.09M ops/s | -6.8% | 0.93x |
| expression-deep-nested | complete-false | 13.76M ops/s | 12.84M ops/s | -6.7% | 0.93x |
| expression-deep-nested | full-execution-false | 4.37M ops/s | 4.12M ops/s | -5.7% | 0.94x |

