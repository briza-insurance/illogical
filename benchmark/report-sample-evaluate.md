# Benchmark Comparison Report — evaluate

**Baseline:** `results-sample-evaluate-oop.json`
**Improved:** `results-sample-evaluate-bytecode.json`
**Total cases compared:** 765

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 765 |
| Slower (>-5%) | 0 |
| Unchanged | 0 |

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n4691-r2-001 | full-execution-true | 65.22K ops/s | 13.99M ops/s | +21352.4% | 214.52x |
| or-n4691-r2-001 | late-true | 64.29K ops/s | 13.51M ops/s | +20919.5% | 210.19x |
| or-n4691-r2-001 | full-execution-false | 65.40K ops/s | 13.35M ops/s | +20315.6% | 204.16x |
| or-n4691-r2-001 | partial-false | 103.15K ops/s | 20.20M ops/s | +19480.1% | 195.80x |
| or-n4691-r2-001 | empty-context | 103.69K ops/s | 19.32M ops/s | +18534.3% | 186.34x |
| or-n3412-r101-001 | complete-true | 103.35K ops/s | 18.48M ops/s | +17783.4% | 178.83x |
| or-n3412-r101-001 | early-true | 103.88K ops/s | 17.80M ops/s | +17032.3% | 171.32x |
| or-n3412-r101-001 | partial-true | 110.67K ops/s | 18.55M ops/s | +16663.1% | 167.63x |
| or-n4691-r2-001 | complete-false | 84.85K ops/s | 10.81M ops/s | +12640.6% | 127.41x |
| or-n1968-r105-001 | complete-true | 142.00K ops/s | 17.15M ops/s | +11980.2% | 120.80x |
| or-n1968-r105-001 | early-true | 145.76K ops/s | 17.34M ops/s | +11795.1% | 118.95x |
| or-n1968-r105-001 | partial-true | 161.54K ops/s | 16.35M ops/s | +10018.7% | 101.19x |
| or-n3730-r105-001 | complete-true | 303.06K ops/s | 18.02M ops/s | +5846.0% | 59.46x |
| or-n3730-r105-001 | early-true | 296.91K ops/s | 17.21M ops/s | +5695.0% | 57.95x |
| overlap-n105-r100-015 | complete-true | 410.41K ops/s | 23.59M ops/s | +5647.3% | 57.47x |
| overlap-n105-r100-012 | early-true | 403.04K ops/s | 23.15M ops/s | +5644.8% | 57.45x |
| overlap-n105-r100-004 | complete-true | 415.08K ops/s | 23.45M ops/s | +5550.2% | 56.50x |
| overlap-n105-r100-009 | complete-true | 415.62K ops/s | 23.47M ops/s | +5546.0% | 56.46x |
| overlap-n105-r100-021 | early-true | 410.68K ops/s | 23.13M ops/s | +5532.9% | 56.33x |
| overlap-n105-r100-001 | complete-true | 418.81K ops/s | 23.51M ops/s | +5513.5% | 56.14x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n12-r5-001 | complete-false | 7.87M ops/s | 12.44M ops/s | +58.1% | 1.58x |
| overlap-n12-r5-001 | full-execution-false | 7.84M ops/s | 12.66M ops/s | +61.5% | 1.61x |
| overlap-n105-r100-014 | partial-false | 570.25K ops/s | 939.25K ops/s | +64.7% | 1.65x |
| overlap-n11-r5-001 | complete-false | 8.22M ops/s | 13.77M ops/s | +67.5% | 1.67x |
| overlap-n105-r100-023 | partial-false | 561.96K ops/s | 948.68K ops/s | +68.8% | 1.69x |
| overlap-n105-r100-018 | partial-false | 557.02K ops/s | 940.62K ops/s | +68.9% | 1.69x |
| overlap-n105-r100-016 | partial-false | 560.53K ops/s | 951.68K ops/s | +69.8% | 1.70x |
| overlap-n105-r100-002 | partial-false | 559.77K ops/s | 954.79K ops/s | +70.6% | 1.71x |
| overlap-n105-r100-018 | full-execution-false | 385.98K ops/s | 660.15K ops/s | +71.0% | 1.71x |
| overlap-n105-r100-004 | empty-context | 566.94K ops/s | 972.52K ops/s | +71.5% | 1.72x |
| overlap-n105-r100-006 | partial-false | 559.73K ops/s | 962.08K ops/s | +71.9% | 1.72x |
| overlap-n11-r5-001 | full-execution-false | 8.09M ops/s | 13.93M ops/s | +72.1% | 1.72x |
| overlap-n105-r100-007 | partial-false | 561.25K ops/s | 970.13K ops/s | +72.9% | 1.73x |
| overlap-n105-r100-001 | partial-false | 564.38K ops/s | 981.29K ops/s | +73.9% | 1.74x |
| overlap-n105-r100-008 | partial-false | 552.53K ops/s | 961.55K ops/s | +74.0% | 1.74x |
| overlap-n112-r100-007 | complete-false | 349.25K ops/s | 608.34K ops/s | +74.2% | 1.74x |
| overlap-n105-r100-017 | partial-false | 569.17K ops/s | 993.13K ops/s | +74.5% | 1.74x |
| overlap-n105-r100-019 | empty-context | 563.77K ops/s | 983.88K ops/s | +74.5% | 1.75x |
| or-n4691-r2-001 | partial-true | 8.54M ops/s | 14.90M ops/s | +74.6% | 1.75x |
| overlap-n105-r100-007 | full-execution-false | 382.00K ops/s | 668.80K ops/s | +75.1% | 1.75x |

### Regressions

_No regressions._

