import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'

import { buildCompactRef, resolveCompactRef } from '../../refs.js'

const context = {
  RefA: 1,
  // RefB = undefined
  RefC: {
    subA: 2,
    subB: {
      subSubA: 3,
    },
    'subC.dotKey': {
      subSubC: 4,
    },
    'subD.dotKey': [
      {
        subSubD: 5,
        subSubE: [{ subSubSubE: 6 }],
      },
    ],
    'sub`E.dotKey': { subSubE: 7 },
    'sub`E.dotKey`': { subSubE: 8 },
  },
  RefD: 'A',
  RefE: 'D',
  RefF: 'subA',
  RefG: ['Apples', 'Oranges', 'Fish'],
  RefH: [{ subA: 1 }, { subA: 2 }],
  RefI: [
    ['A', 'B'],
    ['C', 'D'],
  ],
  RefJ: '1',
  RefK: {
    yes: true,
    no: false,
  },
  // Used to verify that unresolved complex keys return undefined rather than
  // falling through to a key like "Refundefined".
  Refundefined: 'A',
}

function resolve(key: string) {
  return resolveCompactRef(buildCompactRef(key), context)
}

describe('resolveCompactRef', () => {
  describe('simple keys', () => {
    const cases = [
      ['RefA', 1],
      ['RefB', undefined],
    ] as const

    for (const [key, expected] of cases) {
      test(`${key} → ${expected}`, () => {
        assert.strictEqual(resolve(key), expected)
      })
    }
  })

  describe('nested paths', () => {
    const cases = [
      ['RefC.subA', 2],
      ['RefC.subB.subSubA', 3],
      ['RefC.subC', undefined],
      ['RefC.subB.subSubB', undefined],
      ['RefC.subA.subSubA', undefined],
    ] as const

    for (const [key, expected] of cases) {
      test(`${key} → ${expected}`, () => {
        assert.strictEqual(resolve(key), expected)
      })
    }
  })

  describe('backtick-escaped keys (keys containing dots)', () => {
    const cases = [
      ['RefC.`subC.dotKey`.subSubC', 4],
      ['RefC.`subD.dotKey`[0].subSubD', 5],
      // wrong syntax: backtick wraps the bracket too — yields undefined
      ['RefC.`subD.dotKey[0]`.subSubD', undefined],
      ['RefC.`subD.dotKey`[0].subSubE[0].subSubSubE', 6],
      ['RefC.`sub`E.dotKey`.subSubE', 7],
      ['RefC.`sub`E.dotKey``.subSubE', 8],
    ] as const

    for (const [key, expected] of cases) {
      test(`${key} → ${expected}`, () => {
        assert.strictEqual(resolve(key), expected)
      })
    }
  })

  describe('array indexing', () => {
    const cases = [
      ['RefG[1]', 'Oranges'],
      ['RefI[0][1]', 'B'],
      ['RefI[0][5]', undefined],
    ] as const

    for (const [key, expected] of cases) {
      test(`${key} → ${expected}`, () => {
        assert.strictEqual(resolve(key), expected)
      })
    }
  })

  describe('dynamic keys', () => {
    const cases = [
      // Ref{Ref{RefE}} → Ref{RefD} → RefA → 1
      ['Ref{Ref{RefE}}', 1],
      // RefC.{RefF} → RefC.subA → 2
      ['RefC.{RefF}', 2],
      // RefG[{RefC.sub{RefD}}] → RefG[{RefC.subA}] → RefG[2] → 'Fish'
      ['RefG[{RefC.sub{RefD}}]', 'Fish'],
      // RefH[{RefA}].sub{RefD} → RefH[1].subA → 2
      ['RefH[{RefA}].sub{RefD}', 2],
      // No brace match → dynamic suffix without separator → undefined (can't resolve)
      ['RefA{RefA}', undefined],
      // First segment (RefB) is undefined → short-circuit to undefined
      ['RefB.{RefA}', undefined],
      // Inner ref (RefB) is undefined → must not fall through to "Refundefined"
      ['Ref{RefB}', undefined],
    ] as const

    for (const [key, expected] of cases) {
      test(`${key} → ${expected}`, () => {
        assert.strictEqual(resolve(key), expected)
      })
    }
  })

  describe('type casting', () => {
    const cases = [
      ['RefH[{RefA}].sub{RefD}.(Number)', 2],
      ['RefA.(String)', '1'],
      ['RefJ.(String)', '1'],
      ['RefJ.(Number)', 1],
      // booleans can't be cast to Number or String → undefined
      ['RefK.yes.(Number)', undefined],
      ['RefK.no.(Number)', undefined],
    ] as const

    for (const [key, expected] of cases) {
      test(`${key} → ${expected}`, () => {
        assert.strictEqual(resolve(key), expected)
      })
    }
  })
})
