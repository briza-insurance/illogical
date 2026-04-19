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
| overlap-n1026-r1000-10x | complete-true | 30.77K ops/s | 18.12M ops/s | +58789.4% | 588.89x |
| overlap-n1026-r1000-10x | full-execution-true | 31.99K ops/s | 17.28M ops/s | +53920.9% | 540.21x |
| overlap-n1026-r1000-10x | early-true | 31.79K ops/s | 16.54M ops/s | +51907.8% | 520.08x |
| overlap-n1026-r1000-10x | partial-true | 42.64K ops/s | 17.51M ops/s | +40974.5% | 410.75x |
| overlap-n526-r500-5x | complete-true | 65.33K ops/s | 17.77M ops/s | +27103.9% | 272.04x |
| overlap-n526-r500-5x | full-execution-true | 64.52K ops/s | 17.37M ops/s | +26826.5% | 269.27x |
| overlap-n526-r500-5x | early-true | 64.17K ops/s | 17.15M ops/s | +26618.3% | 267.18x |
| overlap-n526-r500-5x | partial-true | 85.47K ops/s | 17.56M ops/s | +20444.7% | 205.45x |
| in-n1224-r1-10x | late-true | 156.49K ops/s | 23.79M ops/s | +15104.6% | 152.05x |
| in-n1224-r1-10x | full-execution-false | 163.22K ops/s | 23.65M ops/s | +14390.4% | 144.90x |
| in-n1224-r1-10x | complete-false | 163.18K ops/s | 23.55M ops/s | +14333.7% | 144.34x |
| in-n1224-r1-10x | complete-true | 181.25K ops/s | 23.62M ops/s | +12934.1% | 130.34x |
| in-n1224-r1-10x | partial-false | 181.85K ops/s | 23.70M ops/s | +12930.2% | 130.30x |
| in-n1224-r1-10x | early-true | 181.81K ops/s | 23.58M ops/s | +12872.6% | 129.73x |
| in-n1224-r1-10x | full-execution-true | 181.93K ops/s | 23.56M ops/s | +12851.4% | 129.51x |
| in-n1224-r1-10x | partial-true | 181.83K ops/s | 23.50M ops/s | +12822.6% | 129.23x |
| in-n1224-r1-10x | empty-context | 180.50K ops/s | 23.26M ops/s | +12787.7% | 128.88x |
| in-n614-r1-5x | late-true | 312.44K ops/s | 23.53M ops/s | +7430.8% | 75.31x |
| in-n614-r1-5x | complete-false | 319.62K ops/s | 23.43M ops/s | +7230.1% | 73.30x |
| in-n614-r1-5x | full-execution-false | 326.62K ops/s | 23.60M ops/s | +7126.6% | 72.27x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | partial-true | 21.87M ops/s | 22.02M ops/s | +0.7% | 1.01x |
| expression-reference-nested | empty-context | 19.98M ops/s | 20.32M ops/s | +1.7% | 1.02x |
| expression-deep-nested | partial-false | 20.38M ops/s | 20.75M ops/s | +1.8% | 1.02x |
| expression-medium-or | early-true | 21.99M ops/s | 22.46M ops/s | +2.2% | 1.02x |
| expression-medium-or | complete-true | 21.81M ops/s | 22.36M ops/s | +2.5% | 1.03x |
| expression-reference-nested | complete-false | 18.70M ops/s | 19.34M ops/s | +3.4% | 1.03x |
| expression-reference-nested | partial-false | 20.23M ops/s | 20.97M ops/s | +3.7% | 1.04x |
| expression-deep-nested | empty-context | 19.61M ops/s | 20.33M ops/s | +3.7% | 1.04x |
| expression-simple-ne | early-true | 22.90M ops/s | 23.83M ops/s | +4.1% | 1.04x |
| expression-simple-ne | partial-true | 22.68M ops/s | 23.66M ops/s | +4.3% | 1.04x |
| expression-simple-eq | partial-false | 22.62M ops/s | 23.68M ops/s | +4.7% | 1.05x |
| expression-simple-ne | complete-true | 22.59M ops/s | 23.76M ops/s | +5.2% | 1.05x |
| expression-simple-ne | empty-context | 22.37M ops/s | 23.53M ops/s | +5.2% | 1.05x |
| expression-simple-eq | partial-true | 22.97M ops/s | 24.19M ops/s | +5.3% | 1.05x |
| expression-simple-eq | empty-context | 22.25M ops/s | 23.46M ops/s | +5.4% | 1.05x |
| expression-reference-nested | full-execution-false | 9.92M ops/s | 10.50M ops/s | +5.8% | 1.06x |
| expression-simple-eq | full-execution-false | 22.70M ops/s | 24.03M ops/s | +5.9% | 1.06x |
| expression-simple-ne | full-execution-true | 22.75M ops/s | 24.22M ops/s | +6.4% | 1.06x |
| expression-simple-eq | complete-false | 22.73M ops/s | 24.21M ops/s | +6.5% | 1.07x |
| expression-simple-eq | full-execution-true | 22.92M ops/s | 24.46M ops/s | +6.7% | 1.07x |

### Regressions

_No regressions._

