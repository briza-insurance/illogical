# Benchmark Comparison Report — evaluate

**Baseline:** `results-synthetic-evaluate-oop.json`
**Improved:** `results-synthetic-evaluate-bytecode.json`
**Total cases compared:** 106

## Summary

|               | Count |
| ------------- | ----- |
| Faster (>+5%) | 81    |
| Slower (>-5%) | 12    |
| Unchanged     | 13    |

---

## evaluate

### Top 20 Most Improved

| Group                   | Case                 | Baseline      | Improved     | Delta     | Multiplier |
| ----------------------- | -------------------- | ------------- | ------------ | --------- | ---------- |
| overlap-n1026-r1000-10x | complete-true        | 31.92K ops/s  | 14.63M ops/s | +45719.9% | 458.20x    |
| overlap-n1026-r1000-10x | full-execution-true  | 31.90K ops/s  | 14.37M ops/s | +44942.2% | 450.42x    |
| overlap-n1026-r1000-10x | early-true           | 32.29K ops/s  | 14.43M ops/s | +44584.4% | 446.84x    |
| overlap-n1026-r1000-10x | partial-true         | 44.12K ops/s  | 15.28M ops/s | +34534.3% | 346.34x    |
| overlap-n526-r500-5x    | complete-true        | 56.32K ops/s  | 14.36M ops/s | +25402.7% | 255.03x    |
| overlap-n526-r500-5x    | early-true           | 66.98K ops/s  | 14.04M ops/s | +20868.2% | 209.68x    |
| overlap-n526-r500-5x    | full-execution-true  | 66.69K ops/s  | 13.71M ops/s | +20462.8% | 205.63x    |
| overlap-n526-r500-5x    | partial-true         | 92.07K ops/s  | 14.57M ops/s | +15720.6% | 158.21x    |
| in-n1224-r1-10x         | late-true            | 263.62K ops/s | 19.69M ops/s | +7368.9%  | 74.69x     |
| in-n1224-r1-10x         | complete-false       | 270.25K ops/s | 18.84M ops/s | +6872.7%  | 69.73x     |
| in-n1224-r1-10x         | partial-false        | 328.03K ops/s | 22.40M ops/s | +6727.6%  | 68.28x     |
| in-n1224-r1-10x         | full-execution-false | 271.74K ops/s | 18.53M ops/s | +6720.5%  | 68.20x     |
| in-n1224-r1-10x         | empty-context        | 332.76K ops/s | 21.85M ops/s | +6467.1%  | 65.67x     |
| in-n1224-r1-10x         | partial-true         | 331.65K ops/s | 19.15M ops/s | +5673.8%  | 57.74x     |
| in-n1224-r1-10x         | full-execution-true  | 332.73K ops/s | 18.91M ops/s | +5584.1%  | 56.84x     |
| in-n1224-r1-10x         | early-true           | 332.97K ops/s | 18.84M ops/s | +5558.7%  | 56.59x     |
| in-n1224-r1-10x         | complete-true        | 331.93K ops/s | 18.58M ops/s | +5496.1%  | 55.96x     |
| in-n614-r1-5x           | late-true            | 499.54K ops/s | 20.59M ops/s | +4022.4%  | 41.22x     |
| in-n614-r1-5x           | full-execution-false | 507.80K ops/s | 20.63M ops/s | +3963.4%  | 40.63x     |
| in-n614-r1-5x           | complete-false       | 548.03K ops/s | 20.99M ops/s | +3729.7%  | 38.30x     |

### Top 20 Least Improved

