# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 82

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 69 |
| Slower (>-5%) | 9 |
| Unchanged | 4 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| in-n1224-r1-10x | empty-context | 116.21K ops/s | 15.68M ops/s | +13390.3% | 134.90x |
| in-n1224-r1-10x | partial-false | 122.77K ops/s | 16.20M ops/s | +13091.7% | 131.92x |
| in-n1224-r1-10x | complete-false | 114.71K ops/s | 14.78M ops/s | +12782.6% | 128.83x |
| in-n1224-r1-10x | full-execution-false | 115.35K ops/s | 14.70M ops/s | +12648.5% | 127.48x |
| in-n1224-r1-10x | partial-true | 123.01K ops/s | 12.81M ops/s | +10310.8% | 104.11x |
| in-n1224-r1-10x | complete-true | 122.61K ops/s | 12.46M ops/s | +10060.2% | 101.60x |
| in-n1224-r1-10x | full-execution-true | 123.05K ops/s | 12.36M ops/s | +9941.8% | 100.42x |
| in-n614-r1-5x | partial-false | 227.82K ops/s | 15.73M ops/s | +6804.7% | 69.05x |
| in-n614-r1-5x | complete-false | 215.41K ops/s | 14.36M ops/s | +6567.2% | 66.67x |
| in-n614-r1-5x | empty-context | 238.92K ops/s | 15.61M ops/s | +6433.8% | 65.34x |
| in-n614-r1-5x | full-execution-false | 222.75K ops/s | 14.13M ops/s | +6243.5% | 63.43x |
| in-n614-r1-5x | complete-true | 224.64K ops/s | 14.07M ops/s | +6163.6% | 62.64x |
| in-n614-r1-5x | full-execution-true | 234.89K ops/s | 13.99M ops/s | +5857.5% | 59.58x |
| in-n614-r1-5x | partial-true | 228.18K ops/s | 13.27M ops/s | +5717.2% | 58.17x |
| overlap-n447-r50-10x | empty-context | 353.42K ops/s | 13.14M ops/s | +3619.2% | 37.19x |
| overlap-n447-r50-10x | partial-false | 383.65K ops/s | 14.05M ops/s | +3562.5% | 36.62x |
| overlap-n447-r50-10x | complete-true | 370.78K ops/s | 12.04M ops/s | +3146.4% | 32.46x |
| overlap-n447-r50-10x | partial-true | 381.35K ops/s | 11.43M ops/s | +2898.1% | 29.98x |
| overlap-n447-r50-10x | full-execution-true | 380.80K ops/s | 11.05M ops/s | +2801.0% | 29.01x |
| overlap-n252-r25-5x | empty-context | 684.45K ops/s | 14.27M ops/s | +1984.3% | 20.84x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | complete-true | 12.62M ops/s | 11.18M ops/s | -11.4% | 0.89x |
| expression-simple-eq | partial-true | 15.95M ops/s | 14.24M ops/s | -10.7% | 0.89x |
| expression-simple-ne | complete-true | 16.43M ops/s | 14.71M ops/s | -10.5% | 0.90x |
| expression-simple-eq | full-execution-true | 16.17M ops/s | 14.61M ops/s | -9.7% | 0.90x |
| expression-simple-eq | complete-true | 16.30M ops/s | 14.80M ops/s | -9.2% | 0.91x |
| expression-medium-or | partial-true | 12.17M ops/s | 11.17M ops/s | -8.2% | 0.92x |
| expression-reference-nested | complete-false | 11.09M ops/s | 10.41M ops/s | -6.2% | 0.94x |
| expression-reference-nested | full-execution-false | 6.39M ops/s | 6.01M ops/s | -6.0% | 0.94x |
| expression-medium-and | complete-false | 11.77M ops/s | 11.17M ops/s | -5.1% | 0.95x |
| expression-simple-eq | complete-false | 15.74M ops/s | 15.00M ops/s | -4.7% | 0.95x |
| expression-deep-nested | complete-false | 11.16M ops/s | 10.68M ops/s | -4.3% | 0.96x |
| expression-simple-eq | full-execution-false | 15.57M ops/s | 14.95M ops/s | -4.0% | 0.96x |
| expression-complex-nested | complete-false | 11.14M ops/s | 10.87M ops/s | -2.4% | 0.98x |
| expression-simple-ne | full-execution-true | 14.30M ops/s | 15.71M ops/s | +9.8% | 1.10x |
| expression-medium-or | complete-false | 5.42M ops/s | 6.09M ops/s | +12.4% | 1.12x |
| expression-medium-or | full-execution-false | 5.37M ops/s | 6.09M ops/s | +13.4% | 1.13x |
| expression-medium-and | full-execution-false | 4.33M ops/s | 4.93M ops/s | +13.8% | 1.14x |
| expression-simple-ne | empty-context | 13.47M ops/s | 15.35M ops/s | +14.0% | 1.14x |
| expression-simple-eq | partial-false | 13.78M ops/s | 15.76M ops/s | +14.3% | 1.14x |
| expression-medium-or | full-execution-true | 5.30M ops/s | 6.06M ops/s | +14.4% | 1.14x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | complete-true | 12.62M ops/s | 11.18M ops/s | -11.4% | 0.89x |
| expression-simple-eq | partial-true | 15.95M ops/s | 14.24M ops/s | -10.7% | 0.89x |
| expression-simple-ne | complete-true | 16.43M ops/s | 14.71M ops/s | -10.5% | 0.90x |
| expression-simple-eq | full-execution-true | 16.17M ops/s | 14.61M ops/s | -9.7% | 0.90x |
| expression-simple-eq | complete-true | 16.30M ops/s | 14.80M ops/s | -9.2% | 0.91x |
| expression-medium-or | partial-true | 12.17M ops/s | 11.17M ops/s | -8.2% | 0.92x |
| expression-reference-nested | complete-false | 11.09M ops/s | 10.41M ops/s | -6.2% | 0.94x |
| expression-reference-nested | full-execution-false | 6.39M ops/s | 6.01M ops/s | -6.0% | 0.94x |
| expression-medium-and | complete-false | 11.77M ops/s | 11.17M ops/s | -5.1% | 0.95x |

