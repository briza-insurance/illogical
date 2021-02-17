/**
 * Operand module.
 * @module illogical/operand
 */

import { Context, Evaluable, Result } from '../common/evaluable'
import { isObject } from '../common/type-check'
import { toNumber, toString } from '../common/util'
import { Options } from '../parser/options'
import { Operand } from '.'

function extractKeys(ctx: Context, key: string): string[] | undefined {
  // Resolve complex keys
  const complexKeyExpression = /{([^{}]+)}/
  let complexKeyMatches = complexKeyExpression.exec(key)

  while (complexKeyMatches) {
    const resolvedValue = contextValueLookup(ctx, complexKeyMatches[1])

    if (resolvedValue === undefined) {
      return undefined
    }

    key = key.replace(complexKeyExpression, `${resolvedValue}`)
    complexKeyMatches = complexKeyExpression.exec(key)
  }

  let keys = [key]

  // Nested reference
  if (key.includes('.')) {
    keys = key.split('.')
  }
  return keys
}

/**
 * Lookup for the reference in the context.
 * The nested context value is annotated with "." delimiter.
 * @example address.city
 * @param {Context} ctx
 * @param {string} key Context lookup key.
 * @return {Result}
 */
function contextValueLookup(ctx: Context, key: string): Result {
  const keys = extractKeys(ctx, key)

  if (!keys) {
    return undefined
  }

  // Context pointer
  let pointer = ctx

  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i].replace(/\[.+$/, '')
    let currentValue = pointer[currentKey]

    // Resolve array notation
    keys[i].match(/\[\d+\]/g)?.forEach((match) => {
      const arrayIndex = parseInt(match.replace(/[[\]]/g, ''))

      if (
        !Array.isArray(currentValue) ||
        currentValue[arrayIndex] === undefined
      ) {
        currentValue = undefined
      } else {
        currentValue = currentValue[arrayIndex]
      }
    })

    // Last node
    if (i === keys.length - 1) {
      return currentValue as Result

      // Nested path
    } else if (currentValue !== undefined && isObject(currentValue)) {
      pointer = currentValue as Context

      // Invalid nested reference path
    } else {
      break
    }
  }

  return undefined
}

export enum DataType {
  Number = 'Number',
  String = 'String',
}

// Equivalent to /^.+\.\((Number|String)\)$/
const dataTypeRegex = new RegExp(
  `^.+\\.\\((${Object.keys(DataType).join('|')})\\)$`
)

/**
 * Reference operand resolved within the context
 */
export class Reference extends Operand {
  private readonly key: string
  private readonly dataType: DataType | undefined

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
  }

  /**
   * Evaluate in the given context.
   * @param {Context} ctx
   * @return {boolean}
   */
  evaluate(ctx: Context): Result {
    return this.toDataType(contextValueLookup(ctx, this.key))
  }

  /**
   * {@link Evaluable.simplify}
   */
  simplify(ctx: Context, ignoreKeys: string[]): Result | Evaluable {
    const keys = extractKeys(ctx, this.key)

    if (!keys) {
      return this
    }

    const key = keys[0].replace(/\[.+$/, '')
    if (ctx[key] !== undefined || ignoreKeys.includes(key)) {
      return this.evaluate(ctx)
    }
    return this
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
