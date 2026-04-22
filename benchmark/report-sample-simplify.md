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
| or-n4691-r2-001 | full-execution-false | 36.32K ops/s | 11.52M ops/s | +31619.8% | 317.20x |
| or-n4691-r2-001 | full-execution-true | 36.34K ops/s | 11.16M ops/s | +30600.4% | 307.00x |
| or-n4691-r2-001 | complete-false | 47.01K ops/s | 9.61M ops/s | +20344.7% | 204.45x |
| or-n4691-r2-001 | partial-false | 17.50K ops/s | 1.57M ops/s | +8889.1% | 89.89x |
| or-n4691-r2-001 | empty-context | 17.64K ops/s | 1.52M ops/s | +8500.6% | 86.01x |
| or-n1968-r105-001 | empty-context | 79.97K ops/s | 2.69M ops/s | +3260.5% | 33.60x |
| or-n1968-r105-001 | complete-false | 8.63K ops/s | 289.74K ops/s | +3256.8% | 33.57x |
| or-n1968-r105-001 | partial-true | 77.00K ops/s | 2.55M ops/s | +3217.3% | 33.17x |
| or-n1968-r105-001 | partial-false | 82.63K ops/s | 2.67M ops/s | +3129.1% | 32.29x |
| or-n1968-r105-001 | full-execution-false | 10.55K ops/s | 330.58K ops/s | +3033.9% | 31.34x |
| or-n3412-r101-001 | full-execution-false | 6.43K ops/s | 185.19K ops/s | +2778.9% | 28.79x |
| or-n3412-r101-001 | complete-false | 6.32K ops/s | 167.22K ops/s | +2546.7% | 26.47x |
| or-n3412-r101-001 | empty-context | 49.08K ops/s | 1.25M ops/s | +2455.6% | 25.56x |
| or-n3412-r101-001 | partial-false | 48.89K ops/s | 1.22M ops/s | +2396.0% | 24.96x |
| or-n3412-r101-001 | partial-true | 48.55K ops/s | 1.19M ops/s | +2347.1% | 24.47x |
| or-n1968-r105-001 | full-execution-true | 13.39K ops/s | 242.96K ops/s | +1714.5% | 18.14x |
| or-n3412-r101-001 | full-execution-true | 8.36K ops/s | 147.53K ops/s | +1664.3% | 17.64x |
| in-n122-r1-001 | partial-false | 1.16M ops/s | 16.68M ops/s | +1338.6% | 14.39x |
| in-n122-r1-001 | empty-context | 1.18M ops/s | 16.32M ops/s | +1285.4% | 13.85x |
| in-n122-r1-001 | complete-false | 1.13M ops/s | 14.17M ops/s | +1156.7% | 12.57x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| overlap-n105-r100-022 | empty-context | 10.38M ops/s | 12.02M ops/s | +15.8% | 1.16x |
| overlap-n105-r100-019 | partial-false | 10.94M ops/s | 13.04M ops/s | +19.1% | 1.19x |
| overlap-n105-r100-023 | partial-false | 10.66M ops/s | 12.77M ops/s | +19.7% | 1.20x |
| overlap-n106-r100-005 | empty-context | 10.00M ops/s | 12.12M ops/s | +21.2% | 1.21x |
| overlap-n105-r100-004 | partial-false | 10.72M ops/s | 13.05M ops/s | +21.7% | 1.22x |
| overlap-n105-r100-014 | empty-context | 10.38M ops/s | 12.77M ops/s | +23.0% | 1.23x |
| overlap-n105-r100-023 | empty-context | 10.13M ops/s | 12.48M ops/s | +23.2% | 1.23x |
| overlap-n105-r100-018 | empty-context | 10.22M ops/s | 12.69M ops/s | +24.1% | 1.24x |
| overlap-n105-r100-022 | partial-false | 10.83M ops/s | 13.51M ops/s | +24.7% | 1.25x |
| overlap-n105-r100-014 | partial-false | 10.89M ops/s | 13.82M ops/s | +26.9% | 1.27x |
| overlap-n105-r100-021 | partial-false | 10.74M ops/s | 13.64M ops/s | +27.0% | 1.27x |
| overlap-n105-r100-012 | partial-false | 10.94M ops/s | 13.90M ops/s | +27.0% | 1.27x |
| overlap-n106-r100-003 | partial-false | 10.18M ops/s | 12.96M ops/s | +27.3% | 1.27x |
| overlap-n105-r100-021 | empty-context | 10.50M ops/s | 13.41M ops/s | +27.7% | 1.28x |
| overlap-n106-r100-002 | empty-context | 9.75M ops/s | 12.50M ops/s | +28.3% | 1.28x |
| overlap-n105-r100-011 | partial-false | 10.83M ops/s | 13.90M ops/s | +28.4% | 1.28x |
| overlap-n105-r100-009 | empty-context | 10.39M ops/s | 13.38M ops/s | +28.8% | 1.29x |
| overlap-n105-r100-013 | empty-context | 10.51M ops/s | 13.53M ops/s | +28.8% | 1.29x |
| overlap-n105-r100-010 | partial-false | 10.93M ops/s | 14.09M ops/s | +28.9% | 1.29x |
| overlap-n105-r100-018 | partial-false | 10.84M ops/s | 14.00M ops/s | +29.2% | 1.29x |

### Regressions

_No regressions._

