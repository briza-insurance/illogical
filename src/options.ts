import { isObject, isUndefined } from './common/type-check/'
import { asExpected, hasOwnProperty } from './common/utils'
import { OperatorMapping } from './evaluable'
import {
  KIND_EQ,
  KIND_GE,
  KIND_GT,
  KIND_IN,
  KIND_LE,
  KIND_LT,
  KIND_NE,
  KIND_NOT_IN,
  KIND_OVERLAP,
  KIND_PREFIX,
  KIND_PRESENT,
  KIND_SUFFIX,
  KIND_UNDEF,
} from './expression/comparison'
import {
  KIND_AND,
  KIND_NOR,
  KIND_NOT,
  KIND_OR,
  KIND_XOR,
} from './expression/logical'
import {
  CollectionSerializeOptions,
  defaultEscapeCharacter,
} from './operand/collection'
import {
  defaultReferenceSerializeOptions,
  ReferenceSerializeOptions,
  ReferenceSimplifyOptions,
} from './operand/reference'

export type Options = {
  /** @deprecated Use serialize.reference option instead */
  referencePredicate: (operand: string) => boolean
  /** @deprecated Use serialize.reference option instead */
  referenceTransform: (operand: string) => string
  /** @deprecated Use serialize.reference option instead */
  referenceSerialization: (operand: string) => string

  serialize: {
    reference: ReferenceSerializeOptions
    collection: Omit<CollectionSerializeOptions, 'escapedOperators'>
  }
  simplify: {
    reference: ReferenceSimplifyOptions
  }
  operatorMapping: OperatorMapping
}

export const defaultOperatorMapping = new Map<symbol, string>([
  [KIND_EQ, '=='],
  [KIND_NE, '!='],
  [KIND_GT, '>'],
  [KIND_GE, '>='],
  [KIND_LT, '<'],
  [KIND_LE, '<='],
  [KIND_IN, 'IN'],
  [KIND_NOT_IN, 'NOT IN'],
  [KIND_PREFIX, 'PREFIX'],
  [KIND_SUFFIX, 'SUFFIX'],
  [KIND_OVERLAP, 'OVERLAP'],
  [KIND_UNDEF, 'UNDEFINED'],
  [KIND_PRESENT, 'PRESENT'],
  [KIND_AND, 'AND'],
  [KIND_OR, 'OR'],
  [KIND_NOR, 'NOR'],
  [KIND_XOR, 'XOR'],
  [KIND_NOT, 'NOT'],
])

export const defaultOptions: Options = {
  referencePredicate: function (operand) {
    return !isUndefined(this.serialize.reference.from(operand))
  },
  referenceTransform: function (operand) {
    return this.serialize.reference.from(operand) ?? ''
  },
  referenceSerialization: function (operand) {
    return this.serialize.reference.to(operand)
  },
  serialize: {
    reference: defaultReferenceSerializeOptions,
    collection: {
      escapeCharacter: defaultEscapeCharacter,
    },
  },
  simplify: {
    reference: {
      ignoredPaths: [],
    },
  },
  operatorMapping: defaultOperatorMapping,
}

const asObject = (value: unknown) => asExpected<Record<string, unknown>>(value)

export const overrideOptions =
  (base: Options) =>
  (override: Record<string, unknown>): Options => {
    const merge = (
      base: Record<string, unknown>,
      override: Record<string, unknown>
    ) =>
      Object.entries(base).reduce<Record<string, unknown>>(
        (merged, [property, value]) => {
          if (!hasOwnProperty(base, property)) {
            return merged
          }

          if (
            override[property] &&
            typeof value === typeof override[property]
          ) {
            merged[property] = isObject(value)
              ? merge(value, asObject(override[property]))
              : override[property]
            return merged
          }

          merged[property] = base[property]
          return merged
        },
        {}
      )

    return asExpected<Options>(merge(base, override))
  }
