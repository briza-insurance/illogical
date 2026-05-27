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
<<<<<<< HEAD
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
||||||| parent of 4a338e0 (add a new test case and rerun bench)
| or-n4691-r2-001 | empty-context | 72.37K ops/s | 17.15M ops/s | +23601.3% | 237.01x |
| or-n4691-r2-001 | full-execution-true | 45.33K ops/s | 10.49M ops/s | +23052.4% | 231.52x |
| or-n4691-r2-001 | partial-false | 72.77K ops/s | 16.73M ops/s | +22895.0% | 229.95x |
| or-n4691-r2-001 | late-true | 45.15K ops/s | 10.34M ops/s | +22807.1% | 229.07x |
| or-n4691-r2-001 | full-execution-false | 45.12K ops/s | 10.26M ops/s | +22638.3% | 227.38x |
| or-n3412-r101-001 | complete-true | 75.95K ops/s | 11.65M ops/s | +15240.2% | 153.40x |
| or-n3412-r101-001 | early-true | 75.00K ops/s | 11.48M ops/s | +15205.1% | 153.05x |
| or-n3412-r101-001 | partial-true | 81.26K ops/s | 11.55M ops/s | +14120.1% | 142.20x |
| or-n4691-r2-001 | complete-false | 60.04K ops/s | 7.15M ops/s | +11801.6% | 119.02x |
| or-n1968-r105-001 | complete-true | 103.44K ops/s | 11.23M ops/s | +10758.0% | 108.58x |
| or-n1968-r105-001 | early-true | 104.77K ops/s | 11.29M ops/s | +10679.2% | 107.79x |
| or-n1968-r105-001 | partial-true | 115.66K ops/s | 11.29M ops/s | +9661.0% | 97.61x |
| overlap-n105-r100-017 | early-true | 280.37K ops/s | 18.98M ops/s | +6669.2% | 67.69x |
| overlap-n105-r100-012 | complete-true | 290.03K ops/s | 19.56M ops/s | +6643.0% | 67.43x |
| overlap-n105-r100-015 | partial-true | 288.61K ops/s | 19.28M ops/s | +6578.9% | 66.79x |
| overlap-n105-r100-007 | early-true | 293.33K ops/s | 19.57M ops/s | +6572.0% | 66.72x |
| overlap-n105-r100-002 | complete-true | 289.30K ops/s | 19.24M ops/s | +6552.0% | 66.52x |
| overlap-n105-r100-016 | complete-true | 293.00K ops/s | 19.43M ops/s | +6533.0% | 66.33x |
| overlap-n105-r100-022 | early-true | 291.43K ops/s | 19.20M ops/s | +6489.8% | 65.90x |
| overlap-n105-r100-006 | early-true | 296.32K ops/s | 19.48M ops/s | +6472.3% | 65.72x |
=======
| or-n4691-r2-001 | empty-context | 70.35K ops/s | 17.22M ops/s | +24378.7% | 244.79x |
| or-n4691-r2-001 | full-execution-false | 45.05K ops/s | 10.82M ops/s | +23928.2% | 240.28x |
| or-n4691-r2-001 | late-true | 44.75K ops/s | 10.64M ops/s | +23681.0% | 237.81x |
| or-n4691-r2-001 | partial-false | 72.51K ops/s | 16.89M ops/s | +23194.0% | 232.94x |
| or-n4691-r2-001 | full-execution-true | 44.95K ops/s | 10.39M ops/s | +23019.3% | 231.19x |
| or-n3412-r101-001 | complete-true | 75.09K ops/s | 11.02M ops/s | +14578.8% | 146.79x |
| or-n3412-r101-001 | early-true | 75.44K ops/s | 11.06M ops/s | +14566.0% | 146.66x |
| or-n3412-r101-001 | partial-true | 80.99K ops/s | 11.45M ops/s | +14039.3% | 141.39x |
| or-n4691-r2-001 | complete-false | 59.41K ops/s | 7.27M ops/s | +12143.9% | 122.44x |
| or-n1968-r105-001 | complete-true | 103.34K ops/s | 10.88M ops/s | +10429.3% | 105.29x |
| or-n1968-r105-001 | early-true | 105.44K ops/s | 10.84M ops/s | +10185.4% | 102.85x |
| or-n1968-r105-001 | partial-true | 116.91K ops/s | 11.48M ops/s | +9723.3% | 98.23x |
| overlap-n105-r100-022 | complete-true | 282.09K ops/s | 19.19M ops/s | +6702.7% | 68.03x |
| overlap-n105-r100-012 | complete-true | 296.47K ops/s | 19.11M ops/s | +6346.0% | 64.46x |
| overlap-n105-r100-016 | complete-true | 298.43K ops/s | 19.22M ops/s | +6341.6% | 64.42x |
| overlap-n105-r100-022 | early-true | 291.72K ops/s | 18.61M ops/s | +6278.5% | 63.79x |
| overlap-n105-r100-014 | complete-true | 296.85K ops/s | 18.87M ops/s | +6256.1% | 63.56x |
| overlap-n105-r100-023 | early-true | 292.49K ops/s | 18.53M ops/s | +6233.8% | 63.34x |
| overlap-n105-r100-023 | full-execution-true | 291.84K ops/s | 18.47M ops/s | +6229.9% | 63.30x |
| overlap-n105-r100-003 | complete-true | 291.11K ops/s | 18.41M ops/s | +6223.9% | 63.24x |
>>>>>>> 4a338e0 (add a new test case and rerun bench)

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
<<<<<<< HEAD
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
||||||| parent of 4a338e0 (add a new test case and rerun bench)
| overlap-n107-r100-001 | full-execution-false | 267.68K ops/s | 398.90K ops/s | +49.0% | 1.49x |
| overlap-n107-r100-001 | complete-false | 266.56K ops/s | 400.50K ops/s | +50.2% | 1.50x |
| overlap-n111-r100-001 | complete-false | 246.21K ops/s | 373.73K ops/s | +51.8% | 1.52x |
| overlap-n111-r100-001 | full-execution-false | 245.50K ops/s | 375.06K ops/s | +52.8% | 1.53x |
| overlap-n112-r100-011 | full-execution-false | 234.50K ops/s | 368.20K ops/s | +57.0% | 1.57x |
| overlap-n112-r100-001 | complete-false | 239.84K ops/s | 377.37K ops/s | +57.3% | 1.57x |
| overlap-n112-r100-011 | complete-false | 237.30K ops/s | 374.30K ops/s | +57.7% | 1.58x |
| overlap-n112-r100-001 | full-execution-false | 236.44K ops/s | 377.34K ops/s | +59.6% | 1.60x |
| overlap-n108-r100-004 | complete-false | 260.65K ops/s | 418.40K ops/s | +60.5% | 1.61x |
| overlap-n108-r100-004 | full-execution-false | 261.69K ops/s | 421.54K ops/s | +61.1% | 1.61x |
| overlap-n108-r100-005 | complete-false | 260.27K ops/s | 422.42K ops/s | +62.3% | 1.62x |
| overlap-n112-r100-008 | full-execution-false | 242.81K ops/s | 395.66K ops/s | +63.0% | 1.63x |
| overlap-n112-r100-010 | full-execution-false | 235.12K ops/s | 384.16K ops/s | +63.4% | 1.63x |
| overlap-n108-r100-005 | full-execution-false | 258.04K ops/s | 427.92K ops/s | +65.8% | 1.66x |
| overlap-n106-r100-001 | complete-false | 270.96K ops/s | 451.57K ops/s | +66.7% | 1.67x |
| overlap-n108-r100-001 | complete-false | 257.19K ops/s | 431.68K ops/s | +67.8% | 1.68x |
| overlap-n105-r100-020 | complete-false | 279.27K ops/s | 468.88K ops/s | +67.9% | 1.68x |
| overlap-n112-r100-008 | complete-false | 240.66K ops/s | 405.01K ops/s | +68.3% | 1.68x |
| overlap-n112-r100-005 | full-execution-false | 241.24K ops/s | 406.30K ops/s | +68.4% | 1.68x |
| overlap-n105-r100-022 | late-true | 285.94K ops/s | 482.12K ops/s | +68.6% | 1.69x |
=======
| overlap-n11-r5-001 | full-execution-false | 5.64M ops/s | 8.62M ops/s | +52.7% | 1.53x |
| overlap-n111-r100-002 | complete-false | 241.66K ops/s | 370.67K ops/s | +53.4% | 1.53x |
| overlap-n111-r100-002 | full-execution-false | 241.83K ops/s | 371.61K ops/s | +53.7% | 1.54x |
| overlap-n106-r100-007 | complete-false | 267.18K ops/s | 415.59K ops/s | +55.5% | 1.56x |
| overlap-n106-r100-007 | full-execution-false | 268.37K ops/s | 420.28K ops/s | +56.6% | 1.57x |
| overlap-n106-r100-008 | full-execution-false | 267.82K ops/s | 419.87K ops/s | +56.8% | 1.57x |
| overlap-n11-r5-001 | complete-false | 5.51M ops/s | 8.64M ops/s | +56.9% | 1.57x |
| overlap-n105-r100-023 | late-true | 271.66K ops/s | 428.91K ops/s | +57.9% | 1.58x |
| overlap-n106-r100-008 | complete-false | 266.77K ops/s | 422.38K ops/s | +58.3% | 1.58x |
| overlap-n108-r100-005 | full-execution-false | 258.28K ops/s | 418.76K ops/s | +62.1% | 1.62x |
| overlap-n105-r100-005 | complete-false | 274.17K ops/s | 447.71K ops/s | +63.3% | 1.63x |
| overlap-n105-r100-008 | partial-false | 392.96K ops/s | 642.78K ops/s | +63.6% | 1.64x |
| overlap-n111-r100-001 | full-execution-false | 241.87K ops/s | 398.32K ops/s | +64.7% | 1.65x |
| overlap-n108-r100-005 | complete-false | 255.33K ops/s | 421.20K ops/s | +65.0% | 1.65x |
| overlap-n105-r100-005 | late-true | 276.64K ops/s | 456.78K ops/s | +65.1% | 1.65x |
| overlap-n105-r100-005 | full-execution-false | 273.74K ops/s | 453.08K ops/s | +65.5% | 1.66x |
| overlap-n105-r100-019 | partial-false | 386.62K ops/s | 639.93K ops/s | +65.5% | 1.66x |
| overlap-n105-r100-004 | complete-false | 273.26K ops/s | 453.50K ops/s | +66.0% | 1.66x |
| overlap-n105-r100-007 | complete-false | 272.93K ops/s | 454.51K ops/s | +66.5% | 1.67x |
| overlap-n105-r100-002 | complete-false | 273.40K ops/s | 455.41K ops/s | +66.6% | 1.67x |
>>>>>>> 4a338e0 (add a new test case and rerun bench)

### Regressions

_No regressions._

