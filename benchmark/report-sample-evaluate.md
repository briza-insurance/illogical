# Benchmark Comparison Report — evaluate

**Baseline:** `results-sample-evaluate-oop.json`
**Improved:** `results-sample-evaluate-bytecode.json`
**Total cases compared:** 792

## Summary

|               | Count |
| ------------- | ----- |
| Faster (>+5%) | 788   |
| Slower (>-5%) | 3     |
| Unchanged     | 1     |

---

## evaluate

### Top 20 Most Improved

| Group                 | Case                 | Baseline      | Improved     | Delta     | Multiplier |
| --------------------- | -------------------- | ------------- | ------------ | --------- | ---------- |
| or-n4691-r2-001       | full-execution-false | 57.47K ops/s  | 13.01M ops/s | +22536.6% | 226.37x    |
| or-n4691-r2-001       | full-execution-true  | 58.28K ops/s  | 12.38M ops/s | +21148.0% | 212.48x    |
| or-n4691-r2-001       | late-true            | 59.04K ops/s  | 12.07M ops/s | +20344.4% | 204.44x    |
| or-n4691-r2-001       | empty-context        | 102.43K ops/s | 18.14M ops/s | +17609.2% | 177.09x    |
| or-n4691-r2-001       | partial-false        | 101.45K ops/s | 17.36M ops/s | +17007.4% | 171.07x    |
| or-n4691-r2-001       | complete-false       | 70.97K ops/s  | 8.51M ops/s  | +11891.3% | 119.91x    |
| or-n3412-r101-001     | early-true           | 104.61K ops/s | 11.63M ops/s | +11022.3% | 111.22x    |
| or-n3412-r101-001     | complete-true        | 109.07K ops/s | 11.73M ops/s | +10656.5% | 107.57x    |
| or-n3412-r101-001     | partial-true         | 113.26K ops/s | 11.97M ops/s | +10468.5% | 105.69x    |
| or-n1968-r105-001     | complete-true        | 136.74K ops/s | 11.13M ops/s | +8040.7%  | 81.41x     |
| or-n1968-r105-001     | early-true           | 146.02K ops/s | 11.32M ops/s | +7654.0%  | 77.54x     |
| or-n1968-r105-001     | partial-true         | 158.99K ops/s | 11.53M ops/s | +7150.0%  | 72.50x     |
| overlap-n105-r100-012 | complete-true        | 287.93K ops/s | 19.13M ops/s | +6542.9%  | 66.43x     |
| overlap-n105-r100-004 | full-execution-true  | 314.38K ops/s | 19.49M ops/s | +6099.2%  | 61.99x     |
| overlap-n105-r100-011 | complete-true        | 319.18K ops/s | 19.68M ops/s | +6065.2%  | 61.65x     |
| overlap-n105-r100-011 | early-true           | 320.95K ops/s | 19.72M ops/s | +6043.2%  | 61.43x     |
| overlap-n105-r100-007 | complete-true        | 315.07K ops/s | 19.22M ops/s | +6000.3%  | 61.00x     |
| overlap-n105-r100-008 | early-true           | 319.53K ops/s | 19.49M ops/s | +5999.7%  | 61.00x     |
| overlap-n105-r100-012 | early-true           | 318.57K ops/s | 19.35M ops/s | +5973.1%  | 60.73x     |
| overlap-n105-r100-021 | complete-true        | 316.69K ops/s | 19.15M ops/s | +5946.3%  | 60.46x     |

### Top 20 Least Improved

| Group                     | Case                 | Baseline      | Improved      | Delta  | Multiplier |
| ------------------------- | -------------------- | ------------- | ------------- | ------ | ---------- |
| 249-and-or-eqs            | complete-false       | 17.28M ops/s  | 11.40M ops/s  | -34.0% | 0.66x      |
| 249-and-or-eqs            | empty-context        | 16.56M ops/s  | 11.86M ops/s  | -28.4% | 0.72x      |
| 249-and-or-eqs            | partial-false        | 15.73M ops/s  | 11.61M ops/s  | -26.2% | 0.74x      |
| 249-and-or-eqs            | complete-true        | 6.21M ops/s   | 6.46M ops/s   | +4.1%  | 1.04x      |
| 249-and-or-eqs            | partial-true         | 5.94M ops/s   | 6.84M ops/s   | +15.2% | 1.15x      |
| 249-and-or-eqs            | early-true           | 5.91M ops/s   | 6.82M ops/s   | +15.4% | 1.15x      |
| 251-or-and-in-mixed-eq-in | partial-true         | 12.01M ops/s  | 16.84M ops/s  | +40.2% | 1.40x      |
| 250-or-and-in             | complete-true        | 11.71M ops/s  | 16.52M ops/s  | +41.0% | 1.41x      |
| 251-or-and-in-mixed-eq-in | early-true           | 11.64M ops/s  | 16.54M ops/s  | +42.0% | 1.42x      |
| 250-or-and-in             | early-true           | 11.37M ops/s  | 16.15M ops/s  | +42.1% | 1.42x      |
| 251-or-and-in-mixed-eq-in | complete-true        | 11.72M ops/s  | 16.75M ops/s  | +42.9% | 1.43x      |
| 250-or-and-in             | partial-true         | 11.55M ops/s  | 16.71M ops/s  | +44.7% | 1.45x      |
| 249-and-or-eqs            | late-true            | 4.41M ops/s   | 6.85M ops/s   | +55.4% | 1.55x      |
| overlap-n108-r100-002     | complete-false       | 304.80K ops/s | 492.98K ops/s | +61.7% | 1.62x      |
| overlap-n108-r100-002     | full-execution-false | 301.33K ops/s | 491.37K ops/s | +63.1% | 1.63x      |
| 249-and-or-eqs            | full-execution-false | 4.21M ops/s   | 6.92M ops/s   | +64.3% | 1.64x      |
| overlap-n107-r100-001     | full-execution-false | 310.55K ops/s | 511.65K ops/s | +64.8% | 1.65x      |
| overlap-n105-r100-006     | complete-false       | 305.61K ops/s | 506.04K ops/s | +65.6% | 1.66x      |
| overlap-n107-r100-001     | complete-false       | 310.17K ops/s | 516.55K ops/s | +66.5% | 1.67x      |
| 250-or-and-in             | empty-context        | 11.33M ops/s  | 18.94M ops/s  | +67.1% | 1.67x      |

### Regressions

| Group          | Case           | Baseline     | Improved     | Delta  | Multiplier |
| -------------- | -------------- | ------------ | ------------ | ------ | ---------- |
| 249-and-or-eqs | complete-false | 17.28M ops/s | 11.40M ops/s | -34.0% | 0.66x      |
| 249-and-or-eqs | empty-context  | 16.56M ops/s | 11.86M ops/s | -28.4% | 0.72x      |
| 249-and-or-eqs | partial-false  | 15.73M ops/s | 11.61M ops/s | -26.2% | 0.74x      |
