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
| overlap-n1026-r1000-10x | early-true | 31.48K ops/s | 18.05M ops/s | +57231.6% | 573.32x |
| overlap-n1026-r1000-10x | full-execution-true | 31.31K ops/s | 17.88M ops/s | +57014.8% | 571.15x |
| overlap-n1026-r1000-10x | complete-true | 31.52K ops/s | 17.90M ops/s | +56674.1% | 567.74x |
| overlap-n1026-r1000-10x | partial-true | 44.02K ops/s | 18.98M ops/s | +43012.0% | 431.12x |
| overlap-n526-r500-5x | full-execution-true | 65.99K ops/s | 19.39M ops/s | +29280.9% | 293.81x |
| overlap-n526-r500-5x | early-true | 66.07K ops/s | 19.40M ops/s | +29256.5% | 293.57x |
| overlap-n526-r500-5x | complete-true | 65.98K ops/s | 19.13M ops/s | +28898.5% | 289.98x |
| overlap-n526-r500-5x | partial-true | 89.06K ops/s | 19.60M ops/s | +21901.9% | 220.02x |
| in-n1224-r1-10x | late-true | 156.30K ops/s | 23.79M ops/s | +15118.1% | 152.18x |
| in-n1224-r1-10x | complete-false | 161.13K ops/s | 24.04M ops/s | +14817.2% | 149.17x |
| in-n1224-r1-10x | full-execution-false | 161.14K ops/s | 23.96M ops/s | +14766.0% | 148.66x |
| in-n1224-r1-10x | partial-false | 180.31K ops/s | 24.11M ops/s | +13272.0% | 133.72x |
| in-n1224-r1-10x | empty-context | 180.35K ops/s | 23.69M ops/s | +13036.1% | 131.36x |
| in-n1224-r1-10x | partial-true | 180.73K ops/s | 21.38M ops/s | +11727.1% | 118.27x |
| in-n1224-r1-10x | full-execution-true | 180.91K ops/s | 21.30M ops/s | +11672.0% | 117.72x |
| in-n1224-r1-10x | complete-true | 180.17K ops/s | 21.11M ops/s | +11614.7% | 117.15x |
| in-n1224-r1-10x | early-true | 181.02K ops/s | 20.93M ops/s | +11462.4% | 115.62x |
| in-n614-r1-5x | late-true | 307.73K ops/s | 23.78M ops/s | +7627.4% | 77.27x |
| in-n614-r1-5x | full-execution-false | 322.79K ops/s | 23.96M ops/s | +7321.9% | 74.22x |
| in-n614-r1-5x | complete-false | 325.09K ops/s | 24.07M ops/s | +7304.0% | 74.04x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | early-true | 22.46M ops/s | 22.40M ops/s | -0.3% | 1.00x |
| expression-medium-or | complete-true | 22.53M ops/s | 22.64M ops/s | +0.5% | 1.00x |
| expression-medium-or | partial-true | 22.41M ops/s | 22.75M ops/s | +1.5% | 1.02x |
| expression-reference-nested | partial-false | 20.72M ops/s | 21.08M ops/s | +1.7% | 1.02x |
| expression-reference-nested | empty-context | 19.90M ops/s | 20.28M ops/s | +1.9% | 1.02x |
| expression-deep-nested | partial-false | 20.54M ops/s | 21.07M ops/s | +2.6% | 1.03x |
| expression-deep-nested | empty-context | 20.22M ops/s | 20.84M ops/s | +3.0% | 1.03x |
| expression-simple-eq | early-true | 23.39M ops/s | 24.15M ops/s | +3.2% | 1.03x |
| expression-simple-ne | early-true | 22.99M ops/s | 23.82M ops/s | +3.6% | 1.04x |
| expression-simple-eq | complete-false | 23.13M ops/s | 24.12M ops/s | +4.3% | 1.04x |
| expression-reference-nested | complete-false | 19.03M ops/s | 19.96M ops/s | +4.9% | 1.05x |
| expression-simple-ne | late-true | 23.13M ops/s | 24.31M ops/s | +5.1% | 1.05x |
| expression-simple-ne | full-execution-true | 23.21M ops/s | 24.42M ops/s | +5.2% | 1.05x |
| expression-simple-ne | complete-true | 22.87M ops/s | 24.13M ops/s | +5.5% | 1.06x |
| expression-simple-eq | partial-false | 22.63M ops/s | 23.90M ops/s | +5.6% | 1.06x |
| expression-simple-eq | complete-true | 23.25M ops/s | 24.57M ops/s | +5.7% | 1.06x |
| expression-simple-eq | empty-context | 22.82M ops/s | 24.12M ops/s | +5.7% | 1.06x |
| expression-simple-ne | empty-context | 22.59M ops/s | 24.00M ops/s | +6.3% | 1.06x |
| expression-simple-eq | partial-true | 23.14M ops/s | 24.66M ops/s | +6.6% | 1.07x |
| expression-simple-ne | partial-true | 22.63M ops/s | 24.15M ops/s | +6.7% | 1.07x |

### Regressions

_No regressions._

