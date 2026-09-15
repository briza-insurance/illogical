# Benchmark Comparison Report — parse

**Baseline:** `results-synthetic-parse-oop.json`
**Improved:** `results-synthetic-parse-bytecode.json`
**Total cases compared:** 87

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 10 |
| Slower (>-5%) | 11 |
| Unchanged | 66 |

---

## parse

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-date-arithmetic | empty-context | 529.56K ops/s | 640.76K ops/s | +21.0% | 1.21x |
| expression-medium-or | partial-true | 1.36M ops/s | 1.52M ops/s | +11.9% | 1.12x |
| overlap-n526-r500-5x | partial-true | 112.31K ops/s | 123.96K ops/s | +10.4% | 1.10x |
| expression-reference-nested | empty-context | 1.39M ops/s | 1.48M ops/s | +6.6% | 1.07x |
| overlap-n526-r500-5x | partial-false | 116.85K ops/s | 124.23K ops/s | +6.3% | 1.06x |
| overlap-n526-r500-5x | complete-true | 117.39K ops/s | 124.44K ops/s | +6.0% | 1.06x |
| expression-deep-nested | empty-context | 84.66K ops/s | 89.61K ops/s | +5.8% | 1.06x |
| expression-deep-nested | full-execution-false | 85.01K ops/s | 89.82K ops/s | +5.7% | 1.06x |
| overlap-n526-r500-5x | complete-false | 116.93K ops/s | 123.51K ops/s | +5.6% | 1.06x |
| overlap-n252-r25-5x | empty-context | 79.43K ops/s | 83.46K ops/s | +5.1% | 1.05x |
| expression-medium-or | partial-false | 1.44M ops/s | 1.51M ops/s | +4.3% | 1.04x |
| expression-medium-or | complete-false | 1.45M ops/s | 1.51M ops/s | +4.1% | 1.04x |
| overlap-n526-r500-5x | full-execution-false | 117.70K ops/s | 122.44K ops/s | +4.0% | 1.04x |
| overlap-n526-r500-5x | empty-context | 118.17K ops/s | 122.76K ops/s | +3.9% | 1.04x |
| overlap-n526-r500-5x | full-execution-true | 119.17K ops/s | 123.70K ops/s | +3.8% | 1.04x |
| overlap-n447-r50-10x | full-execution-false | 45.93K ops/s | 47.59K ops/s | +3.6% | 1.04x |
| overlap-n252-r25-5x | full-execution-true | 80.56K ops/s | 82.72K ops/s | +2.7% | 1.03x |
| expression-medium-or | full-execution-false | 1.50M ops/s | 1.53M ops/s | +2.0% | 1.02x |
| overlap-n1026-r1000-10x | full-execution-false | 83.33K ops/s | 84.73K ops/s | +1.7% | 1.02x |
| overlap-n1026-r1000-10x | empty-context | 83.11K ops/s | 84.33K ops/s | +1.5% | 1.01x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-and | partial-false | 1.20M ops/s | 998.87K ops/s | -16.9% | 0.83x |
| expression-simple-ne | partial-true | 5.17M ops/s | 4.33M ops/s | -16.1% | 0.84x |
| expression-simple-ne | complete-true | 5.05M ops/s | 4.31M ops/s | -14.7% | 0.85x |
| expression-simple-eq | full-execution-true | 5.05M ops/s | 4.41M ops/s | -12.7% | 0.87x |
| expression-simple-ne | full-execution-true | 4.96M ops/s | 4.33M ops/s | -12.6% | 0.87x |
| expression-simple-eq | full-execution-false | 5.04M ops/s | 4.41M ops/s | -12.4% | 0.88x |
| expression-simple-eq | partial-false | 5.02M ops/s | 4.40M ops/s | -12.3% | 0.88x |
| expression-simple-ne | empty-context | 4.92M ops/s | 4.34M ops/s | -11.7% | 0.88x |
| expression-simple-eq | empty-context | 4.89M ops/s | 4.34M ops/s | -11.3% | 0.89x |
| expression-simple-eq | partial-true | 4.95M ops/s | 4.39M ops/s | -11.3% | 0.89x |
| in-n1224-r1-10x | complete-true | 15.59K ops/s | 14.45K ops/s | -7.3% | 0.93x |
| in-n1224-r1-10x | complete-false | 15.77K ops/s | 15.04K ops/s | -4.6% | 0.95x |
| expression-medium-and | complete-false | 1.20M ops/s | 1.15M ops/s | -4.5% | 0.96x |
| in-n614-r1-5x | complete-true | 31.88K ops/s | 30.48K ops/s | -4.4% | 0.96x |
| in-n614-r1-5x | complete-false | 31.79K ops/s | 30.45K ops/s | -4.2% | 0.96x |
| in-n614-r1-5x | partial-true | 31.48K ops/s | 30.18K ops/s | -4.1% | 0.96x |
| in-n1224-r1-10x | full-execution-true | 15.87K ops/s | 15.21K ops/s | -4.1% | 0.96x |
| expression-medium-and | full-execution-false | 1.21M ops/s | 1.17M ops/s | -3.9% | 0.96x |
| expression-reference-nested | partial-false | 1.54M ops/s | 1.48M ops/s | -3.8% | 0.96x |
| in-n614-r1-5x | full-execution-true | 31.47K ops/s | 30.31K ops/s | -3.7% | 0.96x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-and | partial-false | 1.20M ops/s | 998.87K ops/s | -16.9% | 0.83x |
| expression-simple-ne | partial-true | 5.17M ops/s | 4.33M ops/s | -16.1% | 0.84x |
| expression-simple-ne | complete-true | 5.05M ops/s | 4.31M ops/s | -14.7% | 0.85x |
| expression-simple-eq | full-execution-true | 5.05M ops/s | 4.41M ops/s | -12.7% | 0.87x |
| expression-simple-ne | full-execution-true | 4.96M ops/s | 4.33M ops/s | -12.6% | 0.87x |
| expression-simple-eq | full-execution-false | 5.04M ops/s | 4.41M ops/s | -12.4% | 0.88x |
| expression-simple-eq | partial-false | 5.02M ops/s | 4.40M ops/s | -12.3% | 0.88x |
| expression-simple-ne | empty-context | 4.92M ops/s | 4.34M ops/s | -11.7% | 0.88x |
| expression-simple-eq | empty-context | 4.89M ops/s | 4.34M ops/s | -11.3% | 0.89x |
| expression-simple-eq | partial-true | 4.95M ops/s | 4.39M ops/s | -11.3% | 0.89x |
| in-n1224-r1-10x | complete-true | 15.59K ops/s | 14.45K ops/s | -7.3% | 0.93x |

