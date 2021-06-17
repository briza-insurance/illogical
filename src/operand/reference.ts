import {
  cond,
  constant,
  eq,
  identity,
  ifElse,
  pipe,
  rxMatches,
  stubTrue,
} from '../common/fp'
import { isNumber, isString, isUndefined } from '../common/type-check/'
import { asExpected } from '../common/utils'
import {
  Context,
  Evaluable,
  evaluable,
  Evaluated,
  isEvaluatedValue,
  SerializeOptions,
  SimplifyOptions,
} from '../evaluable'

export const KIND = Symbol('reference')

export type ReferenceSerializeOptions = {
  from: (operand: string) => undefined | string
  to: (operand: string) => string
}

export type ReferenceSimplifyOptions = {
  ignoredPaths: (RegExp | string)[]
}

export const defaultReferenceSerializeOptions: ReferenceSerializeOptions = {
  from: (operand: string) =>
    operand.length > 1 && operand.startsWith('$')
      ? operand.slice(1)
      : undefined,
  to: (operand: string) => `$${operand}`,
}

export enum DataType {
  Unknown = 'Unknown',
  Number = 'Number',
  String = 'String',
}

export const isValidDataType = (type: unknown): type is DataType =>
  `${type}` in DataType

export const getDataType = (path: string): DataType =>
  cond([
    [eq(null), constant(DataType.Unknown)],
    [isValidDataType, (dataType) => asExpected<DataType>(dataType)],
    [
      stubTrue,
      (dataType) => {
        console.warn(`unsupported "${dataType}" type casting`)
        return DataType.Unknown
      },
    ],
  ])(
    ((match) => (match ? match[1] : null))(
      path.match(/^.+\.\(([A-Z][a-z]+)\)$/)
    )
  )

export const trimDataType = (path: string): string =>
  path.replace(/.\(([A-Z][a-z]+)\)$/, '')

export const toNumber = (value: Evaluated): number | undefined =>
  cond([
    [isNumber, constant(asExpected<number>(value))],
    [
      isString,
      (value) =>
        cond([
          [rxMatches(/^\d+\.\d+$/), parseFloat],
          [rxMatches(/^0$|^[1-9]\d*$/), parseInt],
        ])(`${value}`),
    ],
  ])(value)

export const toString = (value: Evaluated): string | undefined =>
  cond([
    [isNumber, constant(`${value}`)],
    [isString, constant(asExpected<string>(value))],
  ])(value)

export const toDataType =
  (type: DataType) =>
  (value: Evaluated): Evaluated =>
    pipe(
      cond<DataType, Evaluated>([
        [eq(DataType.Number), () => toNumber(value)],
        [eq(DataType.String), () => toString(value)],
        [stubTrue, constant(value)],
      ]),
      (typed) => {
        if (!isUndefined(value) && isUndefined(typed)) {
          console.warn(`failed to cast "${value}" to ${type}`)
        }
        return typed
      }
    )(type)

type contextPath = string
type contextValue = unknown | undefined

export const contextLookup = (
  context: Context,
  path: string
): [contextPath, contextValue] => {
  let match: RegExpMatchArray | null = null
  do {
    match = path.match(/{([^{}]+)}/)
    if (match) {
      const nested = contextLookup(context, match[1])
      if (isUndefined(nested[1])) {
        return [path, undefined]
      }

      path =
        path.slice(0, match.index) +
        nested[1] +
        path.slice(Number(match.index) + match[0].length)
    }
  } while (match)

  let pointer = context
  for (const prop of path.split('.')) {
    pointer = <Context>pointer[prop.replace(/\[.+$/, '')]
    if (isUndefined(pointer)) {
      return [path, undefined]
    }

    for (const [, group] of prop.match(/\[(\d+)\]/g) ?? []) {
      const index = parseInt(group)
      if (!Array.isArray(pointer) || isUndefined(pointer[index])) {
        return [path, undefined]
      }
      pointer = pointer[index]
    }
  }

  return [path, pointer]
}

export const isIgnoredPath = (
  ignoredPaths: (RegExp | string)[],
  path: string
): boolean => ignoredPaths.some((pattern) => !!path.match(pattern))

const evaluate = (
  context: Context,
  path: string,
  dataType: DataType
): [contextPath, Evaluated] =>
  (([resolvedPath, result]): [contextPath, Evaluated] => [
    resolvedPath,
    pipe(
      ifElse(isEvaluatedValue, identity, () => {
        throw new Error(`invalid evaluated value at ${path} path`)
      }),
      toDataType(dataType)
    )(result),
  ])(contextLookup(context, path))

export const reference = (path: string): Evaluable =>
  ((path: string, dataType: DataType) =>
    evaluable({
      kind: KIND,
      evaluate: (context) =>
        (([, result]) => result)(evaluate(context, path, dataType)),
      simplify: function (
        context,
        { reference: options }: SimplifyOptions = {}
      ) {
        return ifElse(
          ([resolvedPath, result]: [contextPath, Evaluated]) =>
            !isUndefined(result) ||
            isIgnoredPath(options?.ignoredPaths ?? [], resolvedPath),
          ([, result]) => result,
          () => this
        )(evaluate(context, path, dataType))
      },
      serialize: ({ reference: options }: SerializeOptions = {}) =>
        (options ?? defaultReferenceSerializeOptions).to(
          ifElse(
            eq(DataType.Unknown),
            constant(path),
            constant(`${path}.(${dataType})`)
          )(dataType)
        ),
      toString: () => `{${path}}`,
    }))(trimDataType(path), getDataType(path))