| Group                       | Case                 | Baseline     | Improved     | Delta  | Multiplier |
| --------------------------- | -------------------- | ------------ | ------------ | ------ | ---------- |
| expression-medium-or        | complete-true        | 20.77M ops/s | 15.90M ops/s | -23.5% | 0.77x      |
| expression-medium-or        | partial-true         | 20.50M ops/s | 15.85M ops/s | -22.7% | 0.77x      |
| expression-medium-or        | early-true           | 20.36M ops/s | 15.98M ops/s | -21.5% | 0.79x      |
| expression-medium-or        | empty-context        | 10.54M ops/s | 8.39M ops/s  | -20.4% | 0.80x      |
| expression-medium-or        | partial-false        | 9.93M ops/s  | 8.22M ops/s  | -17.3% | 0.83x      |
| expression-medium-or        | complete-false       | 10.66M ops/s | 8.83M ops/s  | -17.2% | 0.83x      |
| expression-medium-or        | late-true            | 10.55M ops/s | 8.80M ops/s  | -16.5% | 0.83x      |
| expression-medium-or        | full-execution-true  | 10.43M ops/s | 8.81M ops/s  | -15.5% | 0.85x      |
| expression-medium-or        | full-execution-false | 10.31M ops/s | 8.84M ops/s  | -14.3% | 0.86x      |
| expression-deep-nested      | partial-false        | 15.00M ops/s | 13.76M ops/s | -8.3%  | 0.92x      |
| expression-deep-nested      | empty-context        | 14.96M ops/s | 14.11M ops/s | -5.7%  | 0.94x      |
| expression-date-arithmetic  | empty-context        | 15.92M ops/s | 15.10M ops/s | -5.2%  | 0.95x      |
| expression-date-arithmetic  | partial-false        | 15.46M ops/s | 14.86M ops/s | -3.9%  | 0.96x      |
| expression-reference-nested | partial-false        | 14.62M ops/s | 14.08M ops/s | -3.7%  | 0.96x      |
| expression-reference-nested | complete-false       | 13.35M ops/s | 13.21M ops/s | -1.0%  | 0.99x      |
| expression-reference-nested | empty-context        | 14.49M ops/s | 14.36M ops/s | -0.8%  | 0.99x      |
| expression-deep-nested      | late-true            | 4.32M ops/s  | 4.30M ops/s  | -0.6%  | 0.99x      |
| expression-deep-nested      | full-execution-false | 4.34M ops/s  | 4.32M ops/s  | -0.3%  | 1.00x      |
| expression-medium-and       | empty-context        | 15.71M ops/s | 15.81M ops/s | +0.6%  | 1.01x      |
| expression-deep-nested      | complete-false       | 13.31M ops/s | 13.46M ops/s | +1.1%  | 1.01x      |

### Regressions

| Group                      | Case                 | Baseline     | Improved     | Delta  | Multiplier |
| -------------------------- | -------------------- | ------------ | ------------ | ------ | ---------- |
| expression-medium-or       | complete-true        | 20.77M ops/s | 15.90M ops/s | -23.5% | 0.77x      |
| expression-medium-or       | partial-true         | 20.50M ops/s | 15.85M ops/s | -22.7% | 0.77x      |
| expression-medium-or       | early-true           | 20.36M ops/s | 15.98M ops/s | -21.5% | 0.79x      |
| expression-medium-or       | empty-context        | 10.54M ops/s | 8.39M ops/s  | -20.4% | 0.80x      |
| expression-medium-or       | partial-false        | 9.93M ops/s  | 8.22M ops/s  | -17.3% | 0.83x      |
| expression-medium-or       | complete-false       | 10.66M ops/s | 8.83M ops/s  | -17.2% | 0.83x      |
| expression-medium-or       | late-true            | 10.55M ops/s | 8.80M ops/s  | -16.5% | 0.83x      |
| expression-medium-or       | full-execution-true  | 10.43M ops/s | 8.81M ops/s  | -15.5% | 0.85x      |
| expression-medium-or       | full-execution-false | 10.31M ops/s | 8.84M ops/s  | -14.3% | 0.86x      |
| expression-deep-nested     | partial-false        | 15.00M ops/s | 13.76M ops/s | -8.3%  | 0.92x      |
| expression-deep-nested     | empty-context        | 14.96M ops/s | 14.11M ops/s | -5.7%  | 0.94x      |
| expression-date-arithmetic | empty-context        | 15.92M ops/s | 15.10M ops/s | -5.2%  | 0.95x      |
