# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 87

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 68 |
| Slower (>-5%) | 4 |
| Unchanged | 15 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| in-n1224-r1-10x | full-execution-false | 87.40K ops/s | 9.98M ops/s | +11322.9% | 114.23x |
| in-n1224-r1-10x | complete-false | 87.29K ops/s | 9.90M ops/s | +11239.3% | 113.39x |
| in-n1224-r1-10x | partial-true | 93.27K ops/s | 9.44M ops/s | +10020.4% | 101.20x |
| in-n1224-r1-10x | full-execution-true | 94.25K ops/s | 9.54M ops/s | +10019.5% | 101.19x |
| in-n1224-r1-10x | complete-true | 94.38K ops/s | 9.45M ops/s | +9913.4% | 100.13x |
| in-n1224-r1-10x | partial-false | 91.13K ops/s | 8.49M ops/s | +9219.1% | 93.19x |
| in-n1224-r1-10x | empty-context | 92.10K ops/s | 8.36M ops/s | +8973.5% | 90.73x |
| in-n614-r1-5x | full-execution-false | 173.54K ops/s | 9.95M ops/s | +5631.7% | 57.32x |
| in-n614-r1-5x | complete-false | 173.99K ops/s | 9.91M ops/s | +5597.3% | 56.97x |
| in-n614-r1-5x | complete-true | 184.68K ops/s | 9.16M ops/s | +4862.5% | 49.63x |
| in-n614-r1-5x | full-execution-true | 188.22K ops/s | 9.25M ops/s | +4815.3% | 49.15x |
| in-n614-r1-5x | partial-true | 191.20K ops/s | 9.20M ops/s | +4712.0% | 48.12x |
| in-n614-r1-5x | partial-false | 187.15K ops/s | 8.42M ops/s | +4398.6% | 44.99x |
| in-n614-r1-5x | empty-context | 187.87K ops/s | 8.41M ops/s | +4377.2% | 44.77x |
| overlap-n447-r50-10x | empty-context | 289.75K ops/s | 9.00M ops/s | +3007.5% | 31.07x |
| overlap-n447-r50-10x | partial-false | 289.49K ops/s | 8.94M ops/s | +2987.6% | 30.88x |
| overlap-n447-r50-10x | full-execution-true | 287.12K ops/s | 7.90M ops/s | +2650.7% | 27.51x |
| overlap-n447-r50-10x | complete-true | 285.62K ops/s | 7.85M ops/s | +2647.7% | 27.48x |
| overlap-n447-r50-10x | partial-true | 285.31K ops/s | 7.74M ops/s | +2612.9% | 27.13x |
| overlap-n447-r50-10x | complete-false | 45.29K ops/s | 832.03K ops/s | +1737.2% | 18.37x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-simple-ne | empty-context | 8.62M ops/s | 7.79M ops/s | -9.7% | 0.90x |
| expression-simple-ne | partial-true | 8.48M ops/s | 7.87M ops/s | -7.2% | 0.93x |
| expression-medium-or | partial-true | 8.08M ops/s | 7.50M ops/s | -7.2% | 0.93x |
| expression-medium-or | complete-true | 8.00M ops/s | 7.52M ops/s | -6.1% | 0.94x |
| expression-simple-ne | full-execution-true | 8.54M ops/s | 8.15M ops/s | -4.7% | 0.95x |
| expression-date-arithmetic | partial-true | 305.12K ops/s | 291.06K ops/s | -4.6% | 0.95x |
| expression-simple-eq | partial-false | 8.24M ops/s | 7.91M ops/s | -4.1% | 0.96x |
| expression-simple-eq | empty-context | 8.17M ops/s | 7.87M ops/s | -3.7% | 0.96x |
| expression-simple-eq | full-execution-true | 10.03M ops/s | 9.78M ops/s | -2.6% | 0.97x |
| expression-date-arithmetic | full-execution-true | 297.83K ops/s | 291.09K ops/s | -2.3% | 0.98x |
| expression-simple-ne | complete-true | 10.30M ops/s | 10.16M ops/s | -1.4% | 0.99x |
| expression-reference-nested | complete-false | 7.30M ops/s | 7.21M ops/s | -1.2% | 0.99x |
| expression-deep-nested | complete-false | 7.32M ops/s | 7.23M ops/s | -1.1% | 0.99x |
| expression-simple-eq | partial-true | 10.09M ops/s | 10.17M ops/s | +0.9% | 1.01x |
| expression-medium-and | complete-false | 7.71M ops/s | 7.78M ops/s | +0.9% | 1.01x |
| expression-simple-eq | complete-false | 9.94M ops/s | 10.07M ops/s | +1.4% | 1.01x |
| expression-simple-eq | complete-true | 10.03M ops/s | 10.18M ops/s | +1.5% | 1.01x |
| expression-date-arithmetic | complete-false | 7.75M ops/s | 7.86M ops/s | +1.5% | 1.02x |
| expression-simple-eq | full-execution-false | 9.76M ops/s | 9.98M ops/s | +2.3% | 1.02x |
| expression-complex-nested | complete-false | 7.38M ops/s | 7.77M ops/s | +5.2% | 1.05x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-simple-ne | empty-context | 8.62M ops/s | 7.79M ops/s | -9.7% | 0.90x |
| expression-simple-ne | partial-true | 8.48M ops/s | 7.87M ops/s | -7.2% | 0.93x |
| expression-medium-or | partial-true | 8.08M ops/s | 7.50M ops/s | -7.2% | 0.93x |
| expression-medium-or | complete-true | 8.00M ops/s | 7.52M ops/s | -6.1% | 0.94x |

