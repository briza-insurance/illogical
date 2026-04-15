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
| or-n4691-r2-001 | full-execution-true | 55.20K ops/s | 13.59M ops/s | +24527.9% | 246.28x |
| or-n4691-r2-001 | full-execution-false | 54.36K ops/s | 13.25M ops/s | +24276.7% | 243.77x |
| or-n4691-r2-001 | late-true | 59.16K ops/s | 12.85M ops/s | +21617.7% | 217.18x |
| or-n3412-r101-001 | early-true | 88.86K ops/s | 17.29M ops/s | +19358.4% | 194.58x |
| or-n4691-r2-001 | partial-false | 93.65K ops/s | 17.83M ops/s | +18941.0% | 190.41x |
| or-n3412-r101-001 | partial-true | 98.93K ops/s | 17.69M ops/s | +17784.9% | 178.85x |
| or-n4691-r2-001 | empty-context | 95.81K ops/s | 17.13M ops/s | +17781.7% | 178.82x |
| or-n3412-r101-001 | complete-true | 94.22K ops/s | 16.08M ops/s | +16965.1% | 170.65x |
| or-n1968-r105-001 | complete-true | 129.18K ops/s | 16.63M ops/s | +12770.9% | 128.71x |
| or-n4691-r2-001 | complete-false | 76.57K ops/s | 9.64M ops/s | +12492.7% | 125.93x |
| or-n1968-r105-001 | partial-true | 139.39K ops/s | 16.87M ops/s | +12002.2% | 121.02x |
| or-n1968-r105-001 | early-true | 132.08K ops/s | 15.57M ops/s | +11687.5% | 117.88x |
| overlap-n105-r100-006 | early-true | 363.18K ops/s | 22.98M ops/s | +6227.8% | 63.28x |
| overlap-n105-r100-008 | full-execution-true | 363.90K ops/s | 22.67M ops/s | +6129.0% | 62.29x |
| overlap-n105-r100-005 | early-true | 370.51K ops/s | 23.06M ops/s | +6123.1% | 62.23x |
| or-n3730-r105-001 | early-true | 267.97K ops/s | 16.66M ops/s | +6118.9% | 62.19x |
| overlap-n105-r100-022 | complete-true | 370.30K ops/s | 23.00M ops/s | +6112.1% | 62.12x |
| overlap-n105-r100-013 | early-true | 370.88K ops/s | 23.00M ops/s | +6101.9% | 62.02x |
| overlap-n105-r100-008 | complete-true | 371.43K ops/s | 23.03M ops/s | +6099.9% | 62.00x |
| overlap-n105-r100-016 | full-execution-true | 372.64K ops/s | 23.09M ops/s | +6096.5% | 61.96x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n112-r100-003 | complete-false | 315.59K ops/s | 484.52K ops/s | +53.5% | 1.54x |
| overlap-n112-r100-003 | full-execution-false | 314.48K ops/s | 506.69K ops/s | +61.1% | 1.61x |
| overlap-n12-r5-001 | full-execution-false | 7.32M ops/s | 11.92M ops/s | +62.7% | 1.63x |
| overlap-n112-r100-011 | full-execution-false | 304.63K ops/s | 498.73K ops/s | +63.7% | 1.64x |
| overlap-n11-r5-001 | complete-false | 7.32M ops/s | 12.16M ops/s | +66.0% | 1.66x |
| overlap-n108-r100-006 | complete-false | 322.34K ops/s | 544.79K ops/s | +69.0% | 1.69x |
| overlap-n112-r100-011 | complete-false | 302.10K ops/s | 518.86K ops/s | +71.7% | 1.72x |
| overlap-n12-r5-001 | complete-false | 7.14M ops/s | 12.28M ops/s | +72.1% | 1.72x |
| or-n4691-r2-001 | complete-true | 7.58M ops/s | 13.26M ops/s | +74.9% | 1.75x |
| or-n4691-r2-001 | partial-true | 7.58M ops/s | 13.27M ops/s | +75.2% | 1.75x |
| overlap-n112-r100-008 | full-execution-false | 319.04K ops/s | 565.13K ops/s | +77.1% | 1.77x |
| overlap-n108-r100-007 | full-execution-false | 341.85K ops/s | 606.65K ops/s | +77.5% | 1.77x |
| overlap-n108-r100-006 | full-execution-false | 321.59K ops/s | 573.48K ops/s | +78.3% | 1.78x |
| overlap-n106-r100-005 | complete-false | 343.84K ops/s | 615.27K ops/s | +78.9% | 1.79x |
| overlap-n112-r100-004 | full-execution-false | 303.61K ops/s | 544.56K ops/s | +79.4% | 1.79x |
| or-n4691-r2-001 | early-true | 7.17M ops/s | 12.98M ops/s | +81.1% | 1.81x |
| overlap-n106-r100-004 | complete-false | 334.60K ops/s | 608.13K ops/s | +81.7% | 1.82x |
| overlap-n112-r100-009 | full-execution-false | 315.73K ops/s | 574.45K ops/s | +81.9% | 1.82x |
| overlap-n108-r100-003 | full-execution-false | 333.84K ops/s | 608.37K ops/s | +82.2% | 1.82x |
| overlap-n112-r100-004 | complete-false | 309.64K ops/s | 566.87K ops/s | +83.1% | 1.83x |

### Regressions

_No regressions._

