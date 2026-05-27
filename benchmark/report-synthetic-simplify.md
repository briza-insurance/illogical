# Benchmark Comparison Report — simplify

**Baseline:** `results-synthetic-simplify-oop.json`
**Improved:** `results-synthetic-simplify-bytecode.json`
**Total cases compared:** 85

## Summary

| | Count |
|---|---|
<<<<<<< HEAD
| Faster (>+5%) | 67 |
| Slower (>-5%) | 6 |
| Unchanged | 9 |
||||||| parent of 4a338e0 (add a new test case and rerun bench)
| Faster (>+5%) | 66 |
| Slower (>-5%) | 1 |
| Unchanged | 15 |
=======
| Faster (>+5%) | 67 |
| Slower (>-5%) | 2 |
| Unchanged | 16 |
>>>>>>> 4a338e0 (add a new test case and rerun bench)

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
<<<<<<< HEAD
| in-n1224-r1-10x | full-execution-false | 87.49K ops/s | 9.66M ops/s | +10942.5% | 110.43x |
| in-n1224-r1-10x | complete-false | 86.09K ops/s | 9.49M ops/s | +10925.3% | 110.25x |
| in-n1224-r1-10x | full-execution-true | 93.72K ops/s | 9.05M ops/s | +9554.5% | 96.54x |
| in-n1224-r1-10x | complete-true | 94.28K ops/s | 9.09M ops/s | +9540.5% | 96.40x |
| in-n1224-r1-10x | partial-true | 94.21K ops/s | 9.03M ops/s | +9489.2% | 95.89x |
| in-n1224-r1-10x | partial-false | 91.49K ops/s | 8.51M ops/s | +9198.4% | 92.98x |
| in-n1224-r1-10x | empty-context | 92.60K ops/s | 8.46M ops/s | +9040.2% | 91.40x |
| in-n614-r1-5x | full-execution-false | 172.59K ops/s | 9.64M ops/s | +5482.9% | 55.83x |
| in-n614-r1-5x | complete-false | 174.82K ops/s | 9.63M ops/s | +5409.3% | 55.09x |
| in-n614-r1-5x | partial-true | 187.26K ops/s | 9.64M ops/s | +5047.1% | 51.47x |
| in-n614-r1-5x | full-execution-true | 187.45K ops/s | 9.58M ops/s | +5008.5% | 51.09x |
| in-n614-r1-5x | complete-true | 189.25K ops/s | 9.61M ops/s | +4978.0% | 50.78x |
| in-n614-r1-5x | empty-context | 169.94K ops/s | 8.37M ops/s | +4826.0% | 49.26x |
| in-n614-r1-5x | partial-false | 187.66K ops/s | 8.40M ops/s | +4376.5% | 44.77x |
| overlap-n447-r50-10x | empty-context | 290.31K ops/s | 9.09M ops/s | +3032.9% | 31.33x |
| overlap-n447-r50-10x | partial-false | 290.87K ops/s | 9.10M ops/s | +3028.5% | 31.29x |
| overlap-n447-r50-10x | complete-true | 285.62K ops/s | 7.98M ops/s | +2693.4% | 27.93x |
| overlap-n447-r50-10x | full-execution-true | 287.12K ops/s | 7.95M ops/s | +2669.4% | 27.69x |
| overlap-n447-r50-10x | partial-true | 286.66K ops/s | 7.26M ops/s | +2432.2% | 25.32x |
| overlap-n447-r50-10x | complete-false | 45.58K ops/s | 838.82K ops/s | +1740.1% | 18.40x |
||||||| parent of 4a338e0 (add a new test case and rerun bench)
| in-n1224-r1-10x | full-execution-false | 84.86K ops/s | 9.90M ops/s | +11565.3% | 116.65x |
| in-n1224-r1-10x | complete-false | 86.31K ops/s | 9.92M ops/s | +11388.5% | 114.88x |
| in-n1224-r1-10x | complete-true | 92.92K ops/s | 9.29M ops/s | +9893.1% | 99.93x |
| in-n1224-r1-10x | full-execution-true | 93.34K ops/s | 9.28M ops/s | +9841.3% | 99.41x |
| in-n1224-r1-10x | partial-true | 93.52K ops/s | 9.10M ops/s | +9628.3% | 97.28x |
| in-n1224-r1-10x | empty-context | 91.66K ops/s | 8.62M ops/s | +9301.2% | 94.01x |
| in-n1224-r1-10x | partial-false | 90.89K ops/s | 8.51M ops/s | +9260.0% | 93.60x |
| in-n614-r1-5x | full-execution-false | 174.20K ops/s | 10.01M ops/s | +5648.0% | 57.48x |
| in-n614-r1-5x | complete-false | 172.71K ops/s | 9.81M ops/s | +5580.7% | 56.81x |
| in-n614-r1-5x | complete-true | 187.26K ops/s | 9.53M ops/s | +4990.2% | 50.90x |
| in-n614-r1-5x | partial-true | 189.72K ops/s | 9.49M ops/s | +4902.3% | 50.02x |
| in-n614-r1-5x | full-execution-true | 190.46K ops/s | 9.45M ops/s | +4861.2% | 49.61x |
| in-n614-r1-5x | empty-context | 188.98K ops/s | 8.67M ops/s | +4487.1% | 45.87x |
| in-n614-r1-5x | partial-false | 188.88K ops/s | 8.51M ops/s | +4406.5% | 45.06x |
| overlap-n447-r50-10x | partial-false | 286.86K ops/s | 9.21M ops/s | +3109.6% | 32.10x |
| overlap-n447-r50-10x | empty-context | 289.51K ops/s | 9.15M ops/s | +3061.4% | 31.61x |
| overlap-n447-r50-10x | complete-true | 279.21K ops/s | 8.01M ops/s | +2768.5% | 28.68x |
| overlap-n447-r50-10x | full-execution-true | 282.64K ops/s | 8.00M ops/s | +2728.9% | 28.29x |
| overlap-n447-r50-10x | partial-true | 283.14K ops/s | 6.81M ops/s | +2305.2% | 24.05x |
| overlap-n252-r25-5x | partial-false | 514.52K ops/s | 9.36M ops/s | +1719.4% | 18.19x |
=======
| in-n1224-r1-10x | full-execution-false | 86.90K ops/s | 9.74M ops/s | +11104.3% | 112.04x |
| in-n1224-r1-10x | complete-false | 87.42K ops/s | 9.78M ops/s | +11084.6% | 111.85x |
| in-n1224-r1-10x | complete-true | 93.86K ops/s | 9.64M ops/s | +10174.0% | 102.74x |
| in-n1224-r1-10x | full-execution-true | 93.76K ops/s | 9.57M ops/s | +10108.7% | 102.09x |
| in-n1224-r1-10x | partial-true | 94.66K ops/s | 9.52M ops/s | +9952.7% | 100.53x |
| in-n1224-r1-10x | empty-context | 89.62K ops/s | 8.69M ops/s | +9595.2% | 96.95x |
| in-n1224-r1-10x | partial-false | 91.52K ops/s | 8.67M ops/s | +9368.7% | 94.69x |
| in-n614-r1-5x | full-execution-false | 169.87K ops/s | 9.86M ops/s | +5705.7% | 58.06x |
| in-n614-r1-5x | complete-false | 175.23K ops/s | 9.84M ops/s | +5517.5% | 56.17x |
| in-n614-r1-5x | empty-context | 180.18K ops/s | 8.83M ops/s | +4802.6% | 49.03x |
| in-n614-r1-5x | full-execution-true | 185.15K ops/s | 9.06M ops/s | +4793.9% | 48.94x |
| in-n614-r1-5x | complete-true | 186.67K ops/s | 9.04M ops/s | +4744.4% | 48.44x |
| in-n614-r1-5x | partial-true | 190.71K ops/s | 8.99M ops/s | +4614.1% | 47.14x |
| in-n614-r1-5x | partial-false | 190.00K ops/s | 8.82M ops/s | +4540.3% | 46.40x |
| overlap-n447-r50-10x | empty-context | 288.37K ops/s | 9.09M ops/s | +3052.0% | 31.52x |
| overlap-n447-r50-10x | partial-false | 291.14K ops/s | 8.98M ops/s | +2985.6% | 30.86x |
| overlap-n447-r50-10x | full-execution-true | 258.84K ops/s | 7.89M ops/s | +2946.3% | 30.46x |
| overlap-n447-r50-10x | complete-true | 286.95K ops/s | 7.66M ops/s | +2567.8% | 26.68x |
| overlap-n447-r50-10x | partial-true | 289.14K ops/s | 7.62M ops/s | +2535.5% | 26.35x |
| overlap-n252-r25-5x | partial-false | 512.11K ops/s | 8.87M ops/s | +1632.8% | 17.33x |
>>>>>>> 4a338e0 (add a new test case and rerun bench)

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
<<<<<<< HEAD
| expression-medium-or | partial-true | 8.18M ops/s | 7.60M ops/s | -7.1% | 0.93x |
| expression-simple-eq | empty-context | 8.42M ops/s | 7.83M ops/s | -7.0% | 0.93x |
| expression-simple-ne | full-execution-true | 8.60M ops/s | 8.00M ops/s | -7.0% | 0.93x |
| expression-simple-ne | empty-context | 8.41M ops/s | 7.86M ops/s | -6.5% | 0.93x |
| expression-simple-ne | partial-true | 8.40M ops/s | 7.95M ops/s | -5.3% | 0.95x |
| expression-medium-or | complete-true | 8.13M ops/s | 7.70M ops/s | -5.3% | 0.95x |
| expression-simple-eq | partial-false | 8.29M ops/s | 7.91M ops/s | -4.6% | 0.95x |
| expression-simple-ne | complete-true | 10.17M ops/s | 10.17M ops/s | -0.0% | 1.00x |
| expression-medium-and | complete-false | 7.79M ops/s | 7.82M ops/s | +0.4% | 1.00x |
| expression-deep-nested | complete-false | 7.20M ops/s | 7.27M ops/s | +1.1% | 1.01x |
| expression-simple-eq | partial-true | 9.92M ops/s | 10.15M ops/s | +2.3% | 1.02x |
| expression-complex-nested | complete-false | 7.43M ops/s | 7.68M ops/s | +3.5% | 1.03x |
| expression-simple-eq | full-execution-true | 9.88M ops/s | 10.28M ops/s | +4.0% | 1.04x |
| expression-simple-eq | complete-true | 9.92M ops/s | 10.32M ops/s | +4.1% | 1.04x |
| expression-simple-eq | complete-false | 9.81M ops/s | 10.30M ops/s | +5.0% | 1.05x |
| expression-simple-eq | full-execution-false | 9.82M ops/s | 10.32M ops/s | +5.2% | 1.05x |
| expression-reference-nested | full-execution-false | 3.86M ops/s | 4.07M ops/s | +5.3% | 1.05x |
| expression-reference-nested | complete-false | 6.88M ops/s | 7.24M ops/s | +5.3% | 1.05x |
| expression-arithmetic | full-execution-false | 2.18M ops/s | 2.38M ops/s | +9.0% | 1.09x |
| expression-arithmetic | empty-context | 2.13M ops/s | 2.37M ops/s | +11.0% | 1.11x |
||||||| parent of 4a338e0 (add a new test case and rerun bench)
| expression-medium-or | partial-true | 7.90M ops/s | 7.45M ops/s | -5.7% | 0.94x |
| expression-simple-ne | empty-context | 8.31M ops/s | 8.06M ops/s | -3.0% | 0.97x |
| expression-simple-ne | partial-true | 8.38M ops/s | 8.13M ops/s | -3.0% | 0.97x |
| expression-simple-eq | partial-false | 8.31M ops/s | 8.07M ops/s | -2.8% | 0.97x |
| expression-medium-or | complete-true | 7.98M ops/s | 7.76M ops/s | -2.7% | 0.97x |
| expression-simple-ne | full-execution-true | 8.55M ops/s | 8.33M ops/s | -2.6% | 0.97x |
| expression-simple-ne | complete-true | 10.24M ops/s | 10.14M ops/s | -1.0% | 0.99x |
| expression-deep-nested | complete-false | 7.23M ops/s | 7.25M ops/s | +0.3% | 1.00x |
| expression-medium-and | complete-false | 7.81M ops/s | 7.83M ops/s | +0.3% | 1.00x |
| expression-reference-nested | complete-false | 7.20M ops/s | 7.26M ops/s | +0.9% | 1.01x |
| expression-simple-eq | partial-true | 10.07M ops/s | 10.27M ops/s | +2.0% | 1.02x |
| expression-simple-eq | complete-true | 10.02M ops/s | 10.24M ops/s | +2.2% | 1.02x |
| expression-simple-eq | full-execution-true | 9.95M ops/s | 10.25M ops/s | +3.0% | 1.03x |
| expression-simple-eq | complete-false | 9.86M ops/s | 10.22M ops/s | +3.6% | 1.04x |
| expression-simple-eq | full-execution-false | 9.90M ops/s | 10.29M ops/s | +4.0% | 1.04x |
| expression-complex-nested | complete-false | 7.45M ops/s | 7.79M ops/s | +4.5% | 1.05x |
| expression-reference-nested | full-execution-false | 3.87M ops/s | 4.16M ops/s | +7.6% | 1.08x |
| expression-simple-eq | empty-context | 7.27M ops/s | 8.05M ops/s | +10.7% | 1.11x |
| expression-arithmetic | partial-false | 2.13M ops/s | 2.38M ops/s | +12.0% | 1.12x |
| expression-arithmetic | full-execution-false | 2.16M ops/s | 2.43M ops/s | +12.4% | 1.12x |
=======
| expression-medium-or | complete-true | 8.28M ops/s | 7.74M ops/s | -6.5% | 0.93x |
| expression-medium-or | partial-true | 8.15M ops/s | 7.71M ops/s | -5.4% | 0.95x |
| expression-simple-eq | partial-false | 8.39M ops/s | 8.04M ops/s | -4.1% | 0.96x |
| expression-simple-ne | partial-true | 8.36M ops/s | 8.04M ops/s | -3.8% | 0.96x |
| expression-simple-ne | full-execution-true | 8.59M ops/s | 8.27M ops/s | -3.7% | 0.96x |
| expression-simple-eq | empty-context | 8.31M ops/s | 8.15M ops/s | -2.0% | 0.98x |
| expression-deep-nested | complete-false | 7.19M ops/s | 7.07M ops/s | -1.8% | 0.98x |
| expression-deep-nested | full-execution-false | 1.93M ops/s | 1.90M ops/s | -1.6% | 0.98x |
| expression-simple-ne | empty-context | 8.38M ops/s | 8.24M ops/s | -1.6% | 0.98x |
| expression-reference-nested | complete-false | 7.31M ops/s | 7.21M ops/s | -1.3% | 0.99x |
| expression-simple-eq | complete-true | 10.07M ops/s | 9.96M ops/s | -1.2% | 0.99x |
| expression-simple-ne | complete-true | 10.34M ops/s | 10.32M ops/s | -0.2% | 1.00x |
| expression-medium-and | complete-false | 7.77M ops/s | 7.81M ops/s | +0.4% | 1.00x |
| expression-simple-eq | partial-true | 10.07M ops/s | 10.13M ops/s | +0.6% | 1.01x |
| expression-simple-eq | full-execution-true | 10.07M ops/s | 10.14M ops/s | +0.7% | 1.01x |
| expression-simple-eq | full-execution-false | 9.92M ops/s | 10.16M ops/s | +2.4% | 1.02x |
| expression-simple-eq | complete-false | 9.83M ops/s | 10.21M ops/s | +3.9% | 1.04x |
| expression-complex-nested | complete-false | 7.42M ops/s | 7.76M ops/s | +4.5% | 1.05x |
| expression-reference-nested | full-execution-false | 3.78M ops/s | 4.05M ops/s | +7.2% | 1.07x |
| expression-arithmetic | full-execution-false | 2.19M ops/s | 2.39M ops/s | +9.1% | 1.09x |
>>>>>>> 4a338e0 (add a new test case and rerun bench)

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
<<<<<<< HEAD
| expression-medium-or | partial-true | 8.18M ops/s | 7.60M ops/s | -7.1% | 0.93x |
| expression-simple-eq | empty-context | 8.42M ops/s | 7.83M ops/s | -7.0% | 0.93x |
| expression-simple-ne | full-execution-true | 8.60M ops/s | 8.00M ops/s | -7.0% | 0.93x |
| expression-simple-ne | empty-context | 8.41M ops/s | 7.86M ops/s | -6.5% | 0.93x |
| expression-simple-ne | partial-true | 8.40M ops/s | 7.95M ops/s | -5.3% | 0.95x |
| expression-medium-or | complete-true | 8.13M ops/s | 7.70M ops/s | -5.3% | 0.95x |
||||||| parent of 4a338e0 (add a new test case and rerun bench)
| expression-medium-or | partial-true | 7.90M ops/s | 7.45M ops/s | -5.7% | 0.94x |
=======
| expression-medium-or | complete-true | 8.28M ops/s | 7.74M ops/s | -6.5% | 0.93x |
| expression-medium-or | partial-true | 8.15M ops/s | 7.71M ops/s | -5.4% | 0.95x |
>>>>>>> 4a338e0 (add a new test case and rerun bench)

