# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-baseline.json`
**Improved:** `results-synthetic-evaluate-current.json`
**Total cases compared:** 82

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 74 |
| Slower (>-5%) | 1 |
| Unchanged | 7 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n1026-r1000-10x | full-execution-true | 30.73K ops/s | 17.48M ops/s | +56774.4% | 568.74x |
| overlap-n1026-r1000-10x | complete-true | 30.91K ops/s | 17.24M ops/s | +55688.1% | 557.88x |
| overlap-n1026-r1000-10x | partial-true | 41.35K ops/s | 17.81M ops/s | +42970.1% | 430.70x |
| overlap-n526-r500-5x | full-execution-true | 65.36K ops/s | 18.12M ops/s | +27618.6% | 277.19x |
| overlap-n526-r500-5x | complete-true | 65.02K ops/s | 17.44M ops/s | +26724.5% | 268.24x |
| overlap-n526-r500-5x | partial-true | 86.91K ops/s | 17.73M ops/s | +20303.0% | 204.03x |
| in-n1224-r1-10x | full-execution-false | 156.87K ops/s | 23.29M ops/s | +14744.8% | 148.45x |
| in-n1224-r1-10x | complete-false | 157.79K ops/s | 23.09M ops/s | +14535.1% | 146.35x |
| in-n1224-r1-10x | partial-false | 178.11K ops/s | 24.00M ops/s | +13373.4% | 134.73x |
| in-n1224-r1-10x | empty-context | 179.55K ops/s | 23.77M ops/s | +13138.5% | 132.39x |
| in-n1224-r1-10x | partial-true | 179.60K ops/s | 22.19M ops/s | +12256.1% | 123.56x |
| in-n1224-r1-10x | full-execution-true | 178.09K ops/s | 21.54M ops/s | +11996.2% | 120.96x |
| in-n1224-r1-10x | complete-true | 179.96K ops/s | 21.58M ops/s | +11889.1% | 119.89x |
| in-n614-r1-5x | partial-false | 354.74K ops/s | 23.66M ops/s | +6570.0% | 66.70x |
| in-n614-r1-5x | empty-context | 354.24K ops/s | 23.61M ops/s | +6566.2% | 66.66x |
| in-n614-r1-5x | complete-false | 322.65K ops/s | 21.10M ops/s | +6440.0% | 65.40x |
| in-n614-r1-5x | full-execution-false | 325.73K ops/s | 20.18M ops/s | +6096.5% | 61.96x |
| in-n614-r1-5x | full-execution-true | 354.36K ops/s | 21.49M ops/s | +5963.1% | 60.63x |
| in-n614-r1-5x | partial-true | 353.20K ops/s | 21.31M ops/s | +5933.7% | 60.34x |
| in-n614-r1-5x | complete-true | 355.72K ops/s | 20.91M ops/s | +5778.5% | 58.78x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | full-execution-true | 15.19M ops/s | 12.88M ops/s | -15.2% | 0.85x |
| expression-simple-eq | complete-false | 22.96M ops/s | 23.60M ops/s | +2.8% | 1.03x |
| expression-simple-eq | full-execution-false | 22.80M ops/s | 23.57M ops/s | +3.4% | 1.03x |
| expression-simple-eq | full-execution-true | 22.88M ops/s | 23.86M ops/s | +4.3% | 1.04x |
| expression-simple-eq | partial-true | 22.85M ops/s | 23.84M ops/s | +4.3% | 1.04x |
| expression-simple-eq | complete-true | 22.76M ops/s | 23.86M ops/s | +4.8% | 1.05x |
| expression-simple-ne | empty-context | 22.69M ops/s | 23.80M ops/s | +4.9% | 1.05x |
| expression-simple-ne | complete-true | 22.83M ops/s | 23.96M ops/s | +4.9% | 1.05x |
| expression-simple-eq | partial-false | 22.79M ops/s | 24.06M ops/s | +5.6% | 1.06x |
| expression-simple-eq | empty-context | 22.66M ops/s | 24.01M ops/s | +6.0% | 1.06x |
| expression-simple-ne | full-execution-true | 22.76M ops/s | 24.19M ops/s | +6.3% | 1.06x |
| expression-medium-or | complete-true | 22.15M ops/s | 23.57M ops/s | +6.4% | 1.06x |
| expression-simple-ne | partial-true | 22.57M ops/s | 24.38M ops/s | +8.0% | 1.08x |
| expression-medium-or | partial-true | 21.77M ops/s | 23.64M ops/s | +8.6% | 1.09x |
| expression-medium-and | complete-false | 21.04M ops/s | 23.26M ops/s | +10.6% | 1.11x |
| expression-medium-or | empty-context | 10.57M ops/s | 11.84M ops/s | +12.1% | 1.12x |
| expression-medium-and | partial-false | 20.88M ops/s | 23.56M ops/s | +12.8% | 1.13x |
| expression-complex-nested | complete-false | 20.73M ops/s | 23.40M ops/s | +12.9% | 1.13x |
| expression-medium-or | partial-false | 10.42M ops/s | 11.87M ops/s | +14.0% | 1.14x |
| expression-reference-nested | partial-false | 20.57M ops/s | 23.46M ops/s | +14.1% | 1.14x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | full-execution-true | 15.19M ops/s | 12.88M ops/s | -15.2% | 0.85x |

