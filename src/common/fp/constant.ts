export const constant =
  <T>(value: T) =>
  (): T =>
    value
