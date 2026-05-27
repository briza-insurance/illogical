# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-oop.json`
**Improved:** `results-synthetic-evaluate-bytecode.json`
**Total cases compared:** 101

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 94 |
| Slower (>-5%) | 0 |
| Unchanged | 7 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n1026-r1000-10x | early-true | 22.48K ops/s | 10.89M ops/s | +48340.9% | 484.41x |
| overlap-n1026-r1000-10x | complete-true | 24.06K ops/s | 11.01M ops/s | +45646.8% | 457.47x |
| overlap-n1026-r1000-10x | full-execution-true | 24.27K ops/s | 10.92M ops/s | +44869.3% | 449.69x |
| overlap-n1026-r1000-10x | partial-true | 35.26K ops/s | 11.11M ops/s | +31401.9% | 315.02x |
| overlap-n526-r500-5x | full-execution-true | 49.32K ops/s | 11.36M ops/s | +22941.4% | 230.41x |
| overlap-n526-r500-5x | early-true | 48.79K ops/s | 11.05M ops/s | +22542.3% | 226.42x |
| overlap-n526-r500-5x | complete-true | 51.51K ops/s | 11.48M ops/s | +22189.1% | 222.89x |
| overlap-n526-r500-5x | partial-true | 71.88K ops/s | 11.54M ops/s | +15960.5% | 160.61x |
| in-n1224-r1-10x | late-true | 179.34K ops/s | 21.38M ops/s | +11818.8% | 119.19x |
| in-n1224-r1-10x | complete-false | 185.92K ops/s | 21.66M ops/s | +11548.0% | 116.48x |
| in-n1224-r1-10x | full-execution-false | 186.66K ops/s | 21.68M ops/s | +11516.1% | 116.16x |
| in-n1224-r1-10x | partial-false | 232.76K ops/s | 22.39M ops/s | +9519.8% | 96.20x |
| in-n1224-r1-10x | empty-context | 235.22K ops/s | 21.85M ops/s | +9190.6% | 92.91x |
| in-n1224-r1-10x | partial-true | 232.43K ops/s | 20.25M ops/s | +8614.0% | 87.14x |
| in-n1224-r1-10x | complete-true | 234.39K ops/s | 20.36M ops/s | +8584.5% | 86.85x |
| in-n1224-r1-10x | early-true | 235.08K ops/s | 20.40M ops/s | +8575.9% | 86.76x |
| in-n1224-r1-10x | full-execution-true | 234.01K ops/s | 20.19M ops/s | +8529.5% | 86.30x |
| in-n614-r1-5x | late-true | 356.20K ops/s | 20.79M ops/s | +5736.6% | 58.37x |
| in-n614-r1-5x | full-execution-false | 369.94K ops/s | 20.55M ops/s | +5455.0% | 55.55x |
| in-n614-r1-5x | complete-false | 374.55K ops/s | 20.72M ops/s | +5432.7% | 55.33x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | partial-true | 17.18M ops/s | 16.61M ops/s | -3.3% | 0.97x |
| expression-medium-or | complete-true | 17.10M ops/s | 17.04M ops/s | -0.4% | 1.00x |
| expression-medium-or | early-true | 16.92M ops/s | 16.93M ops/s | +0.1% | 1.00x |
| expression-medium-or | full-execution-false | 7.32M ops/s | 7.55M ops/s | +3.1% | 1.03x |
| expression-medium-or | complete-false | 7.30M ops/s | 7.55M ops/s | +3.5% | 1.04x |
| expression-medium-or | empty-context | 7.18M ops/s | 7.44M ops/s | +3.7% | 1.04x |
| expression-medium-or | partial-false | 7.09M ops/s | 7.42M ops/s | +4.6% | 1.05x |
| expression-deep-nested | late-true | 3.16M ops/s | 3.34M ops/s | +5.4% | 1.05x |
| expression-deep-nested | full-execution-false | 3.15M ops/s | 3.34M ops/s | +6.0% | 1.06x |
| expression-medium-or | full-execution-true | 7.02M ops/s | 7.58M ops/s | +7.9% | 1.08x |
| expression-medium-or | late-true | 6.80M ops/s | 7.49M ops/s | +10.1% | 1.10x |
| expression-reference-nested | complete-false | 10.33M ops/s | 12.42M ops/s | +20.2% | 1.20x |
| expression-reference-nested | full-execution-false | 5.65M ops/s | 6.87M ops/s | +21.8% | 1.22x |
| expression-reference-nested | partial-false | 11.08M ops/s | 13.55M ops/s | +22.3% | 1.22x |
| expression-reference-nested | empty-context | 11.01M ops/s | 13.49M ops/s | +22.5% | 1.22x |
| expression-deep-nested | partial-false | 11.12M ops/s | 14.03M ops/s | +26.2% | 1.26x |
| expression-deep-nested | complete-false | 10.20M ops/s | 12.95M ops/s | +26.9% | 1.27x |
| expression-deep-nested | empty-context | 11.15M ops/s | 14.23M ops/s | +27.7% | 1.28x |
| expression-arithmetic | full-execution-false | 8.55M ops/s | 11.85M ops/s | +38.6% | 1.39x |
| expression-arithmetic | partial-false | 8.24M ops/s | 11.46M ops/s | +39.2% | 1.39x |

### Regressions

_No regressions._

