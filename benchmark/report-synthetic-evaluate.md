# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-oop.json`
**Improved:** `results-synthetic-evaluate-bytecode.json`
**Total cases compared:** 101

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 90 |
| Slower (>-5%) | 0 |
| Unchanged | 11 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n1026-r1000-10x | full-execution-true | 29.20K ops/s | 19.13M ops/s | +65412.6% | 655.13x |
| overlap-n1026-r1000-10x | complete-true | 29.06K ops/s | 18.77M ops/s | +64494.8% | 645.95x |
| overlap-n1026-r1000-10x | early-true | 29.66K ops/s | 17.92M ops/s | +60298.4% | 603.98x |
| overlap-n1026-r1000-10x | partial-true | 41.83K ops/s | 18.52M ops/s | +44184.4% | 442.84x |
| overlap-n526-r500-5x | complete-true | 63.89K ops/s | 18.39M ops/s | +28685.7% | 287.86x |
| overlap-n526-r500-5x | early-true | 65.33K ops/s | 18.66M ops/s | +28462.4% | 285.62x |
| overlap-n526-r500-5x | full-execution-true | 65.24K ops/s | 18.23M ops/s | +27848.3% | 279.48x |
| overlap-n526-r500-5x | partial-true | 87.29K ops/s | 18.62M ops/s | +21236.0% | 213.36x |
| in-n1224-r1-10x | late-true | 158.91K ops/s | 23.63M ops/s | +14773.2% | 148.73x |
| in-n1224-r1-10x | complete-false | 165.21K ops/s | 24.06M ops/s | +14463.3% | 145.63x |
| in-n1224-r1-10x | full-execution-false | 165.34K ops/s | 24.03M ops/s | +14432.8% | 145.33x |
| in-n1224-r1-10x | empty-context | 181.67K ops/s | 23.89M ops/s | +13052.3% | 131.52x |
| in-n1224-r1-10x | partial-false | 183.40K ops/s | 24.04M ops/s | +13008.0% | 131.08x |
| in-n1224-r1-10x | partial-true | 183.87K ops/s | 23.58M ops/s | +12726.4% | 128.26x |
| in-n1224-r1-10x | full-execution-true | 183.28K ops/s | 23.51M ops/s | +12725.7% | 128.26x |
| in-n1224-r1-10x | complete-true | 182.57K ops/s | 23.14M ops/s | +12573.7% | 126.74x |
| in-n1224-r1-10x | early-true | 184.19K ops/s | 23.34M ops/s | +12569.6% | 126.70x |
| in-n614-r1-5x | late-true | 315.04K ops/s | 23.91M ops/s | +7490.5% | 75.91x |
| in-n614-r1-5x | complete-false | 326.41K ops/s | 24.07M ops/s | +7275.3% | 73.75x |
| in-n614-r1-5x | full-execution-false | 327.78K ops/s | 23.91M ops/s | +7193.1% | 72.93x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-reference-nested | complete-false | 19.39M ops/s | 19.28M ops/s | -0.5% | 0.99x |
| expression-reference-nested | partial-false | 21.10M ops/s | 21.12M ops/s | +0.1% | 1.00x |
| expression-medium-or | partial-true | 22.13M ops/s | 22.18M ops/s | +0.2% | 1.00x |
| expression-medium-or | complete-true | 22.28M ops/s | 22.40M ops/s | +0.6% | 1.01x |
| expression-reference-nested | empty-context | 20.31M ops/s | 20.46M ops/s | +0.8% | 1.01x |
| expression-deep-nested | partial-false | 20.75M ops/s | 20.94M ops/s | +0.9% | 1.01x |
| expression-medium-or | early-true | 22.02M ops/s | 22.30M ops/s | +1.3% | 1.01x |
| expression-deep-nested | empty-context | 19.80M ops/s | 20.61M ops/s | +4.1% | 1.04x |
| expression-simple-eq | full-execution-false | 23.05M ops/s | 23.99M ops/s | +4.1% | 1.04x |
| expression-medium-and | partial-false | 21.12M ops/s | 22.06M ops/s | +4.5% | 1.04x |
| expression-simple-ne | complete-true | 22.94M ops/s | 24.00M ops/s | +4.6% | 1.05x |
| expression-simple-ne | early-true | 22.85M ops/s | 24.05M ops/s | +5.2% | 1.05x |
| expression-medium-or | late-true | 10.89M ops/s | 11.47M ops/s | +5.3% | 1.05x |
| expression-deep-nested | complete-false | 19.35M ops/s | 20.39M ops/s | +5.4% | 1.05x |
| expression-medium-or | complete-false | 10.95M ops/s | 11.55M ops/s | +5.5% | 1.05x |
| expression-simple-eq | full-execution-true | 23.06M ops/s | 24.34M ops/s | +5.5% | 1.06x |
| expression-complex-nested | partial-false | 20.97M ops/s | 22.21M ops/s | +5.9% | 1.06x |
| expression-simple-ne | full-execution-true | 22.87M ops/s | 24.22M ops/s | +5.9% | 1.06x |
| expression-simple-eq | late-true | 22.99M ops/s | 24.36M ops/s | +6.0% | 1.06x |
| expression-simple-eq | partial-false | 22.84M ops/s | 24.22M ops/s | +6.1% | 1.06x |

### Regressions

_No regressions._

