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
| or-n4691-r2-001 | late-true | 40.87K ops/s | 10.73M ops/s | +26144.3% | 262.44x |
| or-n4691-r2-001 | full-execution-false | 44.96K ops/s | 11.17M ops/s | +24741.3% | 248.41x |
| or-n4691-r2-001 | partial-false | 71.81K ops/s | 17.26M ops/s | +23932.4% | 240.32x |
| or-n4691-r2-001 | empty-context | 71.21K ops/s | 17.03M ops/s | +23813.5% | 239.13x |
| or-n4691-r2-001 | full-execution-true | 45.00K ops/s | 10.73M ops/s | +23752.0% | 238.52x |
| or-n3412-r101-001 | complete-true | 75.00K ops/s | 11.51M ops/s | +15244.2% | 153.44x |
| or-n3412-r101-001 | early-true | 74.45K ops/s | 11.40M ops/s | +15211.3% | 153.11x |
| or-n3412-r101-001 | partial-true | 79.48K ops/s | 11.42M ops/s | +14273.7% | 143.74x |
| or-n4691-r2-001 | complete-false | 58.90K ops/s | 7.13M ops/s | +11999.6% | 121.00x |
| or-n1968-r105-001 | early-true | 105.31K ops/s | 10.76M ops/s | +10119.3% | 102.19x |
| or-n1968-r105-001 | complete-true | 104.75K ops/s | 10.61M ops/s | +10030.8% | 101.31x |
| or-n1968-r105-001 | partial-true | 114.27K ops/s | 11.32M ops/s | +9805.1% | 99.05x |
| overlap-n105-r100-009 | full-execution-true | 251.60K ops/s | 18.15M ops/s | +7114.6% | 72.15x |
| overlap-n105-r100-023 | early-true | 280.76K ops/s | 19.87M ops/s | +6977.9% | 70.78x |
| overlap-n105-r100-023 | complete-true | 282.42K ops/s | 19.88M ops/s | +6938.3% | 70.38x |
| overlap-n105-r100-001 | early-true | 281.30K ops/s | 19.80M ops/s | +6937.3% | 70.37x |
| overlap-n105-r100-001 | complete-true | 281.01K ops/s | 19.73M ops/s | +6922.9% | 70.23x |
| overlap-n105-r100-001 | full-execution-true | 281.21K ops/s | 19.63M ops/s | +6880.9% | 69.81x |
| overlap-n105-r100-023 | full-execution-true | 282.37K ops/s | 19.70M ops/s | +6875.4% | 69.75x |
| overlap-n105-r100-017 | complete-true | 282.35K ops/s | 19.69M ops/s | +6873.9% | 69.74x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n105-r100-016 | complete-false | 260.17K ops/s | 379.46K ops/s | +45.9% | 1.46x |
| overlap-n105-r100-008 | complete-false | 258.72K ops/s | 382.50K ops/s | +47.8% | 1.48x |
| overlap-n112-r100-010 | full-execution-false | 228.85K ops/s | 356.24K ops/s | +55.7% | 1.56x |
| overlap-n112-r100-010 | complete-false | 224.75K ops/s | 360.06K ops/s | +60.2% | 1.60x |
| overlap-n106-r100-001 | full-execution-false | 252.78K ops/s | 410.51K ops/s | +62.4% | 1.62x |
| overlap-n105-r100-009 | empty-context | 384.86K ops/s | 627.55K ops/s | +63.1% | 1.63x |
| overlap-n105-r100-015 | late-true | 262.48K ops/s | 428.43K ops/s | +63.2% | 1.63x |
| overlap-n108-r100-005 | full-execution-false | 245.64K ops/s | 401.00K ops/s | +63.2% | 1.63x |
| overlap-n105-r100-012 | complete-false | 260.49K ops/s | 427.26K ops/s | +64.0% | 1.64x |
| overlap-n105-r100-002 | full-execution-false | 260.94K ops/s | 429.64K ops/s | +64.7% | 1.65x |
| overlap-n105-r100-012 | full-execution-false | 260.48K ops/s | 429.54K ops/s | +64.9% | 1.65x |
| overlap-n105-r100-019 | full-execution-false | 258.77K ops/s | 426.86K ops/s | +65.0% | 1.65x |
| overlap-n105-r100-010 | late-true | 259.29K ops/s | 427.84K ops/s | +65.0% | 1.65x |
| overlap-n105-r100-005 | late-true | 263.26K ops/s | 435.31K ops/s | +65.4% | 1.65x |
| overlap-n105-r100-017 | complete-false | 260.47K ops/s | 430.86K ops/s | +65.4% | 1.65x |
| overlap-n105-r100-004 | full-execution-false | 260.19K ops/s | 432.17K ops/s | +66.1% | 1.66x |
| overlap-n105-r100-014 | full-execution-false | 261.66K ops/s | 435.25K ops/s | +66.3% | 1.66x |
| overlap-n105-r100-009 | full-execution-false | 259.43K ops/s | 431.62K ops/s | +66.4% | 1.66x |
| overlap-n105-r100-018 | complete-false | 261.36K ops/s | 434.85K ops/s | +66.4% | 1.66x |
| overlap-n105-r100-023 | complete-false | 261.62K ops/s | 435.48K ops/s | +66.5% | 1.66x |

### Regressions

_No regressions._

