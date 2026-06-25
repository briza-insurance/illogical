# Benchmark Comparison Report — evaluate

**Baseline:** `results-sample-evaluate-oop.json`
**Improved:** `results-sample-evaluate-bytecode.json`
**Total cases compared:** 792

## Summary

|               | Count |
| ------------- | ----- |
| Faster (>+5%) | 780   |
| Slower (>-5%) | 11    |
| Unchanged     | 1     |

---

## evaluate

### Top 20 Most Improved

| Group                 | Case                | Baseline      | Improved     | Delta     | Multiplier |
| --------------------- | ------------------- | ------------- | ------------ | --------- | ---------- |
| or-n3412-r101-001     | early-true          | 104.57K ops/s | 11.78M ops/s | +11163.6% | 112.64x    |
| or-n3412-r101-001     | complete-true       | 105.34K ops/s | 11.69M ops/s | +11000.1% | 111.00x    |
| or-n3412-r101-001     | partial-true        | 114.44K ops/s | 12.26M ops/s | +10612.0% | 107.12x    |
| or-n1968-r105-001     | early-true          | 143.65K ops/s | 11.05M ops/s | +7594.2%  | 76.94x     |
| or-n1968-r105-001     | complete-true       | 149.34K ops/s | 10.96M ops/s | +7236.2%  | 73.36x     |
| or-n1968-r105-001     | partial-true        | 169.81K ops/s | 11.63M ops/s | +6747.6%  | 68.48x     |
| overlap-n105-r100-020 | complete-true       | 299.34K ops/s | 18.90M ops/s | +6214.9%  | 63.15x     |
| overlap-n105-r100-019 | full-execution-true | 298.71K ops/s | 18.40M ops/s | +6060.0%  | 61.60x     |
| overlap-n105-r100-019 | early-true          | 298.01K ops/s | 18.26M ops/s | +6028.3%  | 61.28x     |
| overlap-n119-r100-002 | full-execution-true | 255.89K ops/s | 15.10M ops/s | +5801.2%  | 59.01x     |
| overlap-n105-r100-003 | full-execution-true | 332.07K ops/s | 19.44M ops/s | +5753.1%  | 58.53x     |
| overlap-n105-r100-010 | complete-true       | 340.27K ops/s | 19.42M ops/s | +5607.9%  | 57.08x     |
| overlap-n105-r100-018 | early-true          | 350.14K ops/s | 19.87M ops/s | +5574.0%  | 56.74x     |
| overlap-n105-r100-003 | early-true          | 345.20K ops/s | 19.41M ops/s | +5522.4%  | 56.22x     |
| overlap-n105-r100-022 | early-true          | 353.28K ops/s | 19.86M ops/s | +5520.8%  | 56.21x     |
| overlap-n105-r100-011 | complete-true       | 343.35K ops/s | 19.28M ops/s | +5515.2%  | 56.15x     |
| overlap-n105-r100-017 | complete-true       | 352.31K ops/s | 19.78M ops/s | +5514.1%  | 56.14x     |
| overlap-n105-r100-022 | complete-true       | 351.63K ops/s | 19.67M ops/s | +5492.7%  | 55.93x     |
| overlap-n105-r100-014 | full-execution-true | 354.15K ops/s | 19.81M ops/s | +5492.6%  | 55.93x     |
| overlap-n105-r100-022 | full-execution-true | 354.21K ops/s | 19.79M ops/s | +5488.0%  | 55.88x     |

### Top 20 Least Improved

