# Benchmark Comparison Report — simplify

**Baseline:** `results-sample-simplify-oop.json`
**Improved:** `results-sample-simplify-bytecode.json`
**Total cases compared:** 616

## Summary

|               | Count |
| ------------- | ----- |
| Faster (>+5%) | 593   |
| Slower (>-5%) | 8     |
| Unchanged     | 15    |

---

## simplify

### Top 20 Most Improved

| Group             | Case                 | Baseline     | Improved      | Delta    | Multiplier |
| ----------------- | -------------------- | ------------ | ------------- | -------- | ---------- |
| or-n3412-r101-001 | full-execution-false | 5.32K ops/s  | 170.36K ops/s | +3102.2% | 32.02x     |
| or-n3412-r101-001 | complete-false       | 5.23K ops/s  | 156.68K ops/s | +2893.3% | 29.93x     |
| or-n1968-r105-001 | full-execution-false | 9.37K ops/s  | 273.66K ops/s | +2821.9% | 29.22x     |
| or-n1968-r105-001 | complete-false       | 9.19K ops/s  | 255.33K ops/s | +2678.9% | 27.79x     |
| or-n1968-r105-001 | empty-context        | 75.60K ops/s | 1.57M ops/s   | +1970.5% | 20.71x     |
| or-n1968-r105-001 | partial-false        | 75.74K ops/s | 1.52M ops/s   | +1913.3% | 20.13x     |
| or-n1968-r105-001 | partial-true         | 76.62K ops/s | 1.46M ops/s   | +1803.1% | 19.03x     |
| or-n3412-r101-001 | full-execution-true  | 7.63K ops/s  | 126.74K ops/s | +1561.2% | 16.61x     |
| or-n3412-r101-001 | empty-context        | 45.20K ops/s | 724.56K ops/s | +1503.2% | 16.03x     |
| or-n1968-r105-001 | full-execution-true  | 13.32K ops/s | 206.89K ops/s | +1453.3% | 15.53x     |
| or-n3412-r101-001 | partial-false        | 44.86K ops/s | 685.99K ops/s | +1429.2% | 15.29x     |
| or-n3412-r101-001 | partial-true         | 44.85K ops/s | 668.88K ops/s | +1391.5% | 14.91x     |
| or-n3412-r101-001 | complete-true        | 43.05K ops/s | 411.89K ops/s | +856.7%  | 9.57x      |
| in-n122-r1-001    | full-execution-false | 1.11M ops/s  | 8.62M ops/s   | +676.8%  | 7.77x      |
| in-n122-r1-001    | complete-false       | 1.11M ops/s  | 8.62M ops/s   | +674.2%  | 7.74x      |
| in-n122-r1-001    | complete-true        | 1.18M ops/s  | 8.33M ops/s   | +607.7%  | 7.08x      |
| in-n122-r1-001    | full-execution-true  | 1.22M ops/s  | 8.52M ops/s   | +597.0%  | 6.97x      |
| in-n122-r1-001    | partial-true         | 1.22M ops/s  | 8.45M ops/s   | +593.1%  | 6.93x      |
| or-n1968-r105-001 | complete-true        | 62.69K ops/s | 418.81K ops/s | +568.1%  | 6.68x      |
| or-n3730-r105-001 | full-execution-false | 7.34K ops/s  | 47.68K ops/s  | +549.6%  | 6.50x      |

### Top 20 Least Improved

