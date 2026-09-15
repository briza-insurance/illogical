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
| in-n1224-r1-10x | empty-context | 15.38K ops/s | 37.27M ops/s | +242210.7% | 2423.11x |
| in-n1224-r1-10x | full-execution-false | 15.44K ops/s | 36.95M ops/s | +239200.9% | 2393.01x |
| in-n1224-r1-10x | partial-true | 15.49K ops/s | 36.90M ops/s | +238181.4% | 2382.81x |
| in-n1224-r1-10x | full-execution-true | 15.69K ops/s | 36.42M ops/s | +231961.8% | 2320.62x |
| in-n1224-r1-10x | complete-false | 15.82K ops/s | 36.70M ops/s | +231905.2% | 2320.05x |
| in-n1224-r1-10x | partial-false | 15.78K ops/s | 36.44M ops/s | +230900.9% | 2310.01x |
| in-n1224-r1-10x | complete-true | 15.62K ops/s | 35.98M ops/s | +230210.9% | 2303.11x |
| in-n614-r1-5x | full-execution-false | 30.72K ops/s | 35.77M ops/s | +116355.7% | 1164.56x |
| in-n614-r1-5x | full-execution-true | 30.85K ops/s | 35.76M ops/s | +115811.1% | 1159.11x |
| in-n614-r1-5x | partial-true | 30.94K ops/s | 35.70M ops/s | +115300.9% | 1154.01x |
| in-n614-r1-5x | complete-true | 31.41K ops/s | 35.75M ops/s | +113698.9% | 1137.99x |
| in-n614-r1-5x | partial-false | 31.41K ops/s | 35.70M ops/s | +113538.9% | 1136.39x |
| in-n614-r1-5x | empty-context | 31.51K ops/s | 35.35M ops/s | +112081.7% | 1121.82x |
| in-n614-r1-5x | complete-false | 31.68K ops/s | 35.17M ops/s | +110910.9% | 1110.11x |
| overlap-n447-r50-10x | complete-false | 46.71K ops/s | 36.74M ops/s | +78561.1% | 786.61x |
| overlap-n447-r50-10x | complete-true | 46.76K ops/s | 36.32M ops/s | +77573.7% | 776.74x |
| overlap-n447-r50-10x | empty-context | 46.89K ops/s | 36.16M ops/s | +77019.0% | 771.19x |
| overlap-n447-r50-10x | full-execution-false | 46.79K ops/s | 35.99M ops/s | +76819.7% | 769.20x |
| overlap-n447-r50-10x | full-execution-true | 46.47K ops/s | 35.38M ops/s | +76035.9% | 761.36x |
| overlap-n447-r50-10x | partial-false | 46.32K ops/s | 35.19M ops/s | +75875.6% | 759.76x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-simple-eq | empty-context | 5.36M ops/s | 36.52M ops/s | +581.0% | 6.81x |
| expression-simple-eq | complete-true | 5.27M ops/s | 36.07M ops/s | +584.5% | 6.84x |
| expression-simple-eq | complete-false | 5.24M ops/s | 35.89M ops/s | +585.0% | 6.85x |
| expression-simple-eq | partial-false | 5.29M ops/s | 36.34M ops/s | +586.4% | 6.86x |
| expression-simple-eq | full-execution-false | 5.25M ops/s | 36.38M ops/s | +593.1% | 6.93x |
| expression-simple-eq | full-execution-true | 5.20M ops/s | 36.08M ops/s | +593.7% | 6.94x |
| expression-simple-ne | full-execution-true | 5.17M ops/s | 35.91M ops/s | +594.2% | 6.94x |
| expression-simple-eq | partial-true | 5.18M ops/s | 36.04M ops/s | +595.7% | 6.96x |
| expression-simple-ne | partial-true | 5.16M ops/s | 35.89M ops/s | +595.8% | 6.96x |
| expression-simple-ne | complete-true | 5.17M ops/s | 36.47M ops/s | +605.0% | 7.05x |
| expression-simple-ne | empty-context | 5.16M ops/s | 36.67M ops/s | +610.6% | 7.11x |
| expression-medium-or | full-execution-false | 1.60M ops/s | 34.72M ops/s | +2071.2% | 21.71x |
| expression-medium-or | empty-context | 1.60M ops/s | 35.62M ops/s | +2120.4% | 22.20x |
| expression-medium-or | complete-true | 1.60M ops/s | 35.72M ops/s | +2135.9% | 22.36x |
| expression-medium-or | full-execution-true | 1.59M ops/s | 35.72M ops/s | +2146.0% | 22.46x |
| expression-medium-or | partial-false | 1.60M ops/s | 36.00M ops/s | +2154.0% | 22.54x |
| expression-reference-nested | full-execution-false | 1.57M ops/s | 35.69M ops/s | +2168.8% | 22.69x |
| expression-reference-nested | partial-false | 1.58M ops/s | 35.97M ops/s | +2183.0% | 22.83x |
| expression-medium-or | partial-true | 1.58M ops/s | 36.22M ops/s | +2187.3% | 22.87x |
| expression-reference-nested | complete-false | 1.56M ops/s | 35.87M ops/s | +2200.6% | 23.01x |

### Regressions

_No regressions._

