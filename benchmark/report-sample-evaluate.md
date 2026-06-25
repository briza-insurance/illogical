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
| or-n4691-r2-001       | full-execution-false | 62.06K ops/s  | 13.18M ops/s | +21141.7% | 212.42x    |
| or-n4691-r2-001       | late-true            | 60.71K ops/s  | 12.53M ops/s | +20534.7% | 206.35x    |
| or-n4691-r2-001       | full-execution-true  | 62.32K ops/s  | 12.61M ops/s | +20129.3% | 202.29x    |
| or-n4691-r2-001       | empty-context        | 103.66K ops/s | 17.73M ops/s | +16999.9% | 171.00x    |
| or-n4691-r2-001       | partial-false        | 105.53K ops/s | 17.75M ops/s | +16722.5% | 168.23x    |
| or-n4691-r2-001       | complete-false       | 82.91K ops/s  | 8.69M ops/s  | +10378.3% | 104.78x    |
| or-n3412-r101-001     | complete-true        | 112.17K ops/s | 11.43M ops/s | +10094.3% | 101.94x    |
| or-n3412-r101-001     | early-true           | 112.44K ops/s | 11.34M ops/s | +9983.7%  | 100.84x    |
| or-n3412-r101-001     | partial-true         | 121.30K ops/s | 11.50M ops/s | +9378.8%  | 94.79x     |
| or-n1968-r105-001     | complete-true        | 154.14K ops/s | 12.00M ops/s | +7683.7%  | 77.84x     |
| or-n1968-r105-001     | early-true           | 154.15K ops/s | 11.66M ops/s | +7461.1%  | 75.61x     |
| or-n1968-r105-001     | partial-true         | 171.19K ops/s | 12.13M ops/s | +6987.7%  | 70.88x     |
| overlap-n105-r100-011 | full-execution-true  | 317.69K ops/s | 21.01M ops/s | +6514.3%  | 66.14x     |
| overlap-n105-r100-011 | complete-true        | 317.01K ops/s | 20.74M ops/s | +6442.5%  | 65.42x     |
| overlap-n105-r100-011 | early-true           | 317.91K ops/s | 20.68M ops/s | +6404.9%  | 65.05x     |
| overlap-n105-r100-010 | complete-true        | 318.42K ops/s | 20.69M ops/s | +6397.6%  | 64.98x     |
| overlap-n105-r100-010 | early-true           | 319.84K ops/s | 20.31M ops/s | +6250.7%  | 63.51x     |
| overlap-n105-r100-001 | complete-true        | 328.85K ops/s | 20.66M ops/s | +6181.8%  | 62.82x     |
| overlap-n105-r100-006 | complete-true        | 318.01K ops/s | 19.32M ops/s | +5975.5%  | 60.76x     |
| overlap-n105-r100-010 | full-execution-true  | 318.75K ops/s | 18.95M ops/s | +5843.8%  | 59.44x     |

### Top 20 Least Improved

| Group                     | Case                 | Baseline      | Improved      | Delta  | Multiplier |
| ------------------------- | -------------------- | ------------- | ------------- | ------ | ---------- |
| 249-and-or-eqs            | complete-false       | 17.69M ops/s  | 11.93M ops/s  | -32.6% | 0.67x      |
| 249-and-or-eqs            | empty-context        | 17.37M ops/s  | 11.91M ops/s  | -31.4% | 0.69x      |
| 249-and-or-eqs            | partial-false        | 16.82M ops/s  | 11.59M ops/s  | -31.1% | 0.69x      |
| 249-and-or-eqs            | early-true           | 6.48M ops/s   | 6.65M ops/s   | +2.7%  | 1.03x      |
| 249-and-or-eqs            | partial-true         | 6.41M ops/s   | 6.74M ops/s   | +5.3%  | 1.05x      |
| 249-and-or-eqs            | complete-true        | 6.32M ops/s   | 6.73M ops/s   | +6.6%  | 1.07x      |
| 251-or-and-in-mixed-eq-in | partial-true         | 12.36M ops/s  | 16.38M ops/s  | +32.6% | 1.33x      |
| 250-or-and-in             | complete-true        | 12.07M ops/s  | 16.32M ops/s  | +35.2% | 1.35x      |
| 250-or-and-in             | partial-true         | 12.19M ops/s  | 16.58M ops/s  | +36.0% | 1.36x      |
| 251-or-and-in-mixed-eq-in | early-true           | 12.01M ops/s  | 16.33M ops/s  | +36.0% | 1.36x      |
| 250-or-and-in             | early-true           | 12.12M ops/s  | 16.50M ops/s  | +36.2% | 1.36x      |
| 251-or-and-in-mixed-eq-in | complete-true        | 12.10M ops/s  | 16.58M ops/s  | +37.0% | 1.37x      |
| overlap-n105-r100-005     | late-true            | 334.26K ops/s | 490.01K ops/s | +46.6% | 1.47x      |
| 249-and-or-eqs            | late-true            | 4.63M ops/s   | 6.81M ops/s   | +47.1% | 1.47x      |
| 249-and-or-eqs            | full-execution-true  | 4.61M ops/s   | 6.79M ops/s   | +47.1% | 1.47x      |
| 249-and-or-eqs            | full-execution-false | 4.60M ops/s   | 6.86M ops/s   | +49.3% | 1.49x      |
| overlap-n11-r5-001        | full-execution-false | 6.80M ops/s   | 10.69M ops/s  | +57.2% | 1.57x      |
| overlap-n11-r5-001        | complete-false       | 6.50M ops/s   | 10.62M ops/s  | +63.4% | 1.63x      |
| overlap-n112-r100-001     | full-execution-false | 287.07K ops/s | 478.01K ops/s | +66.5% | 1.67x      |
| 250-or-and-in             | partial-false        | 11.10M ops/s  | 18.55M ops/s  | +67.1% | 1.67x      |

### Regressions

| Group          | Case           | Baseline     | Improved     | Delta  | Multiplier |
| -------------- | -------------- | ------------ | ------------ | ------ | ---------- |
| 249-and-or-eqs | complete-false | 17.69M ops/s | 11.93M ops/s | -32.6% | 0.67x      |
| 249-and-or-eqs | empty-context  | 17.37M ops/s | 11.91M ops/s | -31.4% | 0.69x      |
| 249-and-or-eqs | partial-false  | 16.82M ops/s | 11.59M ops/s | -31.1% | 0.69x      |
