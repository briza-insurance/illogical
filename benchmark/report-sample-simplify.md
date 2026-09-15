# Benchmark Comparison Report — simplify

**Baseline:** `results-sample-simplify-oop.json`
**Improved:** `results-sample-simplify-bytecode.json`
**Total cases compared:** 616

## Summary

| | Count |
|---|---|
| Faster (>+5%) | 561 |
| Slower (>-5%) | 15 |
| Unchanged | 40 |

---

## simplify

### Top 20 Most Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| or-n3412-r101-001 | complete-false | 4.91K ops/s | 158.84K ops/s | +3133.2% | 32.33x |
| or-n3412-r101-001 | full-execution-false | 5.16K ops/s | 165.48K ops/s | +3105.1% | 32.05x |
| or-n1968-r105-001 | full-execution-false | 9.05K ops/s | 281.08K ops/s | +3004.4% | 31.04x |
| or-n1968-r105-001 | complete-false | 8.93K ops/s | 264.80K ops/s | +2864.1% | 29.64x |
| or-n1968-r105-001 | empty-context | 74.91K ops/s | 1.62M ops/s | +2059.0% | 21.59x |
| or-n1968-r105-001 | partial-false | 75.11K ops/s | 1.59M ops/s | +2018.3% | 21.18x |
| or-n1968-r105-001 | partial-true | 74.55K ops/s | 1.51M ops/s | +1921.9% | 20.22x |
| or-n3412-r101-001 | full-execution-true | 7.35K ops/s | 125.78K ops/s | +1611.8% | 17.12x |
| or-n3412-r101-001 | empty-context | 45.18K ops/s | 738.78K ops/s | +1535.3% | 16.35x |
| or-n3412-r101-001 | partial-false | 44.96K ops/s | 730.31K ops/s | +1524.3% | 16.24x |
| or-n1968-r105-001 | full-execution-true | 12.91K ops/s | 206.61K ops/s | +1500.2% | 16.00x |
| or-n3412-r101-001 | partial-true | 44.24K ops/s | 704.81K ops/s | +1493.3% | 15.93x |
| or-n3412-r101-001 | complete-true | 41.10K ops/s | 415.53K ops/s | +911.1% | 10.11x |
| in-n122-r1-001 | complete-false | 1.10M ops/s | 9.25M ops/s | +740.3% | 8.40x |
| in-n122-r1-001 | full-execution-false | 1.11M ops/s | 9.28M ops/s | +737.5% | 8.38x |
| in-n122-r1-001 | partial-true | 1.18M ops/s | 9.26M ops/s | +682.9% | 7.83x |
| in-n122-r1-001 | full-execution-true | 1.20M ops/s | 9.25M ops/s | +672.3% | 7.72x |
| in-n122-r1-001 | complete-true | 1.20M ops/s | 9.15M ops/s | +662.0% | 7.62x |
| or-n3730-r105-001 | full-execution-false | 7.22K ops/s | 52.10K ops/s | +621.2% | 7.21x |
| or-n3730-r105-001 | complete-false | 7.28K ops/s | 51.64K ops/s | +609.4% | 7.09x |

