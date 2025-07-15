import { Context, Evaluable, Result } from '../common/evaluable'
import { isObject } from '../common/type-check'
import { toNumber, toString } from '../common/util'
import { Options } from '../parser/options'
import { Operand } from '.'

type Keys = (string | number)[]

const keyWithArrayIndexRegex =
  /^(?<currentKey>[^[\]]+?)(?<indexes>(?:\[\d+])+)?$/
const arrayIndexRegex = /\[(\d+)]/g

function parseBacktickWrappedKey(key: string) {
  return key.startsWith('`') && key.endsWith('`') ? key.slice(1, -1) : key
}

function parseKeyComponents(key: string) {
  const unwrappedKey = parseBacktickWrappedKey(key)
  const keys: Keys = []
  const parseResult = keyWithArrayIndexRegex.exec(unwrappedKey)
  if (parseResult) {
    const extractedKey = parseBacktickWrappedKey(
      parseResult?.groups?.currentKey ?? unwrappedKey
    )
    keys.push(extractedKey)
    const rawIndexes = parseResult?.groups?.indexes
    if (rawIndexes) {
      for (const indexResult of rawIndexes.matchAll(arrayIndexRegex)) {
        keys.push(parseInt(indexResult[1]))
      }
    }
  } else {
    keys.push(unwrappedKey)
  }
  return keys
}

function parseKey(key: string): Keys {
  const keys = key.match(/(`[^[\]]+`(\[\d+\])*|[^`.]+)/g)
  return !keys ? [] : keys.flatMap(parseKeyComponents)
}

const complexKeyExpression = /{([^{}]+)}/
function extractComplexKeys(ctx: Context, key: string): Keys | undefined {
  // Resolve complex keys
  let complexKeyMatches = complexKeyExpression.exec(key)

  while (complexKeyMatches) {
    const resolvedValue = complexValueLookup(ctx, complexKeyMatches[1])

    if (resolvedValue === undefined) {
      return undefined
    }

    key = key.replace(complexKeyExpression, `${resolvedValue}`)
    complexKeyMatches = complexKeyExpression.exec(key)
  }

  return parseKey(key)
}

const isContext = (value: unknown): value is Context => isObject(value)

const simpleValueLookup =
  (keys: Keys) =>
  (ctx: Context): Result => {
    let pointer: Context | Result | undefined = ctx

    for (const key of keys) {
      if (typeof key === 'number') {
        if (!Array.isArray(pointer)) {
          return undefined
        }
        pointer = pointer[key]
      } else if (!isContext(pointer)) {
        return undefined
      } else {
        pointer = pointer[key]
      }
    }

    return pointer
  }

/**
 * Lookup for the reference in the context.
 * The nested context value is annotated with "." delimiter.
 * @example address.city
 * @param {Context} ctx
 * @param {string} key Context lookup key.
 * @return {Result}
 */
function complexValueLookup(ctx: Context, key: string): Result {
  const keys = extractComplexKeys(ctx, key)
  if (!keys) {
    return undefined
  }
  return simpleValueLookup(keys ?? [])(ctx)
}

export enum DataType {
  Number = 'Number',
  String = 'String',
}

// Equivalent to /^.+\.\((Number|String)\)$/
const dataTypeRegex = new RegExp(
  `^.+\\.\\((${Object.keys(DataType).join('|')})\\)$`
)

const isComplexKey = (key: string) => key.indexOf('{') > -1

/**
 * Reference operand resolved within the context
 */
export class Reference extends Operand {
  private readonly key: string
  private readonly dataType: DataType | undefined
  private readonly valueLookup: (context: Context) => Result
  private readonly getKeys: (context: Context) => Keys | undefined

  /**
   * @constructor
   * @param {string} key Context key.
   */
  constructor(key: string) {
    if (key.trim() === '') {
      throw new Error('invalid reference key')
    }
    super()
    this.key = key

    const dataTypeMatch = dataTypeRegex.exec(this.key)
    if (dataTypeMatch) {
      this.dataType = DataType[dataTypeMatch[1] as keyof typeof DataType]
    }

    if (this.key.match(/.\(.+\)$/)) {
      this.key = this.key.replace(/.\(.+\)$/, '')
    }
    if (isComplexKey(this.key)) {
      this.valueLookup = (context) => complexValueLookup(context, this.key)
      this.getKeys = (context) => extractComplexKeys(context, this.key)
    } else {
      const keys = parseKey(this.key)
      this.valueLookup = simpleValueLookup(keys)
      this.getKeys = () => keys
    }
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {boolean}
   */
  evaluate(ctx: Context): Result {
    return this.toDataType(this.valueLookup(ctx))
  }

  /**
   * {@link Evaluable.simplify}
   */
  simplify(
    ctx: Context,
    strictKeys?: string[],
    optionalKeys?: string[]
  ): Result | Evaluable {
    const [key] = this.getKeys(ctx) ?? []

    if (ctx[key] !== undefined) {
      return this.evaluate(ctx)
    }

    if (!key || typeof key === 'number') {
      return this
    }

    return (strictKeys && strictKeys.includes(key)) ||
      (optionalKeys && !optionalKeys.includes(key))
      ? undefined
      : this
  }

  /**
   * {@link Evaluable.serialize}
   */
  serialize({ referenceSerialization }: Options): string {
    const key = this.dataType ? `${this.key}.(${this.dataType})` : this.key
    return referenceSerialization(key)
  }

  /**
   * Get the strict representation of the operand.
   * @return {string}
   */
  toString(): string {
    return `{${this.key}}`
  }

  /**
   * Converts a value to a specified data type
   * Silently returns original value if data type conversion has not been implemented.
   * @param value value to cast as data type
   */
  private toDataType(value: Result): Result {
    let result: Result = value
    switch (this.dataType) {
      case DataType.Number:
        result = toNumber(value)
        break
      case DataType.String:
        result = toString(value)
        break
    }
    if (value && result === undefined) {
      console.warn(`Casting ${value} to ${this.dataType} resulted in ${result}`)
    }
    return result
  }
}
