import {
  contextLookup,
  DataType,
  defaultReferenceSerializeOptions,
  getDataType,
  isIgnoredPath,
  reference,
  toDataType,
  toNumber,
  toString,
  trimDataType,
} from '../../reference'

describe('operand - reference', () => {
  const context = {
    refA: 1,
    refB: {
      refB1: 2,
      refB2: 'refB1',
      refB3: true,
    },
    refC: 'refB1',
    refD: 'refB2',
    refE: [1, [2, 3, 4]],
    refF: 'A',
    refG: '1',
    refH: '1.1',
  }

  describe('contextLookup', () => {
    it.each([
      ['UNDEFINED', ['UNDEFINED', undefined]],
      ['refA', ['refA', 1]],
      ['refB.refB1', ['refB.refB1', 2]],
      ['refB.{refC}', ['refB.refB1', 2]],
      ['refB.{UNDEFINED}', ['refB.{UNDEFINED}', undefined]],
      ['refB.{refB.refB2}', ['refB.refB1', 2]],
      ['refB.{refB.{refD}}', ['refB.refB1', 2]],
      ['refE[0]', ['refE[0]', 1]],
      ['refE[2]', ['refE[2]', undefined]],
      ['refE[1][0]', ['refE[1][0]', 2]],
      ['refE[1][3]', ['refE[1][3]', undefined]],
      ['refE[{refA}][0]', ['refE[1][0]', 2]],
      ['refE[{refA}][{refB.refB1}]', ['refE[1][2]', 4]],
      ['ref{refF}', ['refA', 1]],
      ['ref{UNDEFINED}', ['ref{UNDEFINED}', undefined]],
    ])('should resolve %p path as %p', (path, expected) => {
      expect(contextLookup(context, path)).toStrictEqual(expected)
    })
  })

  describe('evaluate', () => {
    console.warn = jest.fn()

    it.each([
      ['refA', 1],
      ['refA.(String)', '1'],
      ['refA.(Boolean)', 1],
      ['refG.(Number)', 1],
      ['refH.(Number)', 1.1],
      ['refB.refB3.(String)', undefined],
      ['refB.refB3.(Number)', undefined],
    ])('%p should evaluate as %p', (path, expected) => {
      expect(reference(path).evaluate(context)).toBe(expected)
    })

    it.each([['refB'], ['refE']])('%p should throw', (path) => {
      expect(() => reference(path).evaluate(context)).toThrowError()
    })
  })

  describe('simplify', () => {
    it.each([
      ['UNDEFINED', [], reference('UNDEFINED')],
      ['UNDEFINED', ['UNDEFINED'], undefined],
      ['refA', [], 1],
      ['refB.refB1', [], 2],
      ['refB.{refC}', [], 2],
      ['refB.{UNDEFINED}', [], reference('refB.{UNDEFINED}')],
      ['refB.{UNDEFINED}', [/^refB/], undefined],
      ['refB.{refB.refB2}', [], 2],
      ['refB.{refB.{refD}}', [], 2],
      ['refE[0]', [], 1],
      ['refE[2]', [], reference('refE[2]')],
      ['refE[1][0]', [], 2],
      ['refE[1][3]', [], reference('refE[1][3]')],
      ['refE[{refA}][0]', [], 2],
      ['refE[{refA}][{refB.refB1}]', [], 4],
      ['ref{refF}', [], 1],
      ['ref{refF}.(String)', [], '1'],
      ['ref{UNDEFINED}', [], reference('ref{UNDEFINED}')],
      ['ref{UNDEFINED}.(Number)', [], reference('ref{UNDEFINED}.(Number)')],
    ])(
      '%p ignoring %p should simplify to %p',
      (path, ignoredPaths, expected) => {
        expect(
          `${reference(path).simplify(context, {
            reference: { ignoredPaths },
          })}`
        ).toEqual(`${expected}`)
      }
    )

    it.each([['refB'], ['refE']])('%p should throw', (path) => {
      expect(() =>
        reference(path).simplify(context, { reference: { ignoredPaths: [] } })
      ).toThrowError()
    })
  })

  describe('serialize', () => {
    it.each([
      ['refA', '$refA'],
      ['refA.(Number)', '$refA.(Number)'],
      ['refA.(Boolean)', '$refA'],
    ])('should serialize %p path as %p', (path, expected) => {
      expect(
        reference(path).serialize({
          reference: defaultReferenceSerializeOptions,
        })
      ).toEqual(expected)
    })

    it('should use default serialization options', () => {
      expect(reference('path').serialize()).toBe('$path')
    })
  })

  describe('toString', () => {
    it.each([['path', '{path}']])('%p should be %p', (path, expected) => {
      expect(reference(path).toString()).toBe(expected)
    })
  })

  describe('data type parsing', () => {
    describe('getDataType', () => {
      it.each([
        ['ref', DataType.Unknown],
        ['ref.(String)', DataType.String],
        ['ref.(Number)', DataType.Number],
      ])('should get from %p path data type %p', (path, expected) => {
        expect(getDataType(path)).toBe(expected)
      })

      test('should log warning for unexpected types', () => {
        console.warn = jest.fn()
        expect(getDataType('ref.(Boolean)')).toBe(DataType.Unknown)
        expect(console.warn).toHaveBeenCalledWith(
          'unsupported "Boolean" type casting'
        )
      })
    })

    describe('trimDataType', () => {
      it.each([
        ['ref', 'ref'],
        ['ref.(String)', 'ref'],
      ])('should trim %p path to %p', (path, expected) => {
        expect(trimDataType(path)).toBe(expected)
      })
    })

    describe('toNumber', () => {
      it.each([
        [1, 1],
        ['1', 1],
        ['1.1', 1.1],
        ['1,1', undefined],
        [true, undefined],
      ])('should parse %p as %p', (value, expected) => {
        expect(toNumber(value)).toBe(expected)
      })
    })

    describe('toString', () => {
      it.each([
        [1, '1'],
        ['1', '1'],
        [true, undefined],
      ])('should parse %p as %p', (value, expected) => {
        expect(toString(value)).toBe(expected)
      })
    })

    describe('toDataType', () => {
      it.each([
        [1, DataType.String, '1'],
        ['1', DataType.Number, 1],
        [true, DataType.Unknown, true],
      ])('should parse %p to %p as %p', (value, dataType, expected) => {
        expect(toDataType(dataType)(value)).toBe(expected)
      })

      test('should log warning for invalid parsing', () => {
        console.warn = jest.fn()
        expect(toDataType(DataType.String)(true)).toBe(undefined)
        expect(console.warn).toHaveBeenCalledWith(
          `failed to cast "true" to ${DataType.String}`
        )
      })
    })
  })

  describe('defaultReferenceSerializeOptions.from', () => {
    it.each([
      ['$path', 'path'],
      ['', undefined],
      ['path', undefined],
    ])('%p should be resolved as %p', (operand, expected) => {
      expect(defaultReferenceSerializeOptions.from(operand)).toBe(expected)
    })
  })

  describe('defaultReferenceSerializeOptions.to', () => {
    it.each([['path', '$path']])(
      '%p should be resolved as %p',
      (operand, expected) => {
        expect(defaultReferenceSerializeOptions.to(operand)).toBe(expected)
      }
    )
  })

  describe('isIgnoredPath', () => {
    const ignoredPaths = ['ignored', /\.ignored\./]
    it.each([
      ['ignored', true],
      ['root.ignored.property', true],
      ['expected', false],
    ])('%p should be resolved as %p', (path, expected) => {
      expect(isIgnoredPath(ignoredPaths, path)).toBe(expected)
    })
  })
})
