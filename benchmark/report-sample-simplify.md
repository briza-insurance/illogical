# Benchmark Comparison Report — simplify

**Baseline:** `results-sample-simplify-oop.json`
**Improved:** `results-sample-simplify-bytecode.json`
**Total cases compared:** 595

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 595 |
| Slower (>-5%) | 0 |
| Unchanged | 0 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
<<<<<<< HEAD
| or-n4691-r2-001 | full-execution-false | 24.47K ops/s | 8.45M ops/s | +34423.0% | 345.23x |
| or-n4691-r2-001 | full-execution-true | 24.83K ops/s | 8.12M ops/s | +32595.5% | 326.96x |
| or-n4691-r2-001 | complete-false | 33.17K ops/s | 6.28M ops/s | +18826.7% | 189.27x |
| or-n4691-r2-001 | empty-context | 12.15K ops/s | 1.13M ops/s | +9169.2% | 92.69x |
| or-n4691-r2-001 | partial-false | 12.16K ops/s | 1.12M ops/s | +9148.0% | 92.48x |
| or-n3412-r101-001 | full-execution-false | 3.58K ops/s | 131.22K ops/s | +3561.4% | 36.61x |
| or-n1968-r105-001 | full-execution-false | 6.35K ops/s | 224.92K ops/s | +3440.2% | 35.40x |
| or-n1968-r105-001 | complete-false | 6.22K ops/s | 210.75K ops/s | +3286.7% | 33.87x |
| or-n3412-r101-001 | complete-false | 3.63K ops/s | 122.43K ops/s | +3274.6% | 33.75x |
| or-n1968-r105-001 | empty-context | 62.78K ops/s | 1.72M ops/s | +2639.2% | 27.39x |
| or-n1968-r105-001 | partial-false | 62.71K ops/s | 1.71M ops/s | +2627.8% | 27.28x |
| or-n1968-r105-001 | partial-true | 61.32K ops/s | 1.61M ops/s | +2519.3% | 26.19x |
| or-n3412-r101-001 | empty-context | 34.57K ops/s | 773.80K ops/s | +2138.2% | 22.38x |
| or-n3412-r101-001 | partial-false | 37.83K ops/s | 773.18K ops/s | +1943.6% | 20.44x |
| or-n3412-r101-001 | partial-true | 37.25K ops/s | 750.70K ops/s | +1915.5% | 20.15x |
| or-n3412-r101-001 | full-execution-true | 5.18K ops/s | 96.33K ops/s | +1759.9% | 18.60x |
| or-n1968-r105-001 | full-execution-true | 9.08K ops/s | 158.88K ops/s | +1650.2% | 17.50x |
| in-n122-r1-001 | full-execution-false | 770.86K ops/s | 10.28M ops/s | +1234.1% | 13.34x |
| in-n122-r1-001 | complete-false | 873.33K ops/s | 10.26M ops/s | +1074.7% | 11.75x |
| in-n122-r1-001 | complete-true | 952.80K ops/s | 9.91M ops/s | +940.0% | 10.40x |
||||||| parent of 4a338e0 (add a new test case and rerun bench)
| or-n4691-r2-001 | full-execution-false | 15.61K ops/s | 8.07M ops/s | +51592.4% | 516.92x |
| or-n4691-r2-001 | full-execution-true | 23.41K ops/s | 7.87M ops/s | +33514.6% | 336.15x |
| or-n4691-r2-001 | complete-false | 33.34K ops/s | 6.11M ops/s | +18228.4% | 183.28x |
| or-n4691-r2-001 | empty-context | 11.32K ops/s | 1.13M ops/s | +9878.6% | 99.79x |
| or-n4691-r2-001 | partial-false | 12.39K ops/s | 1.12M ops/s | +8943.0% | 90.43x |
| or-n3412-r101-001 | full-execution-false | 3.62K ops/s | 129.76K ops/s | +3485.2% | 35.85x |
| or-n3412-r101-001 | complete-false | 3.56K ops/s | 123.54K ops/s | +3366.8% | 34.67x |
| or-n1968-r105-001 | full-execution-false | 6.29K ops/s | 217.99K ops/s | +3363.0% | 34.63x |
| or-n1968-r105-001 | complete-false | 6.12K ops/s | 198.14K ops/s | +3137.5% | 32.38x |
| or-n1968-r105-001 | empty-context | 62.16K ops/s | 1.71M ops/s | +2654.1% | 27.54x |
| or-n1968-r105-001 | partial-false | 62.10K ops/s | 1.71M ops/s | +2653.2% | 27.53x |
| or-n1968-r105-001 | partial-true | 61.87K ops/s | 1.62M ops/s | +2525.2% | 26.25x |
| or-n3412-r101-001 | empty-context | 37.17K ops/s | 776.33K ops/s | +1988.7% | 20.89x |
| or-n3412-r101-001 | partial-false | 37.48K ops/s | 781.31K ops/s | +1984.8% | 20.85x |
| or-n3412-r101-001 | partial-true | 36.78K ops/s | 751.45K ops/s | +1943.0% | 20.43x |
| or-n3412-r101-001 | full-execution-true | 5.15K ops/s | 97.30K ops/s | +1788.4% | 18.88x |
| or-n1968-r105-001 | full-execution-true | 9.00K ops/s | 160.83K ops/s | +1686.4% | 17.86x |
| in-n122-r1-001 | complete-false | 864.19K ops/s | 10.10M ops/s | +1069.0% | 11.69x |
| in-n122-r1-001 | full-execution-false | 866.57K ops/s | 10.12M ops/s | +1068.3% | 11.68x |
| in-n122-r1-001 | complete-true | 949.07K ops/s | 10.02M ops/s | +956.3% | 10.56x |
=======
| or-n4691-r2-001 | full-execution-true | 23.52K ops/s | 7.90M ops/s | +33477.3% | 335.77x |
| or-n4691-r2-001 | full-execution-false | 23.40K ops/s | 7.84M ops/s | +33400.6% | 335.01x |
| or-n4691-r2-001 | complete-false | 33.04K ops/s | 6.08M ops/s | +18299.1% | 183.99x |
| or-n4691-r2-001 | empty-context | 12.04K ops/s | 1.14M ops/s | +9340.9% | 94.41x |
| or-n4691-r2-001 | partial-false | 12.09K ops/s | 1.13M ops/s | +9260.1% | 93.60x |
| or-n3412-r101-001 | full-execution-false | 3.61K ops/s | 123.29K ops/s | +3312.7% | 34.13x |
| or-n3412-r101-001 | complete-false | 3.54K ops/s | 119.17K ops/s | +3268.3% | 33.68x |
| or-n1968-r105-001 | full-execution-false | 6.20K ops/s | 199.18K ops/s | +3113.6% | 32.14x |
| or-n1968-r105-001 | complete-false | 6.11K ops/s | 177.57K ops/s | +2803.9% | 29.04x |
| or-n1968-r105-001 | empty-context | 61.86K ops/s | 1.72M ops/s | +2678.2% | 27.78x |
| or-n1968-r105-001 | partial-false | 62.34K ops/s | 1.71M ops/s | +2638.4% | 27.38x |
| or-n1968-r105-001 | partial-true | 61.67K ops/s | 1.62M ops/s | +2528.9% | 26.29x |
| or-n3412-r101-001 | empty-context | 34.22K ops/s | 775.34K ops/s | +2165.5% | 22.65x |
| or-n3412-r101-001 | partial-true | 34.75K ops/s | 753.08K ops/s | +2067.1% | 21.67x |
| or-n3412-r101-001 | partial-false | 36.60K ops/s | 774.75K ops/s | +2017.0% | 21.17x |
| or-n3412-r101-001 | full-execution-true | 5.18K ops/s | 96.90K ops/s | +1772.0% | 18.72x |
| or-n1968-r105-001 | full-execution-true | 9.09K ops/s | 160.06K ops/s | +1660.3% | 17.60x |
| in-n122-r1-001 | full-execution-false | 856.48K ops/s | 9.69M ops/s | +1031.8% | 11.32x |
| in-n122-r1-001 | complete-false | 855.21K ops/s | 9.65M ops/s | +1028.2% | 11.28x |
| in-n122-r1-001 | complete-true | 939.44K ops/s | 9.12M ops/s | +870.9% | 9.71x |
>>>>>>> 4a338e0 (add a new test case and rerun bench)

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
<<<<<<< HEAD
| overlap-n105-r100-010 | empty-context | 7.20M ops/s | 8.66M ops/s | +20.3% | 1.20x |
| overlap-n105-r100-022 | partial-false | 7.20M ops/s | 8.90M ops/s | +23.5% | 1.23x |
| overlap-n105-r100-012 | partial-false | 7.21M ops/s | 8.92M ops/s | +23.7% | 1.24x |
| overlap-n105-r100-016 | empty-context | 7.16M ops/s | 8.88M ops/s | +24.0% | 1.24x |
| overlap-n105-r100-023 | partial-false | 7.23M ops/s | 8.98M ops/s | +24.3% | 1.24x |
| overlap-n105-r100-013 | empty-context | 7.20M ops/s | 8.96M ops/s | +24.3% | 1.24x |
| overlap-n105-r100-022 | empty-context | 7.23M ops/s | 8.99M ops/s | +24.4% | 1.24x |
| overlap-n105-r100-013 | partial-false | 7.21M ops/s | 8.98M ops/s | +24.6% | 1.25x |
| overlap-n105-r100-014 | partial-false | 7.21M ops/s | 9.00M ops/s | +24.9% | 1.25x |
| overlap-n105-r100-012 | empty-context | 7.16M ops/s | 8.94M ops/s | +24.9% | 1.25x |
| overlap-n105-r100-020 | empty-context | 7.12M ops/s | 8.89M ops/s | +24.9% | 1.25x |
| overlap-n105-r100-020 | partial-false | 7.19M ops/s | 8.98M ops/s | +24.9% | 1.25x |
| overlap-n105-r100-018 | partial-false | 7.15M ops/s | 8.94M ops/s | +25.1% | 1.25x |
| overlap-n105-r100-008 | partial-false | 7.18M ops/s | 8.98M ops/s | +25.1% | 1.25x |
| overlap-n105-r100-009 | partial-false | 7.16M ops/s | 8.96M ops/s | +25.2% | 1.25x |
| overlap-n105-r100-014 | empty-context | 7.19M ops/s | 9.00M ops/s | +25.2% | 1.25x |
| overlap-n105-r100-019 | partial-false | 7.15M ops/s | 8.95M ops/s | +25.2% | 1.25x |
| overlap-n105-r100-011 | partial-false | 7.22M ops/s | 9.04M ops/s | +25.2% | 1.25x |
| overlap-n105-r100-010 | partial-false | 7.20M ops/s | 9.02M ops/s | +25.3% | 1.25x |
| overlap-n105-r100-016 | partial-false | 7.16M ops/s | 8.98M ops/s | +25.3% | 1.25x |
||||||| parent of 4a338e0 (add a new test case and rerun bench)
| overlap-n105-r100-012 | empty-context | 7.19M ops/s | 7.96M ops/s | +10.8% | 1.11x |
| overlap-n105-r100-004 | partial-false | 7.21M ops/s | 8.81M ops/s | +22.2% | 1.22x |
| overlap-n105-r100-010 | partial-false | 7.26M ops/s | 9.01M ops/s | +24.0% | 1.24x |
| overlap-n105-r100-005 | partial-false | 7.21M ops/s | 8.95M ops/s | +24.1% | 1.24x |
| overlap-n105-r100-001 | empty-context | 7.21M ops/s | 8.95M ops/s | +24.1% | 1.24x |
| overlap-n105-r100-002 | empty-context | 7.23M ops/s | 8.98M ops/s | +24.3% | 1.24x |
| overlap-n105-r100-007 | partial-false | 7.20M ops/s | 8.97M ops/s | +24.6% | 1.25x |
| overlap-n106-r100-005 | empty-context | 6.82M ops/s | 8.52M ops/s | +24.9% | 1.25x |
| overlap-n105-r100-001 | partial-false | 7.22M ops/s | 9.02M ops/s | +25.0% | 1.25x |
| overlap-n105-r100-002 | partial-false | 7.20M ops/s | 9.01M ops/s | +25.0% | 1.25x |
| overlap-n105-r100-010 | empty-context | 7.20M ops/s | 9.02M ops/s | +25.3% | 1.25x |
| overlap-n105-r100-003 | empty-context | 7.24M ops/s | 9.09M ops/s | +25.5% | 1.26x |
| overlap-n105-r100-015 | empty-context | 7.21M ops/s | 9.05M ops/s | +25.5% | 1.26x |
| overlap-n105-r100-017 | partial-false | 7.21M ops/s | 9.05M ops/s | +25.6% | 1.26x |
| overlap-n105-r100-012 | partial-false | 7.19M ops/s | 9.04M ops/s | +25.7% | 1.26x |
| overlap-n105-r100-005 | empty-context | 7.18M ops/s | 9.07M ops/s | +26.2% | 1.26x |
| overlap-n105-r100-018 | partial-false | 7.21M ops/s | 9.10M ops/s | +26.3% | 1.26x |
| overlap-n105-r100-007 | empty-context | 7.17M ops/s | 9.05M ops/s | +26.3% | 1.26x |
| overlap-n105-r100-009 | partial-false | 7.24M ops/s | 9.15M ops/s | +26.4% | 1.26x |
| overlap-n105-r100-016 | empty-context | 7.18M ops/s | 9.07M ops/s | +26.5% | 1.26x |
=======
| overlap-n105-r100-002 | partial-false | 7.13M ops/s | 8.68M ops/s | +21.8% | 1.22x |
| overlap-n105-r100-005 | empty-context | 6.96M ops/s | 8.87M ops/s | +27.4% | 1.27x |
| overlap-n105-r100-003 | partial-false | 7.11M ops/s | 9.08M ops/s | +27.8% | 1.28x |
| overlap-n105-r100-006 | partial-false | 6.98M ops/s | 8.94M ops/s | +28.2% | 1.28x |
| overlap-n105-r100-005 | partial-false | 7.01M ops/s | 8.99M ops/s | +28.3% | 1.28x |
| overlap-n105-r100-001 | partial-false | 7.06M ops/s | 9.11M ops/s | +29.1% | 1.29x |
| overlap-n105-r100-004 | partial-false | 6.94M ops/s | 8.96M ops/s | +29.1% | 1.29x |
| overlap-n105-r100-003 | empty-context | 7.00M ops/s | 9.07M ops/s | +29.5% | 1.30x |
| overlap-n105-r100-002 | empty-context | 6.99M ops/s | 9.08M ops/s | +30.0% | 1.30x |
| overlap-n105-r100-001 | empty-context | 6.97M ops/s | 9.12M ops/s | +30.9% | 1.31x |
| overlap-n105-r100-006 | empty-context | 6.97M ops/s | 9.14M ops/s | +31.1% | 1.31x |
| overlap-n105-r100-004 | empty-context | 6.77M ops/s | 8.91M ops/s | +31.6% | 1.32x |
| overlap-n105-r100-020 | partial-false | 7.13M ops/s | 9.53M ops/s | +33.5% | 1.34x |
| overlap-n105-r100-007 | empty-context | 6.99M ops/s | 9.41M ops/s | +34.7% | 1.35x |
| overlap-n105-r100-020 | empty-context | 7.02M ops/s | 9.51M ops/s | +35.5% | 1.35x |
| overlap-n105-r100-017 | empty-context | 7.13M ops/s | 9.68M ops/s | +35.8% | 1.36x |
| overlap-n105-r100-006 | partial-true | 4.96M ops/s | 6.76M ops/s | +36.2% | 1.36x |
| overlap-n105-r100-017 | partial-false | 7.09M ops/s | 9.68M ops/s | +36.4% | 1.36x |
| overlap-n105-r100-021 | partial-false | 7.14M ops/s | 9.77M ops/s | +36.9% | 1.37x |
| overlap-n105-r100-007 | partial-false | 7.02M ops/s | 9.62M ops/s | +37.1% | 1.37x |
>>>>>>> 4a338e0 (add a new test case and rerun bench)

### Regressions

_No regressions._

