# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-oop.json`
**Improved:** `results-synthetic-evaluate-bytecode.json`
**Total cases compared:** 106

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 99 |
| Slower (>-5%) | 0 |
| Unchanged | 7 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n1026-r1000-10x | early-true | 24.19K ops/s | 13.18M ops/s | +54383.6% | 544.84x |
| overlap-n1026-r1000-10x | complete-true | 24.70K ops/s | 13.36M ops/s | +53971.4% | 540.71x |
| overlap-n1026-r1000-10x | full-execution-true | 24.27K ops/s | 12.71M ops/s | +52273.9% | 523.74x |
| overlap-n1026-r1000-10x | partial-true | 34.78K ops/s | 13.84M ops/s | +39691.7% | 397.92x |
| overlap-n526-r500-5x | complete-true | 49.25K ops/s | 13.83M ops/s | +27980.6% | 280.81x |
| overlap-n526-r500-5x | full-execution-true | 49.57K ops/s | 13.73M ops/s | +27601.0% | 277.01x |
| overlap-n526-r500-5x | early-true | 49.79K ops/s | 13.38M ops/s | +26772.7% | 268.73x |
| overlap-n526-r500-5x | partial-true | 69.99K ops/s | 13.54M ops/s | +19243.1% | 193.43x |
| in-n1224-r1-10x | late-true | 174.37K ops/s | 21.74M ops/s | +12367.9% | 124.68x |
| in-n1224-r1-10x | full-execution-false | 169.43K ops/s | 19.42M ops/s | +11362.6% | 114.63x |
| in-n1224-r1-10x | complete-false | 184.06K ops/s | 19.44M ops/s | +10461.2% | 105.61x |
| in-n1224-r1-10x | partial-false | 230.07K ops/s | 22.49M ops/s | +9676.8% | 97.77x |
| in-n1224-r1-10x | empty-context | 232.97K ops/s | 22.54M ops/s | +9574.0% | 96.74x |
| in-n1224-r1-10x | early-true | 225.00K ops/s | 16.65M ops/s | +7298.9% | 73.99x |
| in-n1224-r1-10x | full-execution-true | 228.23K ops/s | 16.59M ops/s | +7169.7% | 72.70x |
| in-n1224-r1-10x | complete-true | 230.84K ops/s | 16.59M ops/s | +7087.6% | 71.88x |
| in-n1224-r1-10x | partial-true | 229.40K ops/s | 16.40M ops/s | +7049.8% | 71.50x |
| in-n614-r1-5x | late-true | 351.91K ops/s | 20.69M ops/s | +5779.4% | 58.79x |
| in-n614-r1-5x | full-execution-false | 368.07K ops/s | 20.49M ops/s | +5467.7% | 55.68x |
| in-n614-r1-5x | complete-false | 367.00K ops/s | 19.90M ops/s | +5322.9% | 54.23x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | early-true | 17.25M ops/s | 16.97M ops/s | -1.6% | 0.98x |
| expression-medium-or | complete-true | 17.00M ops/s | 16.91M ops/s | -0.5% | 1.00x |
| expression-medium-or | partial-true | 17.06M ops/s | 17.06M ops/s | +0.0% | 1.00x |
| expression-medium-or | empty-context | 7.34M ops/s | 7.45M ops/s | +1.5% | 1.01x |
| expression-medium-or | full-execution-false | 7.43M ops/s | 7.64M ops/s | +2.8% | 1.03x |
| expression-medium-or | complete-false | 7.43M ops/s | 7.67M ops/s | +3.2% | 1.03x |
| expression-medium-or | partial-false | 7.11M ops/s | 7.38M ops/s | +3.8% | 1.04x |
| expression-medium-or | full-execution-true | 7.19M ops/s | 7.66M ops/s | +6.5% | 1.06x |
| expression-date-arithmetic | full-execution-true | 322.39K ops/s | 350.25K ops/s | +8.6% | 1.09x |
| expression-date-arithmetic | partial-true | 321.11K ops/s | 349.03K ops/s | +8.7% | 1.09x |
| expression-medium-or | late-true | 6.97M ops/s | 7.66M ops/s | +9.9% | 1.10x |
| expression-deep-nested | full-execution-false | 3.15M ops/s | 3.58M ops/s | +13.5% | 1.14x |
| expression-deep-nested | late-true | 3.13M ops/s | 3.57M ops/s | +14.1% | 1.14x |
| expression-deep-nested | empty-context | 11.17M ops/s | 13.37M ops/s | +19.7% | 1.20x |
| expression-reference-nested | complete-false | 10.20M ops/s | 12.51M ops/s | +22.6% | 1.23x |
| expression-deep-nested | complete-false | 10.16M ops/s | 12.49M ops/s | +23.0% | 1.23x |
| expression-reference-nested | full-execution-false | 5.60M ops/s | 6.95M ops/s | +24.1% | 1.24x |
| expression-deep-nested | partial-false | 11.18M ops/s | 14.08M ops/s | +25.9% | 1.26x |
| expression-reference-nested | empty-context | 11.36M ops/s | 14.54M ops/s | +27.9% | 1.28x |
| expression-reference-nested | partial-false | 11.17M ops/s | 14.46M ops/s | +29.5% | 1.29x |

### Regressions

_No regressions._