### Top 20 Least Improved

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 249-and-or-eqs | complete-false | 10.05M ops/s | 6.12M ops/s | -39.1% | 0.61x |
| 251-or-and-in-mixed-eq-in | complete-true | 6.96M ops/s | 4.57M ops/s | -34.3% | 0.66x |
| 251-or-and-in-mixed-eq-in | partial-true | 6.84M ops/s | 4.56M ops/s | -33.4% | 0.67x |
| 250-or-and-in | complete-true | 6.87M ops/s | 4.58M ops/s | -33.3% | 0.67x |
| 250-or-and-in | partial-true | 6.85M ops/s | 4.58M ops/s | -33.1% | 0.67x |
| 250-or-and-in | complete-false | 6.27M ops/s | 4.21M ops/s | -32.8% | 0.67x |
| 249-and-or-eqs | complete-true | 3.70M ops/s | 2.74M ops/s | -26.1% | 0.74x |
| 249-and-or-eqs | partial-true | 3.62M ops/s | 2.74M ops/s | -24.1% | 0.76x |
| 251-or-and-in-mixed-eq-in | complete-false | 5.19M ops/s | 3.95M ops/s | -24.0% | 0.76x |
| 251-or-and-in-mixed-eq-in | full-execution-true | 4.11M ops/s | 3.34M ops/s | -18.9% | 0.81x |
| 250-or-and-in | full-execution-true | 3.82M ops/s | 3.15M ops/s | -17.8% | 0.82x |
| 250-or-and-in | full-execution-false | 3.79M ops/s | 3.15M ops/s | -16.8% | 0.83x |
| 249-and-or-eqs | full-execution-true | 2.57M ops/s | 2.15M ops/s | -16.3% | 0.84x |
| 249-and-or-eqs | full-execution-false | 2.55M ops/s | 2.17M ops/s | -15.1% | 0.85x |
| 251-or-and-in-mixed-eq-in | full-execution-false | 3.50M ops/s | 2.99M ops/s | -14.5% | 0.85x |
| overlap-n105-r100-001 | partial-false | 8.56M ops/s | 8.62M ops/s | +0.7% | 1.01x |
| overlap-n105-r100-020 | partial-false | 8.58M ops/s | 8.68M ops/s | +1.1% | 1.01x |
| overlap-n105-r100-004 | partial-false | 8.56M ops/s | 8.65M ops/s | +1.1% | 1.01x |
| overlap-n105-r100-006 | partial-false | 8.53M ops/s | 8.66M ops/s | +1.5% | 1.02x |
| 250-or-and-in | partial-false | 1.70M ops/s | 1.74M ops/s | +1.8% | 1.02x |

### Regressions

| Group | Case | Baseline | Improved | Delta | Multiplier |
|-------|------|----------|----------|-------|------------|
| 249-and-or-eqs | complete-false | 10.05M ops/s | 6.12M ops/s | -39.1% | 0.61x |
| 251-or-and-in-mixed-eq-in | complete-true | 6.96M ops/s | 4.57M ops/s | -34.3% | 0.66x |
| 251-or-and-in-mixed-eq-in | partial-true | 6.84M ops/s | 4.56M ops/s | -33.4% | 0.67x |
| 250-or-and-in | complete-true | 6.87M ops/s | 4.58M ops/s | -33.3% | 0.67x |
| 250-or-and-in | partial-true | 6.85M ops/s | 4.58M ops/s | -33.1% | 0.67x |
| 250-or-and-in | complete-false | 6.27M ops/s | 4.21M ops/s | -32.8% | 0.67x |
| 249-and-or-eqs | complete-true | 3.70M ops/s | 2.74M ops/s | -26.1% | 0.74x |
| 249-and-or-eqs | partial-true | 3.62M ops/s | 2.74M ops/s | -24.1% | 0.76x |
| 251-or-and-in-mixed-eq-in | complete-false | 5.19M ops/s | 3.95M ops/s | -24.0% | 0.76x |
| 251-or-and-in-mixed-eq-in | full-execution-true | 4.11M ops/s | 3.34M ops/s | -18.9% | 0.81x |
| 250-or-and-in | full-execution-true | 3.82M ops/s | 3.15M ops/s | -17.8% | 0.82x |
| 250-or-and-in | full-execution-false | 3.79M ops/s | 3.15M ops/s | -16.8% | 0.83x |
| 249-and-or-eqs | full-execution-true | 2.57M ops/s | 2.15M ops/s | -16.3% | 0.84x |
| 249-and-or-eqs | full-execution-false | 2.55M ops/s | 2.17M ops/s | -15.1% | 0.85x |
| 251-or-and-in-mixed-eq-in | full-execution-false | 3.50M ops/s | 2.99M ops/s | -14.5% | 0.85x |

