#!/usr/bin/env bash
set -e

BENCH="${1:?Usage: run-baseline.sh <evaluate|simplify> [--cases <path>] [--out <file>]}"
shift

BASELINE_DIR="${ILLOGICAL_BASELINE:-../illogical-baseline}"

if [ ! -d "$BASELINE_DIR" ]; then
  echo "Error: baseline directory not found: $BASELINE_DIR"
  echo "Set ILLOGICAL_BASELINE to the path of the baseline repo."
  exit 1
fi

echo "Building baseline in $BASELINE_DIR..."
npm run build --prefix "$BASELINE_DIR"

exec node --import tsx "src/benchmark/${BENCH}.ts" --engine "$BASELINE_DIR/lib/illogical.esm.js" "$@"
