# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 87

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 56 |
| Slower (>-5%) | 27 |
| Unchanged | 4 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| in-n1224-r1-10x | full-execution-false | 101.17K ops/s | 10.31M ops/s | +10095.6% | 101.96x |
| in-n1224-r1-10x | complete-false | 101.63K ops/s | 10.26M ops/s | +9998.4% | 100.98x |
| in-n1224-r1-10x | full-execution-true | 108.61K ops/s | 9.69M ops/s | +8820.3% | 89.20x |
| in-n1224-r1-10x | complete-true | 109.35K ops/s | 9.72M ops/s | +8787.6% | 88.88x |
| in-n1224-r1-10x | partial-true | 110.09K ops/s | 9.72M ops/s | +8731.4% | 88.31x |
| in-n1224-r1-10x | empty-context | 110.00K ops/s | 8.87M ops/s | +7961.6% | 80.62x |
| in-n1224-r1-10x | partial-false | 110.00K ops/s | 8.74M ops/s | +7845.0% | 79.45x |
| in-n614-r1-5x | complete-false | 192.02K ops/s | 10.28M ops/s | +5251.5% | 53.52x |
| in-n614-r1-5x | full-execution-false | 194.54K ops/s | 10.29M ops/s | +5190.0% | 52.90x |
| in-n614-r1-5x | complete-true | 205.91K ops/s | 10.24M ops/s | +4875.3% | 49.75x |
| in-n614-r1-5x | full-execution-true | 208.86K ops/s | 10.28M ops/s | +4822.4% | 49.22x |
| in-n614-r1-5x | partial-true | 210.19K ops/s | 10.23M ops/s | +4768.3% | 48.68x |
| in-n614-r1-5x | empty-context | 205.44K ops/s | 8.80M ops/s | +4182.8% | 42.83x |
| in-n614-r1-5x | partial-false | 206.67K ops/s | 8.79M ops/s | +4152.2% | 42.52x |
| overlap-n447-r50-10x | empty-context | 329.18K ops/s | 9.43M ops/s | +2766.2% | 28.66x |
| overlap-n447-r50-10x | partial-false | 328.79K ops/s | 9.32M ops/s | +2734.5% | 28.35x |
| overlap-n447-r50-10x | complete-true | 325.87K ops/s | 8.92M ops/s | +2637.7% | 27.38x |
| overlap-n447-r50-10x | full-execution-true | 326.24K ops/s | 8.90M ops/s | +2629.5% | 27.29x |
| overlap-n447-r50-10x | partial-true | 324.81K ops/s | 8.30M ops/s | +2454.6% | 25.55x |
| overlap-n447-r50-10x | complete-false | 65.43K ops/s | 1.17M ops/s | +1692.5% | 17.92x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | partial-true | 10.32M ops/s | 7.09M ops/s | -31.3% | 0.69x |
| expression-medium-or | complete-true | 10.19M ops/s | 7.11M ops/s | -30.3% | 0.70x |
| expression-reference-nested | complete-false | 9.24M ops/s | 6.70M ops/s | -27.5% | 0.72x |
| expression-medium-and | complete-false | 9.93M ops/s | 7.21M ops/s | -27.4% | 0.73x |
| expression-date-arithmetic | complete-false | 9.90M ops/s | 7.38M ops/s | -25.5% | 0.75x |
| expression-complex-nested | complete-false | 9.63M ops/s | 7.18M ops/s | -25.4% | 0.75x |
| expression-deep-nested | complete-false | 8.95M ops/s | 6.74M ops/s | -24.7% | 0.75x |
| expression-simple-eq | complete-false | 12.86M ops/s | 9.90M ops/s | -23.0% | 0.77x |
| expression-simple-ne | complete-true | 13.16M ops/s | 10.24M ops/s | -22.1% | 0.78x |
| expression-reference-nested | full-execution-false | 5.25M ops/s | 4.15M ops/s | -20.8% | 0.79x |
| expression-simple-eq | complete-true | 12.93M ops/s | 10.29M ops/s | -20.4% | 0.80x |
| expression-simple-eq | full-execution-true | 13.01M ops/s | 10.35M ops/s | -20.4% | 0.80x |
| expression-simple-eq | partial-true | 12.84M ops/s | 10.24M ops/s | -20.3% | 0.80x |
| expression-simple-eq | full-execution-false | 12.76M ops/s | 10.19M ops/s | -20.2% | 0.80x |
| expression-simple-ne | empty-context | 9.74M ops/s | 8.22M ops/s | -15.6% | 0.84x |
| expression-simple-eq | partial-false | 9.68M ops/s | 8.19M ops/s | -15.4% | 0.85x |
| expression-simple-ne | full-execution-true | 9.93M ops/s | 8.45M ops/s | -14.9% | 0.85x |
| expression-simple-eq | empty-context | 9.60M ops/s | 8.23M ops/s | -14.3% | 0.86x |
| expression-medium-or | complete-false | 4.56M ops/s | 3.95M ops/s | -13.5% | 0.87x |
| expression-simple-ne | partial-true | 9.53M ops/s | 8.26M ops/s | -13.3% | 0.87x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | partial-true | 10.32M ops/s | 7.09M ops/s | -31.3% | 0.69x |
| expression-medium-or | complete-true | 10.19M ops/s | 7.11M ops/s | -30.3% | 0.70x |
| expression-reference-nested | complete-false | 9.24M ops/s | 6.70M ops/s | -27.5% | 0.72x |
| expression-medium-and | complete-false | 9.93M ops/s | 7.21M ops/s | -27.4% | 0.73x |
| expression-date-arithmetic | complete-false | 9.90M ops/s | 7.38M ops/s | -25.5% | 0.75x |
| expression-complex-nested | complete-false | 9.63M ops/s | 7.18M ops/s | -25.4% | 0.75x |
| expression-deep-nested | complete-false | 8.95M ops/s | 6.74M ops/s | -24.7% | 0.75x |
| expression-simple-eq | complete-false | 12.86M ops/s | 9.90M ops/s | -23.0% | 0.77x |
| expression-simple-ne | complete-true | 13.16M ops/s | 10.24M ops/s | -22.1% | 0.78x |
| expression-reference-nested | full-execution-false | 5.25M ops/s | 4.15M ops/s | -20.8% | 0.79x |
| expression-simple-eq | complete-true | 12.93M ops/s | 10.29M ops/s | -20.4% | 0.80x |
| expression-simple-eq | full-execution-true | 13.01M ops/s | 10.35M ops/s | -20.4% | 0.80x |
| expression-simple-eq | partial-true | 12.84M ops/s | 10.24M ops/s | -20.3% | 0.80x |
| expression-simple-eq | full-execution-false | 12.76M ops/s | 10.19M ops/s | -20.2% | 0.80x |
| expression-simple-ne | empty-context | 9.74M ops/s | 8.22M ops/s | -15.6% | 0.84x |
| expression-simple-eq | partial-false | 9.68M ops/s | 8.19M ops/s | -15.4% | 0.85x |
| expression-simple-ne | full-execution-true | 9.93M ops/s | 8.45M ops/s | -14.9% | 0.85x |
| expression-simple-eq | empty-context | 9.60M ops/s | 8.23M ops/s | -14.3% | 0.86x |
| expression-medium-or | complete-false | 4.56M ops/s | 3.95M ops/s | -13.5% | 0.87x |
| expression-simple-ne | partial-true | 9.53M ops/s | 8.26M ops/s | -13.3% | 0.87x |
| expression-medium-or | full-execution-true | 4.56M ops/s | 3.98M ops/s | -12.7% | 0.87x |
| expression-medium-or | full-execution-false | 4.54M ops/s | 3.96M ops/s | -12.7% | 0.87x |
| expression-deep-nested | full-execution-false | 2.45M ops/s | 2.17M ops/s | -11.5% | 0.88x |
| expression-medium-and | full-execution-false | 3.43M ops/s | 3.11M ops/s | -9.3% | 0.91x |
| expression-arithmetic | full-execution-false | 2.51M ops/s | 2.33M ops/s | -7.3% | 0.93x |
| expression-arithmetic | partial-false | 2.48M ops/s | 2.33M ops/s | -5.9% | 0.94x |
| expression-arithmetic | empty-context | 2.47M ops/s | 2.32M ops/s | -5.9% | 0.94x |

