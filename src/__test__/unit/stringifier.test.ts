import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import Engine from '../../index.js'
import { testCases } from '../data/test-cases.js'

describe('Stringify', () => {
  const engine = new Engine()

  for (const tc of testCases) {
    test(`stringifying: ${JSON.stringify(tc.expression)}`, () => {
      const evaluable = engine.parse(tc.expression)

      const stringified = evaluable.toString()

      assert.deepStrictEqual(
        stringified,
        tc.string,
        `Expected stringification to return ` +
          `${JSON.stringify(tc.string)}, got ${JSON.stringify(stringified)}`
      )
    })
  }
})
