export interface Functor<T> {
  map<U>(fn: (value: T) => U): U[]
}

export const map =
  <T, U>(fn: (item: T) => U) =>
  (functor: Functor<T>): U[] =>
    functor.map(fn)
