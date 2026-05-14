# Debugger Tools

illogical includes developer tooling for debugging bytecode execution and inspecting compiled
output.

## Bytecode Disassembler — `get-bytecode`

Compiles an expression from stdin and outputs the compiled bytecode as JSON. Optionally
disassembles into human-readable form.

```sh
# Output compiled bytecode
cat expression.json | npm run get-bytecode | jq

# Output disassembled bytecode
cat expression.json | npm run get-bytecode -- --disassemble | jq
```

## Time-Travel Debugger — `debug-bytecode`

A TUI (terminal UI) debugger that steps through bytecode execution, showing the state at each
instruction. Useful for understanding how expressions are evaluated and debugging unexpected results.

```sh
# With inline expression and context
npm run debug-bytecode -- --expr '["==", "$x", 1]' --ctx '{"x":1}'

# Read expression from stdin
cat expression.json | npm run debug-bytecode -- --ctx '{"x":1}'

# Use a pre-generated test case
cat expression.json | npm run debug-bytecode -- --ctx-case complete-true

# Non-TTY mode: dump execution trace as JSON
npm run debug-bytecode -- --expr '["==", "$x", 1]' --ctx '{"x":1}' --no-tty
```

### `--ctx-case` Values

| Case | Description |
|------|-------------|
| `complete-true` | Full context that evaluates to true |
| `complete-false` | Full context that evaluates to false |
| `partial-true` | Partial context, evaluates to true |
| `partial-false` | Partial context, evaluates to false |
| `full-execution-true` | Full execution trace, true |
| `full-execution-false` | Full execution trace, false |
| `early-true` | Short-circuit evaluation, true |
| `late-true` | Late evaluation, true |

### Keyboard Controls (TUI Mode)

| Key | Action |
|-----|--------|
| `n` / `→` | Next step |
| `p` / `←` | Previous step |
| `g` | First step |
| `G` | Last step |
| `j` / `↓` | Scroll expression down |
| `k` / `↑` | Scroll expression up |
| `q` / `Esc` | Quit |
