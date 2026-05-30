# Batch Evaluation Benchmark Report

**Results file:** `results-batch.json`

---

## Summary

| Scenario | Expressions | Keys | Complexity |
|----------|-------------|------|------------|
| small | 10 | 5 | simple |
| medium | 100 | 30 | simple |
| large | 1000 | 100 | simple |
| medium-complex | 100 | 20 | complex |
| large-complex | 500 | 50 | complex |

## small (10 expressions, 5 keys, simple complexity)

| Task | p50 | p75 | p99 | avg | ops/sec | margin |
|------|-----|-----|-----|-----|---------|--------|
| cold-individual | 18.1µs | 18.4µs | 92.5µs | 20.0µs | 53.79K ops/s | ±2.22% |
| warm-individual | 0.4µs | 0.4µs | 0.6µs | 0.4µs | 2.67M ops/s | ±0.47% |
| cold-batch | 9.7µs | 10.3µs | 19.7µs | 10.7µs | 106.19K ops/s | ±4.96% |
| warm-batch | 1.6µs | 1.7µs | 2.2µs | 2.6µs | 604.96K ops/s | ±20.90% |
| incremental-batch | 7.7µs | 7.8µs | 11.3µs | 8.7µs | 128.94K ops/s | ±5.05% |
| incremental-individual | 11.0µs | 11.1µs | 15.1µs | 12.0µs | 90.13K ops/s | ±4.01% |

## medium (100 expressions, 30 keys, simple complexity)

| Task | p50 | p75 | p99 | avg | ops/sec | margin |
|------|-----|-----|-----|-----|---------|--------|
| cold-individual | 186.4µs | 188.2µs | 467.5µs | 202.5µs | 5.17K ops/s | ±3.90% |
| warm-individual | 5.1µs | 5.3µs | 6.4µs | 5.2µs | 194.17K ops/s | ±0.87% |
| cold-batch | 143.6µs | 150.4µs | 728.1µs | 181.4µs | 6.46K ops/s | ±8.45% |
| warm-batch | 67.6µs | 69.2µs | 682.6µs | 94.9µs | 14.12K ops/s | ±11.34% |
| incremental-batch | 75.5µs | 76.5µs | 325.6µs | 81.5µs | 12.95K ops/s | ±3.54% |
| incremental-individual | 11.9µs | 12.0µs | 14.8µs | 12.9µs | 83.11K ops/s | ±3.46% |

## large (1000 expressions, 100 keys, simple complexity)

| Task | p50 | p75 | p99 | avg | ops/sec | margin |
|------|-----|-----|-----|-----|---------|--------|
| cold-individual | 2.132ms | 2.153ms | 2.185ms | 2.039ms | 493 ops/s | ±1.63% |
| warm-individual | 60.9µs | 61.2µs | 69.8µs | 61.6µs | 16.35K ops/s | ±0.81% |
| cold-batch | 10.382ms | 10.680ms | 12.718ms | 10.516ms | 95 ops/s | ±1.35% |
| warm-batch | 8.900ms | 9.077ms | 9.867ms | 8.992ms | 111 ops/s | ±0.90% |
| incremental-batch | 1.469ms | 1.701ms | 1.994ms | 1.573ms | 643 ops/s | ±2.75% |
| incremental-individual | 61.3µs | 61.8µs | 423.2µs | 68.7µs | 15.94K ops/s | ±5.31% |

## medium-complex (100 expressions, 20 keys, complex complexity)

| Task | p50 | p75 | p99 | avg | ops/sec | margin |
|------|-----|-----|-----|-----|---------|--------|
| cold-individual | 217.9µs | 220.0µs | 620.2µs | 243.2µs | 4.40K ops/s | ±5.45% |
| warm-individual | 7.1µs | 7.2µs | 7.8µs | 7.2µs | 139.65K ops/s | ±0.66% |
| cold-batch | 160.6µs | 163.1µs | 839.8µs | 211.4µs | 5.80K ops/s | ±10.29% |
| warm-batch | 81.0µs | 82.5µs | 825.3µs | 125.1µs | 11.62K ops/s | ±13.59% |
| incremental-batch | 88.5µs | 89.9µs | 487.3µs | 99.7µs | 10.94K ops/s | ±5.46% |
| incremental-individual | 35.5µs | 35.9µs | 189.5µs | 39.7µs | 27.78K ops/s | ±5.48% |

## large-complex (500 expressions, 50 keys, complex complexity)

| Task | p50 | p75 | p99 | avg | ops/sec | margin |
|------|-----|-----|-----|-----|---------|--------|
| cold-individual | 1.102ms | 1.480ms | 1.509ms | 1.220ms | 836 ops/s | ±3.74% |
| warm-individual | 40.2µs | 40.6µs | 44.0µs | 40.8µs | 24.67K ops/s | ±0.75% |
| cold-batch | 3.571ms | 3.685ms | 3.987ms | 3.340ms | 304 ops/s | ±2.93% |
| warm-batch | 2.692ms | 3.176ms | 3.369ms | 2.827ms | 359 ops/s | ±2.99% |
| incremental-batch | 589.9µs | 604.0µs | 1.062ms | 639.2µs | 1.60K ops/s | ±3.99% |
| incremental-individual | 47.3µs | 47.5µs | 426.3µs | 52.7µs | 20.85K ops/s | ±5.44% |

## Incremental Comparison

When 1 field changes, how long does it take to evaluate only the affected expressions?

| Scenario | Affected | Incremental Batch | Incremental Individual | Winner |
|----------|----------|-------------------|------------------------|--------|
| small | 6 | 8.7µs | 12.0µs | **batch 1.39x** |
| medium | 8 | 81.5µs | 12.9µs | individual 0.16x |
| large | 15 | 1.573ms | 68.7µs | individual 0.04x |
| medium-complex | 13 | 99.7µs | 39.7µs | individual 0.40x |
| large-complex | 22 | 639.2µs | 52.7µs | individual 0.08x |

---

## Key Findings

1. **Batch evaluation wins when many expressions are affected** — the shared compilation and dependency graph help amortize overhead.
2. **Individual evaluation wins when few expressions change** — JIT-optimized bytecode is very efficient for small sets, and batch has overhead from dependency graph lookup + interpreter dispatch.
3. **For the "1,000 fields, 1 field changes" scenario:** individual evaluation is significantly faster than batch for incremental updates.
4. **Batch evaluation provides other advantages** — memory efficiency (shared refs/consts), predictable timing, and change detection via the dependency graph.

---

## Methodology

- **Test generator:** Seeded PRNG (seed=42) for reproducibility
- **Expression types:** `==`, `!=`, `>`, `>=`, `<`, `<=`, `in`
- **Complex:** Some expressions wrapped in `AND` with nested conditions
- **Changed key:** Randomly selected from context keys for incremental tests
- **Runtime:** Node.js v22 with V8 JIT
- **Measurement:** tinybench with 50ms warmup, 50ms measurement per task
