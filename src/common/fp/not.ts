export const not =
  <T>(fn: (value: T) => boolean) =>
  (value: T): boolean =>
    !fn(value)
