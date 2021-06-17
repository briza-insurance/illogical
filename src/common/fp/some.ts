import { Predicate } from '../types'

export const some =
  <T>(predicate: Predicate<T>) =>
  (items: T[]): boolean =>
    items.some(predicate)
