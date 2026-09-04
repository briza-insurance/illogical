# Benchmark Comparison Report — simplify

**Baseline:** `results-sample-simplify-oop.json`
**Improved:** `results-sample-simplify-bytecode.json`
**Total cases compared:** 616

## Summary

|               | Count |
| ------------- | ----- |
| Faster (>+5%) | 613   |
| Slower (>-5%) | 1     |
| Unchanged     | 2     |

---

## simplify

### Top 20 Most Improved

| Group             | Case                 | Baseline     | Improved      | Delta     | Multiplier |
| ----------------- | -------------------- | ------------ | ------------- | --------- | ---------- |
| or-n4691-r2-001   | full-execution-true  | 30.16K ops/s | 9.49M ops/s   | +31365.3% | 314.65x    |
| or-n4691-r2-001   | full-execution-false | 30.16K ops/s | 8.91M ops/s   | +29449.2% | 295.49x    |
| or-n4691-r2-001   | complete-false       | 39.76K ops/s | 7.15M ops/s   | +17887.9% | 179.88x    |
| or-n3412-r101-001 | full-execution-false | 4.94K ops/s  | 164.13K ops/s | +3222.9%  | 33.23x     |
| or-n3412-r101-001 | complete-false       | 5.16K ops/s  | 158.41K ops/s | +2972.2%  | 30.72x     |
| or-n1968-r105-001 | full-execution-false | 9.28K ops/s  | 266.37K ops/s | +2770.1%  | 28.70x     |
| or-n1968-r105-001 | complete-false       | 9.12K ops/s  | 257.50K ops/s | +2724.5%  | 28.24x     |
| or-n4691-r2-001   | partial-false        | 14.14K ops/s | 346.96K ops/s | +2353.4%  | 24.53x     |
| or-n4691-r2-001   | empty-context        | 14.42K ops/s | 344.58K ops/s | +2289.7%  | 23.90x     |
| or-n1968-r105-001 | partial-false        | 78.40K ops/s | 1.51M ops/s   | +1822.7%  | 19.23x     |
| or-n1968-r105-001 | empty-context        | 78.08K ops/s | 1.42M ops/s   | +1723.0%  | 18.23x     |
| or-n1968-r105-001 | partial-true         | 78.42K ops/s | 1.40M ops/s   | +1690.8%  | 17.91x     |
| or-n3412-r101-001 | full-execution-true  | 7.50K ops/s  | 124.56K ops/s | +1560.1%  | 16.60x     |
| or-n1968-r105-001 | full-execution-true  | 12.89K ops/s | 195.74K ops/s | +1418.4%  | 15.18x     |
| or-n3412-r101-001 | empty-context        | 46.06K ops/s | 666.40K ops/s | +1346.8%  | 14.47x     |
| or-n3412-r101-001 | partial-false        | 46.55K ops/s | 672.02K ops/s | +1343.7%  | 14.44x     |
| or-n3412-r101-001 | partial-true         | 46.97K ops/s | 652.95K ops/s | +1290.2%  | 13.90x     |
| in-n122-r1-001    | complete-false       | 1.10M ops/s  | 10.18M ops/s  | +829.3%   | 9.29x      |
| or-n3412-r101-001 | complete-true        | 43.79K ops/s | 394.32K ops/s | +800.5%   | 9.01x      |
| in-n122-r1-001    | full-execution-false | 1.09M ops/s  | 9.71M ops/s   | +787.2%   | 8.87x      |

### Top 20 Least Improved

| Group                 | Case           | Baseline    | Improved    | Delta  | Multiplier |
| --------------------- | -------------- | ----------- | ----------- | ------ | ---------- |
| 249-and-or-eqs        | complete-false | 9.77M ops/s | 5.78M ops/s | -40.8% | 0.59x      |
| 249-and-or-eqs        | complete-true  | 3.48M ops/s | 3.49M ops/s | +0.2%  | 1.00x      |
| 249-and-or-eqs        | partial-true   | 3.42M ops/s | 3.49M ops/s | +2.1%  | 1.02x      |
| overlap-n106-r100-001 | partial-false  | 7.92M ops/s | 8.50M ops/s | +7.3%  | 1.07x      |
| overlap-n105-r100-017 | partial-false  | 8.23M ops/s | 9.31M ops/s | +13.2% | 1.13x      |
| overlap-n105-r100-013 | partial-false  | 8.36M ops/s | 9.49M ops/s | +13.5% | 1.13x      |
| overlap-n105-r100-006 | partial-false  | 7.98M ops/s | 9.10M ops/s | +14.0% | 1.14x      |
| overlap-n105-r100-014 | partial-false  | 8.33M ops/s | 9.63M ops/s | +15.6% | 1.16x      |
| overlap-n105-r100-011 | partial-false  | 8.34M ops/s | 9.65M ops/s | +15.7% | 1.16x      |
| overlap-n105-r100-018 | partial-false  | 8.29M ops/s | 9.59M ops/s | +15.7% | 1.16x      |
| overlap-n105-r100-001 | partial-false  | 8.32M ops/s | 9.64M ops/s | +15.8% | 1.16x      |
| overlap-n105-r100-015 | partial-false  | 8.30M ops/s | 9.63M ops/s | +16.0% | 1.16x      |
| overlap-n105-r100-012 | partial-false  | 8.22M ops/s | 9.55M ops/s | +16.2% | 1.16x      |
| overlap-n105-r100-007 | partial-false  | 8.33M ops/s | 9.68M ops/s | +16.2% | 1.16x      |
| overlap-n105-r100-023 | partial-false  | 8.26M ops/s | 9.60M ops/s | +16.2% | 1.16x      |
| overlap-n105-r100-004 | partial-false  | 8.26M ops/s | 9.64M ops/s | +16.7% | 1.17x      |
| overlap-n105-r100-023 | empty-context  | 8.33M ops/s | 9.72M ops/s | +16.7% | 1.17x      |
| overlap-n105-r100-009 | partial-false  | 8.29M ops/s | 9.69M ops/s | +16.9% | 1.17x      |
| overlap-n105-r100-016 | partial-false  | 8.33M ops/s | 9.75M ops/s | +17.0% | 1.17x      |
| overlap-n105-r100-003 | partial-false  | 8.28M ops/s | 9.69M ops/s | +17.0% | 1.17x      |

### Regressions

| Group          | Case           | Baseline    | Improved    | Delta  | Multiplier |
| -------------- | -------------- | ----------- | ----------- | ------ | ---------- |
| 249-and-or-eqs | complete-false | 9.77M ops/s | 5.78M ops/s | -40.8% | 0.59x      |
