# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-oop.json`
**Improved:** `results-synthetic-evaluate-bytecode.json`
**Total cases compared:** 106

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 106 |
| Slower (>-5%) | 0 |
| Unchanged | 0 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n1026-r1000-10x | full-execution-true | 24.27K ops/s | 18.21M ops/s | +74920.1% | 750.20x |
| overlap-n1026-r1000-10x | early-true | 24.19K ops/s | 18.07M ops/s | +74621.2% | 747.21x |
| overlap-n1026-r1000-10x | complete-true | 24.70K ops/s | 18.04M ops/s | +72916.7% | 730.17x |
| overlap-n1026-r1000-10x | partial-true | 34.78K ops/s | 17.92M ops/s | +51439.0% | 515.39x |
| overlap-n526-r500-5x | early-true | 49.79K ops/s | 18.89M ops/s | +37842.6% | 379.43x |
| overlap-n526-r500-5x | full-execution-true | 49.57K ops/s | 18.59M ops/s | +37402.9% | 375.03x |
| overlap-n526-r500-5x | complete-true | 49.25K ops/s | 18.05M ops/s | +36554.2% | 366.54x |
| overlap-n526-r500-5x | partial-true | 69.99K ops/s | 18.65M ops/s | +26544.6% | 266.45x |
| in-n1224-r1-10x | full-execution-false | 169.43K ops/s | 22.84M ops/s | +13377.7% | 134.78x |
| in-n1224-r1-10x | late-true | 174.37K ops/s | 23.37M ops/s | +13301.4% | 134.01x |
| in-n1224-r1-10x | complete-false | 184.06K ops/s | 22.94M ops/s | +12362.0% | 124.62x |
| in-n1224-r1-10x | early-true | 225.00K ops/s | 23.66M ops/s | +10418.0% | 105.18x |
| in-n1224-r1-10x | partial-false | 230.07K ops/s | 23.88M ops/s | +10279.2% | 103.79x |
| in-n1224-r1-10x | partial-true | 229.40K ops/s | 23.77M ops/s | +10259.8% | 103.60x |
| in-n1224-r1-10x | full-execution-true | 228.23K ops/s | 23.54M ops/s | +10215.8% | 103.16x |
| in-n1224-r1-10x | empty-context | 232.97K ops/s | 23.71M ops/s | +10077.5% | 101.78x |
| in-n1224-r1-10x | complete-true | 230.84K ops/s | 23.48M ops/s | +10071.1% | 101.71x |
| in-n614-r1-5x | late-true | 351.91K ops/s | 23.51M ops/s | +6581.6% | 66.82x |
| in-n614-r1-5x | complete-false | 367.00K ops/s | 22.31M ops/s | +5978.2% | 60.78x |
| in-n614-r1-5x | full-execution-false | 368.07K ops/s | 22.35M ops/s | +5973.4% | 60.73x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | early-true | 17.25M ops/s | 20.37M ops/s | +18.1% | 1.18x |
| expression-medium-or | partial-true | 17.06M ops/s | 20.54M ops/s | +20.4% | 1.20x |
| expression-medium-or | complete-true | 17.00M ops/s | 20.92M ops/s | +23.1% | 1.23x |
| expression-medium-or | complete-false | 7.43M ops/s | 10.83M ops/s | +45.8% | 1.46x |
| expression-medium-or | empty-context | 7.34M ops/s | 10.73M ops/s | +46.2% | 1.46x |
| expression-medium-or | partial-false | 7.11M ops/s | 10.42M ops/s | +46.5% | 1.46x |
| expression-medium-or | full-execution-false | 7.43M ops/s | 10.92M ops/s | +47.0% | 1.47x |
| expression-medium-or | full-execution-true | 7.19M ops/s | 10.99M ops/s | +52.9% | 1.53x |
| expression-medium-or | late-true | 6.97M ops/s | 10.89M ops/s | +56.2% | 1.56x |
| expression-deep-nested | late-true | 3.13M ops/s | 5.14M ops/s | +64.2% | 1.64x |
| expression-reference-nested | empty-context | 11.36M ops/s | 18.88M ops/s | +66.2% | 1.66x |
| expression-deep-nested | empty-context | 11.17M ops/s | 18.68M ops/s | +67.3% | 1.67x |
| expression-deep-nested | full-execution-false | 3.15M ops/s | 5.31M ops/s | +68.3% | 1.68x |
| expression-date-arithmetic | partial-true | 321.11K ops/s | 541.60K ops/s | +68.7% | 1.69x |
| expression-date-arithmetic | full-execution-true | 322.39K ops/s | 547.03K ops/s | +69.7% | 1.70x |
| expression-reference-nested | partial-false | 11.17M ops/s | 18.97M ops/s | +69.9% | 1.70x |
| expression-deep-nested | complete-false | 10.16M ops/s | 17.36M ops/s | +70.9% | 1.71x |
| expression-deep-nested | partial-false | 11.18M ops/s | 19.18M ops/s | +71.6% | 1.72x |
| expression-reference-nested | full-execution-false | 5.60M ops/s | 9.89M ops/s | +76.5% | 1.77x |
| expression-simple-eq | complete-true | 13.76M ops/s | 24.31M ops/s | +76.7% | 1.77x |

### Regressions

_No regressions._

