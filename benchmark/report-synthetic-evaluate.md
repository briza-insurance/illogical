# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-oop.json`
**Improved:** `results-synthetic-evaluate-bytecode.json`
**Total cases compared:** 101

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 98 |
| Slower (>-5%) | 0 |
| Unchanged | 3 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n1026-r1000-10x | complete-true | 30.67K ops/s | 19.22M ops/s | +62562.4% | 626.62x |
| overlap-n1026-r1000-10x | full-execution-true | 30.63K ops/s | 18.86M ops/s | +61456.0% | 615.56x |
| overlap-n1026-r1000-10x | early-true | 30.69K ops/s | 16.93M ops/s | +55060.9% | 551.61x |
| overlap-n1026-r1000-10x | partial-true | 42.82K ops/s | 18.96M ops/s | +44184.5% | 442.84x |
| overlap-n526-r500-5x | full-execution-true | 64.01K ops/s | 19.54M ops/s | +30428.5% | 305.29x |
| overlap-n526-r500-5x | complete-true | 65.28K ops/s | 19.70M ops/s | +30078.6% | 301.79x |
| overlap-n526-r500-5x | early-true | 65.32K ops/s | 19.59M ops/s | +29896.3% | 299.96x |
| overlap-n526-r500-5x | partial-true | 89.22K ops/s | 19.94M ops/s | +22243.4% | 223.43x |
| in-n1224-r1-10x | late-true | 153.08K ops/s | 23.78M ops/s | +15434.0% | 155.34x |
| in-n1224-r1-10x | full-execution-false | 162.12K ops/s | 23.56M ops/s | +14433.9% | 145.34x |
| in-n1224-r1-10x | complete-false | 163.22K ops/s | 23.58M ops/s | +14346.9% | 144.47x |
| in-n1224-r1-10x | early-true | 177.74K ops/s | 23.61M ops/s | +13182.0% | 132.82x |
| in-n1224-r1-10x | full-execution-true | 180.48K ops/s | 23.62M ops/s | +12984.9% | 130.85x |
| in-n1224-r1-10x | partial-true | 181.36K ops/s | 23.73M ops/s | +12982.5% | 130.83x |
| in-n1224-r1-10x | empty-context | 181.79K ops/s | 23.77M ops/s | +12975.3% | 130.75x |
| in-n1224-r1-10x | complete-true | 181.05K ops/s | 23.65M ops/s | +12960.4% | 130.60x |
| in-n1224-r1-10x | partial-false | 181.44K ops/s | 23.58M ops/s | +12893.7% | 129.94x |
| in-n614-r1-5x | late-true | 301.12K ops/s | 23.55M ops/s | +7721.4% | 78.21x |
| in-n614-r1-5x | full-execution-false | 319.33K ops/s | 22.99M ops/s | +7099.8% | 72.00x |
| in-n614-r1-5x | complete-false | 317.85K ops/s | 22.36M ops/s | +6934.1% | 70.34x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-simple-eq | early-true | 22.86M ops/s | 23.89M ops/s | +4.5% | 1.05x |
| expression-simple-ne | early-true | 22.66M ops/s | 23.72M ops/s | +4.7% | 1.05x |
| expression-simple-eq | partial-true | 22.92M ops/s | 24.00M ops/s | +4.7% | 1.05x |
| expression-simple-eq | full-execution-true | 22.81M ops/s | 24.00M ops/s | +5.2% | 1.05x |
| expression-simple-ne | complete-true | 22.65M ops/s | 23.86M ops/s | +5.3% | 1.05x |
| expression-simple-ne | partial-true | 22.66M ops/s | 23.86M ops/s | +5.3% | 1.05x |
| expression-simple-eq | complete-true | 22.93M ops/s | 24.17M ops/s | +5.4% | 1.05x |
| expression-simple-eq | full-execution-false | 22.53M ops/s | 23.81M ops/s | +5.7% | 1.06x |
| expression-simple-eq | complete-false | 22.50M ops/s | 23.78M ops/s | +5.7% | 1.06x |
| expression-reference-nested | empty-context | 20.24M ops/s | 21.45M ops/s | +6.0% | 1.06x |
| expression-simple-eq | late-true | 22.88M ops/s | 24.26M ops/s | +6.1% | 1.06x |
| expression-simple-ne | empty-context | 22.39M ops/s | 23.75M ops/s | +6.1% | 1.06x |
| expression-medium-or | partial-true | 21.62M ops/s | 23.05M ops/s | +6.6% | 1.07x |
| expression-simple-ne | full-execution-true | 22.71M ops/s | 24.24M ops/s | +6.7% | 1.07x |
| expression-simple-eq | partial-false | 22.10M ops/s | 23.70M ops/s | +7.2% | 1.07x |
| expression-simple-eq | empty-context | 22.01M ops/s | 23.61M ops/s | +7.3% | 1.07x |
| expression-medium-or | complete-true | 21.76M ops/s | 23.39M ops/s | +7.5% | 1.07x |
| expression-simple-ne | late-true | 22.39M ops/s | 24.07M ops/s | +7.5% | 1.07x |
| expression-reference-nested | complete-false | 18.70M ops/s | 20.11M ops/s | +7.5% | 1.08x |
| expression-medium-or | early-true | 21.56M ops/s | 23.32M ops/s | +8.1% | 1.08x |

### Regressions

_No regressions._