| Group                     | Case                 | Baseline     | Improved    | Delta  | Multiplier |
| ------------------------- | -------------------- | ------------ | ----------- | ------ | ---------- |
| 249-and-or-eqs            | complete-false       | 10.16M ops/s | 5.70M ops/s | -43.9% | 0.56x      |
| 251-or-and-in-mixed-eq-in | partial-true         | 7.07M ops/s  | 4.26M ops/s | -39.8% | 0.60x      |
| 251-or-and-in-mixed-eq-in | complete-true        | 6.85M ops/s  | 4.26M ops/s | -37.8% | 0.62x      |
| 251-or-and-in-mixed-eq-in | complete-false       | 5.34M ops/s  | 3.65M ops/s | -31.6% | 0.68x      |
| 251-or-and-in-mixed-eq-in | full-execution-true  | 4.20M ops/s  | 3.07M ops/s | -26.9% | 0.73x      |
| 251-or-and-in-mixed-eq-in | full-execution-false | 3.54M ops/s  | 2.68M ops/s | -24.2% | 0.76x      |
| 251-or-and-in-mixed-eq-in | partial-false        | 1.59M ops/s  | 1.30M ops/s | -17.9% | 0.82x      |
| overlap-n105-r100-015     | partial-false        | 8.18M ops/s  | 7.49M ops/s | -8.5%  | 0.91x      |
| 249-and-or-eqs            | complete-true        | 3.65M ops/s  | 3.57M ops/s | -2.3%  | 0.98x      |
| 251-or-and-in-mixed-eq-in | empty-context        | 1.59M ops/s  | 1.56M ops/s | -2.3%  | 0.98x      |
| 249-and-or-eqs            | partial-true         | 3.65M ops/s  | 3.57M ops/s | -2.0%  | 0.98x      |
| overlap-n105-r100-002     | partial-false        | 8.27M ops/s  | 8.37M ops/s | +1.1%  | 1.01x      |
| overlap-n105-r100-003     | empty-context        | 8.31M ops/s  | 8.48M ops/s | +2.1%  | 1.02x      |
| overlap-n105-r100-008     | empty-context        | 8.39M ops/s  | 8.62M ops/s | +2.7%  | 1.03x      |
| overlap-n105-r100-001     | partial-false        | 8.17M ops/s  | 8.42M ops/s | +3.0%  | 1.03x      |
| overlap-n105-r100-019     | partial-false        | 8.24M ops/s  | 8.51M ops/s | +3.2%  | 1.03x      |
| overlap-n105-r100-018     | partial-false        | 8.17M ops/s  | 8.45M ops/s | +3.3%  | 1.03x      |
| overlap-n105-r100-002     | empty-context        | 8.27M ops/s  | 8.59M ops/s | +3.9%  | 1.04x      |
| overlap-n105-r100-009     | partial-false        | 8.18M ops/s  | 8.52M ops/s | +4.2%  | 1.04x      |
| overlap-n105-r100-004     | partial-false        | 8.21M ops/s  | 8.59M ops/s | +4.5%  | 1.05x      |

### Regressions

| Group                     | Case                 | Baseline     | Improved    | Delta  | Multiplier |
| ------------------------- | -------------------- | ------------ | ----------- | ------ | ---------- |
| 249-and-or-eqs            | complete-false       | 10.16M ops/s | 5.70M ops/s | -43.9% | 0.56x      |
| 251-or-and-in-mixed-eq-in | partial-true         | 7.07M ops/s  | 4.26M ops/s | -39.8% | 0.60x      |
| 251-or-and-in-mixed-eq-in | complete-true        | 6.85M ops/s  | 4.26M ops/s | -37.8% | 0.62x      |
| 251-or-and-in-mixed-eq-in | complete-false       | 5.34M ops/s  | 3.65M ops/s | -31.6% | 0.68x      |
| 251-or-and-in-mixed-eq-in | full-execution-true  | 4.20M ops/s  | 3.07M ops/s | -26.9% | 0.73x      |
| 251-or-and-in-mixed-eq-in | full-execution-false | 3.54M ops/s  | 2.68M ops/s | -24.2% | 0.76x      |
| 251-or-and-in-mixed-eq-in | partial-false        | 1.59M ops/s  | 1.30M ops/s | -17.9% | 0.82x      |
| overlap-n105-r100-015     | partial-false        | 8.18M ops/s  | 7.49M ops/s | -8.5%  | 0.91x      |
