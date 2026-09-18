# Benchmark Comparison Report — parse

**Baseline:** `results-synthetic-parse-oop.json`
**Improved:** `results-synthetic-parse-bytecode.json`
**Total cases compared:** 87

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 87 |
| Slower (>-5%) | 0 |
| Unchanged | 0 |

---

## parse

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| in-n1224-r1-10x | partial-true | 15.41K ops/s | 39.12M ops/s | +253824.8% | 2539.25x |
| in-n1224-r1-10x | complete-true | 15.18K ops/s | 38.50M ops/s | +253489.4% | 2535.89x |
| in-n1224-r1-10x | full-execution-false | 15.61K ops/s | 38.97M ops/s | +249605.0% | 2497.05x |
| in-n1224-r1-10x | full-execution-true | 15.62K ops/s | 38.91M ops/s | +249043.8% | 2491.44x |
| in-n1224-r1-10x | partial-false | 15.36K ops/s | 37.68M ops/s | +245194.4% | 2452.94x |
| in-n1224-r1-10x | complete-false | 15.69K ops/s | 38.41M ops/s | +244731.7% | 2448.32x |
| in-n1224-r1-10x | empty-context | 15.70K ops/s | 38.10M ops/s | +242578.0% | 2426.78x |
| in-n614-r1-5x | full-execution-false | 30.74K ops/s | 39.05M ops/s | +126945.6% | 1270.46x |
| in-n614-r1-5x | full-execution-true | 30.77K ops/s | 38.87M ops/s | +126219.2% | 1263.19x |
| in-n614-r1-5x | partial-false | 31.17K ops/s | 39.24M ops/s | +125776.1% | 1258.76x |
| in-n614-r1-5x | complete-true | 30.95K ops/s | 38.23M ops/s | +123411.2% | 1235.11x |
| in-n614-r1-5x | empty-context | 30.68K ops/s | 37.58M ops/s | +122405.6% | 1225.06x |
| in-n614-r1-5x | complete-false | 30.88K ops/s | 37.54M ops/s | +121468.5% | 1215.68x |
| in-n614-r1-5x | partial-true | 30.93K ops/s | 36.43M ops/s | +117679.1% | 1177.79x |
| overlap-n447-r50-10x | full-execution-false | 45.56K ops/s | 37.15M ops/s | +81422.6% | 815.23x |
| overlap-n447-r50-10x | complete-true | 45.97K ops/s | 37.45M ops/s | +81352.1% | 814.52x |
| overlap-n447-r50-10x | full-execution-true | 46.40K ops/s | 37.77M ops/s | +81284.7% | 813.85x |
| overlap-n447-r50-10x | empty-context | 46.05K ops/s | 37.44M ops/s | +81205.9% | 813.06x |
| overlap-n447-r50-10x | complete-false | 45.88K ops/s | 37.09M ops/s | +80737.9% | 808.38x |
| overlap-n447-r50-10x | partial-true | 45.10K ops/s | 36.30M ops/s | +80398.5% | 804.98x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-simple-eq | empty-context | 5.23M ops/s | 36.73M ops/s | +601.8% | 7.02x |
| expression-simple-eq | partial-true | 5.31M ops/s | 37.45M ops/s | +604.8% | 7.05x |
| expression-simple-eq | partial-false | 5.26M ops/s | 37.09M ops/s | +605.1% | 7.05x |
| expression-simple-ne | partial-true | 5.04M ops/s | 36.16M ops/s | +617.1% | 7.17x |
| expression-simple-eq | complete-false | 5.16M ops/s | 37.03M ops/s | +617.7% | 7.18x |
| expression-simple-ne | complete-true | 4.94M ops/s | 35.65M ops/s | +622.0% | 7.22x |
| expression-simple-eq | full-execution-false | 5.23M ops/s | 37.84M ops/s | +623.3% | 7.23x |
| expression-simple-ne | empty-context | 5.01M ops/s | 36.32M ops/s | +625.3% | 7.25x |
| expression-simple-eq | complete-true | 5.19M ops/s | 37.72M ops/s | +627.5% | 7.28x |
| expression-simple-eq | full-execution-true | 5.13M ops/s | 37.98M ops/s | +640.8% | 7.41x |
| expression-simple-ne | full-execution-true | 4.95M ops/s | 36.66M ops/s | +640.8% | 7.41x |
| expression-medium-or | complete-true | 1.60M ops/s | 35.38M ops/s | +2104.8% | 22.05x |
| expression-medium-or | complete-false | 1.59M ops/s | 36.24M ops/s | +2173.6% | 22.74x |
| expression-medium-or | partial-false | 1.61M ops/s | 37.27M ops/s | +2218.5% | 23.19x |
| expression-reference-nested | empty-context | 1.58M ops/s | 37.44M ops/s | +2271.1% | 23.71x |
| expression-medium-or | partial-true | 1.61M ops/s | 38.64M ops/s | +2294.1% | 23.94x |
| expression-medium-or | full-execution-false | 1.60M ops/s | 38.67M ops/s | +2314.4% | 24.14x |
| expression-reference-nested | complete-false | 1.59M ops/s | 38.49M ops/s | +2319.6% | 24.20x |
| expression-reference-nested | partial-false | 1.59M ops/s | 38.78M ops/s | +2338.3% | 24.38x |
| expression-medium-or | full-execution-true | 1.60M ops/s | 39.18M ops/s | +2353.0% | 24.53x |

### Regressions

_No regressions._

