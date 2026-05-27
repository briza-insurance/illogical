# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-oop.json`
**Improved:** `results-synthetic-evaluate-bytecode.json`
**Total cases compared:** 104

## Summary

| | Count |
|---|---|
<<<<<<< HEAD
| Faster (>+5%) | 96 |
| Slower (>-5%) | 0 |
| Unchanged | 5 |
||||||| parent of 4a338e0 (add a new test case and rerun bench)
| Faster (>+5%) | 94 |
| Slower (>-5%) | 0 |
| Unchanged | 7 |
=======
| Faster (>+5%) | 96 |
| Slower (>-5%) | 1 |
| Unchanged | 7 |
>>>>>>> 4a338e0 (add a new test case and rerun bench)

---

## evaluate

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
<<<<<<< HEAD
| overlap-n1026-r1000-10x | early-true | 24.71K ops/s | 12.97M ops/s | +52382.1% | 524.82x |
| overlap-n1026-r1000-10x | complete-true | 24.71K ops/s | 12.88M ops/s | +52021.7% | 521.22x |
| overlap-n1026-r1000-10x | full-execution-true | 24.74K ops/s | 12.85M ops/s | +51849.4% | 519.49x |
| overlap-n526-r500-5x | complete-true | 33.92K ops/s | 12.75M ops/s | +37477.8% | 375.78x |
| overlap-n1026-r1000-10x | partial-true | 35.39K ops/s | 12.89M ops/s | +36310.7% | 364.11x |
| overlap-n526-r500-5x | full-execution-true | 51.60K ops/s | 12.76M ops/s | +24631.9% | 247.32x |
| overlap-n526-r500-5x | early-true | 51.60K ops/s | 12.59M ops/s | +24304.6% | 244.05x |
| overlap-n526-r500-5x | partial-true | 71.97K ops/s | 12.51M ops/s | +17279.3% | 173.79x |
| in-n1224-r1-10x | late-true | 177.01K ops/s | 21.23M ops/s | +11890.8% | 119.91x |
| in-n1224-r1-10x | complete-false | 183.18K ops/s | 21.53M ops/s | +11651.3% | 117.51x |
| in-n1224-r1-10x | full-execution-false | 185.85K ops/s | 21.59M ops/s | +11517.4% | 116.17x |
| in-n1224-r1-10x | partial-false | 232.17K ops/s | 22.40M ops/s | +9549.4% | 96.49x |
| in-n1224-r1-10x | empty-context | 237.40K ops/s | 22.29M ops/s | +9288.3% | 93.88x |
| in-n1224-r1-10x | partial-true | 229.91K ops/s | 17.54M ops/s | +7528.9% | 76.29x |
| in-n1224-r1-10x | complete-true | 230.52K ops/s | 17.44M ops/s | +7466.3% | 75.66x |
| in-n1224-r1-10x | full-execution-true | 230.83K ops/s | 17.42M ops/s | +7448.9% | 75.49x |
| in-n1224-r1-10x | early-true | 230.90K ops/s | 17.29M ops/s | +7387.1% | 74.87x |
| in-n614-r1-5x | late-true | 353.00K ops/s | 21.55M ops/s | +6006.2% | 61.06x |
| in-n614-r1-5x | full-execution-false | 370.20K ops/s | 21.79M ops/s | +5786.3% | 58.86x |
| in-n614-r1-5x | complete-false | 371.98K ops/s | 21.67M ops/s | +5726.1% | 58.26x |
||||||| parent of 4a338e0 (add a new test case and rerun bench)
| overlap-n1026-r1000-10x | complete-true | 22.80K ops/s | 12.39M ops/s | +54245.6% | 543.46x |
| overlap-n1026-r1000-10x | early-true | 23.24K ops/s | 12.34M ops/s | +52998.9% | 530.99x |
| overlap-n1026-r1000-10x | full-execution-true | 23.06K ops/s | 12.20M ops/s | +52785.0% | 528.85x |
| overlap-n1026-r1000-10x | partial-true | 33.80K ops/s | 12.69M ops/s | +37443.1% | 375.43x |
| overlap-n526-r500-5x | complete-true | 46.55K ops/s | 12.85M ops/s | +27496.2% | 275.96x |
| overlap-n526-r500-5x | early-true | 47.25K ops/s | 12.59M ops/s | +26540.5% | 266.40x |
| overlap-n526-r500-5x | full-execution-true | 46.70K ops/s | 12.21M ops/s | +26042.8% | 261.43x |
| overlap-n526-r500-5x | partial-true | 70.33K ops/s | 12.53M ops/s | +17717.0% | 178.17x |
| in-n1224-r1-10x | full-execution-false | 171.95K ops/s | 21.12M ops/s | +12184.6% | 122.85x |
| in-n1224-r1-10x | late-true | 179.28K ops/s | 20.54M ops/s | +11355.0% | 114.55x |
| in-n1224-r1-10x | complete-false | 187.16K ops/s | 20.53M ops/s | +10866.7% | 109.67x |
| in-n1224-r1-10x | partial-false | 235.06K ops/s | 22.54M ops/s | +9487.7% | 95.88x |
| in-n1224-r1-10x | empty-context | 236.96K ops/s | 22.20M ops/s | +9270.5% | 93.70x |
| in-n1224-r1-10x | full-execution-true | 233.98K ops/s | 19.17M ops/s | +8091.4% | 81.91x |
| in-n1224-r1-10x | partial-true | 235.52K ops/s | 19.13M ops/s | +8022.6% | 81.23x |
| in-n1224-r1-10x | early-true | 235.37K ops/s | 18.97M ops/s | +7958.4% | 80.58x |
| in-n1224-r1-10x | complete-true | 235.78K ops/s | 18.27M ops/s | +7648.4% | 77.48x |
| in-n614-r1-5x | late-true | 356.18K ops/s | 21.58M ops/s | +5958.5% | 60.58x |
| in-n614-r1-5x | full-execution-false | 371.12K ops/s | 21.40M ops/s | +5665.0% | 57.65x |
| in-n614-r1-5x | complete-false | 371.67K ops/s | 21.20M ops/s | +5604.9% | 57.05x |
=======
| overlap-n1026-r1000-10x | full-execution-true | 24.30K ops/s | 14.32M ops/s | +58848.1% | 589.48x |
| overlap-n1026-r1000-10x | complete-true | 24.88K ops/s | 14.41M ops/s | +57802.3% | 579.02x |
| overlap-n1026-r1000-10x | early-true | 24.31K ops/s | 13.77M ops/s | +56543.6% | 566.44x |
| overlap-n1026-r1000-10x | partial-true | 35.08K ops/s | 15.04M ops/s | +42777.2% | 428.77x |
| overlap-n526-r500-5x | full-execution-true | 51.53K ops/s | 14.19M ops/s | +27438.0% | 275.38x |
| overlap-n526-r500-5x | early-true | 51.34K ops/s | 13.92M ops/s | +27017.7% | 271.18x |
| overlap-n526-r500-5x | complete-true | 52.08K ops/s | 14.10M ops/s | +26977.8% | 270.78x |
| overlap-n526-r500-5x | partial-true | 70.82K ops/s | 14.09M ops/s | +19792.2% | 198.92x |
| in-n1224-r1-10x | late-true | 165.97K ops/s | 19.16M ops/s | +11442.8% | 115.43x |
| in-n1224-r1-10x | full-execution-false | 173.84K ops/s | 16.97M ops/s | +9660.9% | 97.61x |
| in-n1224-r1-10x | empty-context | 229.82K ops/s | 21.99M ops/s | +9469.0% | 95.69x |
| in-n1224-r1-10x | complete-false | 183.12K ops/s | 16.21M ops/s | +8754.5% | 88.55x |
| in-n1224-r1-10x | early-true | 226.88K ops/s | 19.07M ops/s | +8304.6% | 84.05x |
| in-n1224-r1-10x | partial-false | 230.95K ops/s | 19.18M ops/s | +8206.2% | 83.06x |
| in-n1224-r1-10x | complete-true | 229.57K ops/s | 18.96M ops/s | +8158.8% | 82.59x |
| in-n1224-r1-10x | partial-true | 230.30K ops/s | 17.26M ops/s | +7396.2% | 74.96x |
| in-n1224-r1-10x | full-execution-true | 230.34K ops/s | 16.87M ops/s | +7224.8% | 73.25x |
| in-n614-r1-5x | late-true | 353.22K ops/s | 20.55M ops/s | +5717.7% | 58.18x |
| in-n614-r1-5x | complete-false | 366.78K ops/s | 19.75M ops/s | +5283.5% | 53.83x |
| in-n614-r1-5x | full-execution-false | 365.99K ops/s | 19.68M ops/s | +5278.0% | 53.78x |
>>>>>>> 4a338e0 (add a new test case and rerun bench)

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
<<<<<<< HEAD
| expression-medium-or | early-true | 17.08M ops/s | 16.70M ops/s | -2.2% | 0.98x |
| expression-medium-or | partial-true | 17.04M ops/s | 17.01M ops/s | -0.2% | 1.00x |
| expression-medium-or | partial-false | 7.22M ops/s | 7.38M ops/s | +2.2% | 1.02x |
| expression-medium-or | full-execution-false | 7.37M ops/s | 7.60M ops/s | +3.1% | 1.03x |
| expression-medium-or | empty-context | 7.21M ops/s | 7.47M ops/s | +3.7% | 1.04x |
| expression-medium-or | complete-true | 16.20M ops/s | 17.08M ops/s | +5.4% | 1.05x |
| expression-medium-or | complete-false | 7.26M ops/s | 7.67M ops/s | +5.6% | 1.06x |
| expression-medium-or | full-execution-true | 7.04M ops/s | 7.62M ops/s | +8.1% | 1.08x |
| expression-medium-or | late-true | 6.96M ops/s | 7.60M ops/s | +9.2% | 1.09x |
| expression-deep-nested | full-execution-false | 3.18M ops/s | 3.63M ops/s | +14.0% | 1.14x |
| expression-deep-nested | late-true | 3.17M ops/s | 3.64M ops/s | +14.8% | 1.15x |
| expression-reference-nested | complete-false | 10.34M ops/s | 12.35M ops/s | +19.5% | 1.19x |
| expression-reference-nested | empty-context | 11.21M ops/s | 13.60M ops/s | +21.3% | 1.21x |
| expression-reference-nested | full-execution-false | 5.61M ops/s | 6.96M ops/s | +24.1% | 1.24x |
| expression-reference-nested | partial-false | 11.14M ops/s | 14.27M ops/s | +28.1% | 1.28x |
| expression-deep-nested | partial-false | 11.12M ops/s | 14.31M ops/s | +28.8% | 1.29x |
| expression-deep-nested | empty-context | 11.09M ops/s | 14.42M ops/s | +30.0% | 1.30x |
| expression-deep-nested | complete-false | 10.09M ops/s | 13.19M ops/s | +30.7% | 1.31x |
| expression-complex-nested | full-execution-false | 6.72M ops/s | 9.69M ops/s | +44.3% | 1.44x |
| expression-complex-nested | partial-false | 11.18M ops/s | 16.29M ops/s | +45.7% | 1.46x |
||||||| parent of 4a338e0 (add a new test case and rerun bench)
| expression-medium-or | early-true | 17.36M ops/s | 16.66M ops/s | -4.1% | 0.96x |
| expression-medium-or | complete-true | 17.30M ops/s | 16.84M ops/s | -2.7% | 0.97x |
| expression-medium-or | partial-true | 17.30M ops/s | 16.89M ops/s | -2.4% | 0.98x |
| expression-medium-or | partial-false | 7.23M ops/s | 7.29M ops/s | +0.7% | 1.01x |
| expression-medium-or | empty-context | 7.33M ops/s | 7.45M ops/s | +1.6% | 1.02x |
| expression-medium-or | complete-false | 7.42M ops/s | 7.59M ops/s | +2.3% | 1.02x |
| expression-medium-or | full-execution-false | 7.34M ops/s | 7.55M ops/s | +2.9% | 1.03x |
| expression-medium-or | full-execution-true | 7.06M ops/s | 7.66M ops/s | +8.5% | 1.08x |
| expression-medium-or | late-true | 6.95M ops/s | 7.63M ops/s | +9.8% | 1.10x |
| expression-deep-nested | late-true | 3.19M ops/s | 3.58M ops/s | +12.2% | 1.12x |
| expression-deep-nested | full-execution-false | 3.15M ops/s | 3.60M ops/s | +14.3% | 1.14x |
| expression-reference-nested | complete-false | 10.35M ops/s | 12.33M ops/s | +19.1% | 1.19x |
| expression-reference-nested | full-execution-false | 5.65M ops/s | 6.91M ops/s | +22.4% | 1.22x |
| expression-reference-nested | partial-false | 11.22M ops/s | 14.01M ops/s | +25.0% | 1.25x |
| expression-deep-nested | partial-false | 11.25M ops/s | 14.10M ops/s | +25.3% | 1.25x |
| expression-deep-nested | complete-false | 10.26M ops/s | 12.88M ops/s | +25.5% | 1.26x |
| expression-reference-nested | empty-context | 11.27M ops/s | 14.16M ops/s | +25.7% | 1.26x |
| expression-deep-nested | empty-context | 11.27M ops/s | 14.27M ops/s | +26.7% | 1.27x |
| expression-complex-nested | full-execution-false | 6.78M ops/s | 9.56M ops/s | +40.9% | 1.41x |
| expression-medium-and | empty-context | 11.30M ops/s | 16.09M ops/s | +42.4% | 1.42x |
=======
| expression-medium-or | partial-true | 17.69M ops/s | 16.74M ops/s | -5.4% | 0.95x |
| expression-medium-or | early-true | 17.54M ops/s | 16.72M ops/s | -4.7% | 0.95x |
| expression-medium-or | complete-true | 17.56M ops/s | 17.23M ops/s | -1.9% | 0.98x |
| expression-medium-or | full-execution-true | 7.24M ops/s | 7.24M ops/s | -0.0% | 1.00x |
| expression-medium-or | full-execution-false | 7.52M ops/s | 7.63M ops/s | +1.3% | 1.01x |
| expression-medium-or | empty-context | 7.34M ops/s | 7.44M ops/s | +1.4% | 1.01x |
| expression-medium-or | partial-false | 7.31M ops/s | 7.42M ops/s | +1.5% | 1.02x |
| expression-medium-or | complete-false | 7.50M ops/s | 7.62M ops/s | +1.6% | 1.02x |
| expression-medium-or | late-true | 7.21M ops/s | 7.59M ops/s | +5.4% | 1.05x |
| expression-deep-nested | late-true | 3.09M ops/s | 3.56M ops/s | +15.1% | 1.15x |
| expression-deep-nested | full-execution-false | 3.08M ops/s | 3.55M ops/s | +15.3% | 1.15x |
| expression-reference-nested | complete-false | 10.50M ops/s | 12.37M ops/s | +17.8% | 1.18x |
| expression-deep-nested | partial-false | 11.29M ops/s | 13.99M ops/s | +23.9% | 1.24x |
| expression-reference-nested | full-execution-false | 5.56M ops/s | 6.93M ops/s | +24.5% | 1.24x |
| expression-deep-nested | empty-context | 11.41M ops/s | 14.30M ops/s | +25.3% | 1.25x |
| expression-reference-nested | partial-false | 11.29M ops/s | 14.17M ops/s | +25.5% | 1.26x |
| expression-reference-nested | empty-context | 11.29M ops/s | 14.44M ops/s | +27.9% | 1.28x |
| expression-deep-nested | complete-false | 10.08M ops/s | 12.90M ops/s | +27.9% | 1.28x |
| expression-medium-and | full-execution-false | 6.82M ops/s | 9.14M ops/s | +34.0% | 1.34x |
| expression-medium-and | empty-context | 11.46M ops/s | 16.50M ops/s | +43.9% | 1.44x |
>>>>>>> 4a338e0 (add a new test case and rerun bench)

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| expression-medium-or | partial-true | 17.69M ops/s | 16.74M ops/s | -5.4% | 0.95x |

