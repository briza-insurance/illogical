export const eq =
  <T>(expected: T) =>
  (value: unknown): boolean =>
    expected === value
