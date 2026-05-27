# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-oop.json`
**Improved:** `results-synthetic-evaluate-bytecode.json`
**Total cases compared:** 101

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 96 |
| Slower (>-5%) | 0 |
| Unchanged | 5 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n1026-r1000-10x | early-true | 24.71K ops/s | 12.97M ops/s | +52382.1% | 524.82x |
| overlap-n1026-r1000-10x | complete-true | 24.71K ops/s | 12.88M ops/s | +52021.7% | 521.22x |
| overlap-n1026-r1000-10x | full-execution-true | 24.74K ops/s | 12.85M ops/s | +51849.4% | 519.49x |
| overlap-n526-r500-5x | complete-true | 33.92K ops/s | 12.75M ops/s | +37477.8% | 375.78x |
| overlap-n1026-r1000-10x | partial-true | 35.39K ops/s | 12.89M ops/s | +36310.7% | 364.11x |
| overlap-n526-r500-5x | full-execution-true | 51.60K ops/s | 12.76M ops/s | +24631.9% | 247.32x |
| overlap-n526-r500-5x | early-true | 51.60K ops/s | 12.59M ops/s | +24304.6% | 244.05x |
| overlap-n526-r500-5x | partial-true | 71.97K ops/s | 12.51M ops/s | +17279.3% | 173.79x |
| in-n1224-r1-10x | late-true | 177.01K ops/s | 21.23M ops/s | +11890.8% | 119.91x |
| in-n1224-r1-10x | complete-false | 183.18K ops/s | 21.53M ops/s | +11651.3% | 117.51x |
| in-n1224-r1-10x | full-execution-false | 185.85K ops/s | 21.59M ops/s | +11517.4% | 116.17x |
| in-n1224-r1-10x | partial-false | 232.17K ops/s | 22.40M ops/s | +9549.4% | 96.49x |
| in-n1224-r1-10x | empty-context | 237.40K ops/s | 22.29M ops/s | +9288.3% | 93.88x |
| in-n1224-r1-10x | partial-true | 229.91K ops/s | 17.54M ops/s | +7528.9% | 76.29x |
| in-n1224-r1-10x | complete-true | 230.52K ops/s | 17.44M ops/s | +7466.3% | 75.66x |
| in-n1224-r1-10x | full-execution-true | 230.83K ops/s | 17.42M ops/s | +7448.9% | 75.49x |
| in-n1224-r1-10x | early-true | 230.90K ops/s | 17.29M ops/s | +7387.1% | 74.87x |
| in-n614-r1-5x | late-true | 353.00K ops/s | 21.55M ops/s | +6006.2% | 61.06x |
| in-n614-r1-5x | full-execution-false | 370.20K ops/s | 21.79M ops/s | +5786.3% | 58.86x |
| in-n614-r1-5x | complete-false | 371.98K ops/s | 21.67M ops/s | +5726.1% | 58.26x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | early-true | 17.08M ops/s | 16.70M ops/s | -2.2% | 0.98x |
| expression-medium-or | partial-true | 17.04M ops/s | 17.01M ops/s | -0.2% | 1.00x |
| expression-medium-or | partial-false | 7.22M ops/s | 7.38M ops/s | +2.2% | 1.02x |
| expression-medium-or | full-execution-false | 7.37M ops/s | 7.60M ops/s | +3.1% | 1.03x |
| expression-medium-or | empty-context | 7.21M ops/s | 7.47M ops/s | +3.7% | 1.04x |
| expression-medium-or | complete-true | 16.20M ops/s | 17.08M ops/s | +5.4% | 1.05x |
| expression-medium-or | complete-false | 7.26M ops/s | 7.67M ops/s | +5.6% | 1.06x |
| expression-medium-or | full-execution-true | 7.04M ops/s | 7.62M ops/s | +8.1% | 1.08x |
| expression-medium-or | late-true | 6.96M ops/s | 7.60M ops/s | +9.2% | 1.09x |
| expression-deep-nested | full-execution-false | 3.18M ops/s | 3.63M ops/s | +14.0% | 1.14x |
| expression-deep-nested | late-true | 3.17M ops/s | 3.64M ops/s | +14.8% | 1.15x |
| expression-reference-nested | complete-false | 10.34M ops/s | 12.35M ops/s | +19.5% | 1.19x |
| expression-reference-nested | empty-context | 11.21M ops/s | 13.60M ops/s | +21.3% | 1.21x |
| expression-reference-nested | full-execution-false | 5.61M ops/s | 6.96M ops/s | +24.1% | 1.24x |
| expression-reference-nested | partial-false | 11.14M ops/s | 14.27M ops/s | +28.1% | 1.28x |
| expression-deep-nested | partial-false | 11.12M ops/s | 14.31M ops/s | +28.8% | 1.29x |
| expression-deep-nested | empty-context | 11.09M ops/s | 14.42M ops/s | +30.0% | 1.30x |
| expression-deep-nested | complete-false | 10.09M ops/s | 13.19M ops/s | +30.7% | 1.31x |
| expression-complex-nested | full-execution-false | 6.72M ops/s | 9.69M ops/s | +44.3% | 1.44x |
| expression-complex-nested | partial-false | 11.18M ops/s | 16.29M ops/s | +45.7% | 1.46x |

### Regressions

_No regressions._

