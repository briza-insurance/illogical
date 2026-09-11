import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import Engine from '../../index.js'
import { testCases } from '../data/test-cases.js'

for (const mode of ['oop', 'bytecode'] as const) {
  describe('Stringify', () => {
    const engine = new Engine({ evaluator: mode })

    for (const tc of testCases) {
      test(`[${mode}] stringifying: ${JSON.stringify(tc.expression)}`, () => {
        const evaluable = engine.parse(tc.expression)

        const stringified = evaluable.toString()

        assert.deepStrictEqual(
          stringified,
          tc.string,
          `[${mode}] Expected stringification to return ` +
            `${JSON.stringify(tc.string)}, got ${JSON.stringify(stringified)}`
        )
      })
    }
  })
}
