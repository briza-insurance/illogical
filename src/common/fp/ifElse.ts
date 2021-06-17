import { Predicate } from '../types'

export const ifElse =
  <T, S, U>(
    predicate: Predicate<T>,
    onTrue: (value: T) => S,
    onFalse: (value: T) => U
  ) =>
  (value: T): S | U =>
    predicate(value) ? onTrue(value) : onFalse(value)