| Group                     | Case                 | Baseline      | Improved      | Delta  | Multiplier |
| ------------------------- | -------------------- | ------------- | ------------- | ------ | ---------- |
| 249-and-or-eqs            | empty-context        | 16.88M ops/s  | 12.22M ops/s  | -27.6% | 0.72x      |
| 249-and-or-eqs            | partial-false        | 16.21M ops/s  | 11.97M ops/s  | -26.2% | 0.74x      |
| 249-and-or-eqs            | complete-false       | 16.72M ops/s  | 12.38M ops/s  | -26.0% | 0.74x      |
| 251-or-and-in-mixed-eq-in | empty-context        | 10.10M ops/s  | 8.05M ops/s   | -20.4% | 0.80x      |
| 251-or-and-in-mixed-eq-in | partial-false        | 9.66M ops/s   | 7.75M ops/s   | -19.8% | 0.80x      |
| 251-or-and-in-mixed-eq-in | partial-true         | 11.52M ops/s  | 9.47M ops/s   | -17.8% | 0.82x      |
| 251-or-and-in-mixed-eq-in | complete-true        | 11.38M ops/s  | 9.44M ops/s   | -17.0% | 0.83x      |
| 251-or-and-in-mixed-eq-in | complete-false       | 9.42M ops/s   | 7.85M ops/s   | -16.6% | 0.83x      |
| 251-or-and-in-mixed-eq-in | early-true           | 11.32M ops/s  | 9.49M ops/s   | -16.2% | 0.84x      |
| 251-or-and-in-mixed-eq-in | full-execution-true  | 7.24M ops/s   | 6.31M ops/s   | -12.8% | 0.87x      |
| 251-or-and-in-mixed-eq-in | late-true            | 7.23M ops/s   | 6.54M ops/s   | -9.5%  | 0.90x      |
| 251-or-and-in-mixed-eq-in | full-execution-false | 5.93M ops/s   | 5.68M ops/s   | -4.1%  | 0.96x      |
| 249-and-or-eqs            | early-true           | 6.27M ops/s   | 6.75M ops/s   | +7.6%  | 1.08x      |
| 249-and-or-eqs            | complete-true        | 6.33M ops/s   | 6.84M ops/s   | +8.0%  | 1.08x      |
| 249-and-or-eqs            | partial-true         | 6.24M ops/s   | 6.86M ops/s   | +9.9%  | 1.10x      |
| or-n4691-r2-001           | early-true           | 6.35M ops/s   | 8.03M ops/s   | +26.5% | 1.26x      |
| or-n4691-r2-001           | complete-true        | 6.32M ops/s   | 8.06M ops/s   | +27.6% | 1.28x      |
| or-n4691-r2-001           | partial-true         | 6.20M ops/s   | 8.03M ops/s   | +29.5% | 1.30x      |
| or-n4691-r2-001           | empty-context        | 107.93K ops/s | 146.63K ops/s | +35.9% | 1.36x      |
| 250-or-and-in             | complete-true        | 11.57M ops/s  | 15.78M ops/s  | +36.3% | 1.36x      |

### Regressions

| Group                     | Case                | Baseline     | Improved     | Delta  | Multiplier |
| ------------------------- | ------------------- | ------------ | ------------ | ------ | ---------- |
| 249-and-or-eqs            | empty-context       | 16.88M ops/s | 12.22M ops/s | -27.6% | 0.72x      |
| 249-and-or-eqs            | partial-false       | 16.21M ops/s | 11.97M ops/s | -26.2% | 0.74x      |
| 249-and-or-eqs            | complete-false      | 16.72M ops/s | 12.38M ops/s | -26.0% | 0.74x      |
| 251-or-and-in-mixed-eq-in | empty-context       | 10.10M ops/s | 8.05M ops/s  | -20.4% | 0.80x      |
| 251-or-and-in-mixed-eq-in | partial-false       | 9.66M ops/s  | 7.75M ops/s  | -19.8% | 0.80x      |
| 251-or-and-in-mixed-eq-in | partial-true        | 11.52M ops/s | 9.47M ops/s  | -17.8% | 0.82x      |
| 251-or-and-in-mixed-eq-in | complete-true       | 11.38M ops/s | 9.44M ops/s  | -17.0% | 0.83x      |
| 251-or-and-in-mixed-eq-in | complete-false      | 9.42M ops/s  | 7.85M ops/s  | -16.6% | 0.83x      |
| 251-or-and-in-mixed-eq-in | early-true          | 11.32M ops/s | 9.49M ops/s  | -16.2% | 0.84x      |
| 251-or-and-in-mixed-eq-in | full-execution-true | 7.24M ops/s  | 6.31M ops/s  | -12.8% | 0.87x      |
| 251-or-and-in-mixed-eq-in | late-true           | 7.23M ops/s  | 6.54M ops/s  | -9.5%  | 0.90x      |
